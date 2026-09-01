import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminBuyerStatus, AdminBuyerVerificationStatus } from '../store/useAdminStore';

export type AdminBuyerSortOption =
  | 'newest'
  | 'oldest'
  | 'recentlyActive'
  | 'mostEnquiries'
  | 'mostMessages';

export interface AdminBuyerFiltersState {
  status: AdminBuyerStatus | 'all';
  verification: AdminBuyerVerificationStatus | 'all';
}

export function useAdminBuyerSearch(itemsPerPage: number = 10) {
  const buyers = useAdminStore((state) => state.buyers);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminBuyerFiltersState>({
    status: 'all',
    verification: 'all',
  });
  const [sorting, setSorting] = useState<AdminBuyerSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminBuyerFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: AdminBuyerSortOption) => {
    setSorting(newSort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ status: 'all', verification: 'all' });
    setSorting('newest');
    setCurrentPage(1);
  };

  const filteredAndSortedBuyers = useMemo(() => {
    let result = [...buyers];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        buyer =>
          buyer.name.toLowerCase().includes(query) ||
          buyer.email.toLowerCase().includes(query) ||
          (buyer.company && buyer.company.toLowerCase().includes(query)) ||
          (buyer.phone && buyer.phone.toLowerCase().includes(query)) ||
          (buyer.location && buyer.location.toLowerCase().includes(query))
      );
    }

    // Filters
    if (filters.status !== 'all') {
      result = result.filter(buyer => buyer.status === filters.status);
    }

    if (filters.verification !== 'all') {
      result = result.filter(buyer => buyer.verificationStatus === filters.verification);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sorting) {
        case 'newest':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case 'oldest':
          return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        case 'recentlyActive':
          if (!a.lastActiveAt) return 1;
          if (!b.lastActiveAt) return -1;
          return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
        case 'mostEnquiries':
          return b.totalEnquiries - a.totalEnquiries;
        case 'mostMessages':
          return b.totalMessages - a.totalMessages;
        default:
          return 0;
      }
    });

    return result;
  }, [buyers, search, filters, sorting]);

  const totalPages = Math.ceil(filteredAndSortedBuyers.length / itemsPerPage) || 1;
  const paginatedBuyers = filteredAndSortedBuyers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    buyers: filteredAndSortedBuyers,
    paginatedBuyers,
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
    totalCount: filteredAndSortedBuyers.length
  };
}
