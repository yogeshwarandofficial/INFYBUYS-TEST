import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminListingStatus } from '../store/useAdminStore';

export type AdminListingSortOption =
  | 'newest'
  | 'oldest'
  | 'priceHighToLow'
  | 'priceLowToHigh'
  | 'mostViews'
  | 'mostEnquiries';

export interface AdminListingFiltersState {
  status: AdminListingStatus | 'all';
  category: string | 'all';
  verification: 'all' | 'verified' | 'unverified';
}

export function useAdminListingSearch(itemsPerPage: number = 10) {
  const listings = useAdminStore((state) => state.listings);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminListingFiltersState>({
    status: 'all',
    category: 'all',
    verification: 'all'
  });
  const [sorting, setSorting] = useState<AdminListingSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    listings.forEach(listing => {
      if (listing.category) {
        cats.add(listing.category);
      }
    });
    return Array.from(cats).sort();
  }, [listings]);

  // Reset pagination when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminListingFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: AdminListingSortOption) => {
    setSorting(newSort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ status: 'all', category: 'all', verification: 'all' });
    setSorting('newest');
    setCurrentPage(1);
  };

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        listing =>
          (listing.title && listing.title.toLowerCase().includes(query)) ||
          (listing.description && listing.description.toLowerCase().includes(query)) ||
          (listing.sellerName && listing.sellerName.toLowerCase().includes(query)) ||
          (listing.sellerCompany && listing.sellerCompany.toLowerCase().includes(query)) ||
          (listing.location && listing.location.toLowerCase().includes(query))
      );
    }

    // Filters
    if (filters.status !== 'all') {
      const statusMap: Record<string, string[]> = {
        'pending': ['pending', 'SUBMITTED_FOR_REVIEW'],
        'active': ['active', 'PUBLISHED'],
        'suspended': ['suspended', 'PAUSED'],
        'rejected': ['rejected', 'REJECTED'],
        'draft': ['draft', 'DRAFT'],
        'sold': ['sold', 'SOLD_LET'],
        'closed': ['closed', 'EXPIRED']
      };

      const allowedStatuses = statusMap[filters.status as string] || [filters.status];
      result = result.filter(listing => allowedStatuses.includes(listing.status));
    }

    if (filters.category !== 'all') {
      result = result.filter(listing => listing.category === filters.category);
    }

    if (filters.verification !== 'all') {
      const isVerified = filters.verification === 'verified';
      result = result.filter(listing => listing.isVerified === isVerified);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sorting) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priceHighToLow':
          return b.price - a.price;
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'mostViews':
          return b.views - a.views;
        case 'mostEnquiries':
          return b.enquiries - a.enquiries;
        default:
          return 0;
      }
    });

    return result;
  }, [listings, search, filters, sorting]);

  const totalPages = Math.ceil(filteredAndSortedListings.length / itemsPerPage) || 1;
  const paginatedListings = filteredAndSortedListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    listings: filteredAndSortedListings,
    paginatedListings,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilters: handleFilterChange,
    sorting,
    setSorting: handleSortChange,
    resetFilters,
    totalCount: filteredAndSortedListings.length,
    categories
  };
}
