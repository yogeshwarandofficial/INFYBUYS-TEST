import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminSellerStatus } from '../store/useAdminStore';

export interface AdminSellerFiltersState {
  status?: AdminSellerStatus | 'all';
  sellerType?: string | 'all';
  emailVerified?: boolean | 'all';
  phoneVerified?: boolean | 'all';
  profileCompleted?: boolean | 'all';
}

export type AdminSellerSortOption = 'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'mostListings' | 'mostViews' | 'mostEnquiries';

export function useAdminSellerSearch() {
  const sellers = useAdminStore((state) => state.sellers);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminSellerFiltersState>({
    status: 'all',
    sellerType: 'all',
    emailVerified: 'all',
    phoneVerified: 'all',
    profileCompleted: 'all',
  });
  const [sorting, setSorting] = useState<AdminSellerSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminSellerFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortingChange = (newSorting: AdminSellerSortOption) => {
    setSorting(newSorting);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({
      status: 'all',
      sellerType: 'all',
      emailVerified: 'all',
      phoneVerified: 'all',
      profileCompleted: 'all',
    });
    setSorting('newest');
    setCurrentPage(1);
  };

  const filteredSellers = useMemo(() => {
    let result = [...sellers];

    // Search
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerSearch) ||
          s.email.toLowerCase().includes(lowerSearch) ||
          (s.companyName && s.companyName.toLowerCase().includes(lowerSearch)) ||
          (s.location && s.location.toLowerCase().includes(lowerSearch)) ||
          (s.sellerType && s.sellerType.toLowerCase().includes(lowerSearch))
      );
    }

    // Filters
    if (filters.status && filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters.sellerType && filters.sellerType !== 'all') {
      result = result.filter((s) => s.sellerType === filters.sellerType);
    }
    if (filters.emailVerified !== undefined && filters.emailVerified !== 'all') {
      result = result.filter((s) => s.emailVerified === filters.emailVerified);
    }
    if (filters.phoneVerified !== undefined && filters.phoneVerified !== 'all') {
      result = result.filter((s) => s.phoneVerified === filters.phoneVerified);
    }
    if (filters.profileCompleted !== undefined && filters.profileCompleted !== 'all') {
      result = result.filter((s) => s.profileCompleted === filters.profileCompleted);
    }

    // Sort
    result.sort((a, b) => {
      switch (sorting) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'mostListings':
          return b.listingCount - a.listingCount;
        case 'mostViews':
          return b.totalViews - a.totalViews;
        case 'mostEnquiries':
          return b.enquiryCount - a.enquiryCount;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [sellers, search, filters, sorting]);

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSellers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSellers, currentPage]);

  return {
    filteredSellers,
    paginatedSellers,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilters: handleFilterChange,
    sorting,
    setSorting: handleSortingChange,
    resetFilters,
  };
}
