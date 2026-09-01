import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminEnquiryStatus } from '../store/useAdminStore';

export type AdminEnquirySortOption =
  | 'newest'
  | 'oldest'
  | 'valueHighToLow'
  | 'valueLowToHigh'
  | 'recentlyUpdated';

export interface AdminEnquiryFiltersState {
  status: AdminEnquiryStatus | 'all';
  nda: 'all' | 'signed' | 'pending' | 'none';
}

export function useAdminEnquirySearch(itemsPerPage: number = 10) {
  const enquiries = useAdminStore((state) => state.enquiries);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminEnquiryFiltersState>({
    status: 'all',
    nda: 'all'
  });
  const [sorting, setSorting] = useState<AdminEnquirySortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminEnquiryFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: AdminEnquirySortOption) => {
    setSorting(newSort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ status: 'all', nda: 'all' });
    setSorting('newest');
    setCurrentPage(1);
  };

  const filteredAndSortedEnquiries = useMemo(() => {
    let result = [...enquiries];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        enq =>
          enq.listingTitle.toLowerCase().includes(query) ||
          enq.buyerName.toLowerCase().includes(query) ||
          enq.sellerName.toLowerCase().includes(query) ||
          (enq.buyerCompany && enq.buyerCompany.toLowerCase().includes(query))
      );
    }

    // Filters
    if (filters.status !== 'all') {
      result = result.filter(enq => enq.status === filters.status);
    }

    if (filters.nda !== 'all') {
      if (filters.nda === 'none') {
        result = result.filter(enq => !enq.hasNda);
      } else {
        result = result.filter(enq => enq.hasNda && enq.ndaStatus === filters.nda);
      }
    }

    // Sorting
    result.sort((a, b) => {
      switch (sorting) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'recentlyUpdated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'valueHighToLow':
          return b.listingValue - a.listingValue;
        case 'valueLowToHigh':
          return a.listingValue - b.listingValue;
        default:
          return 0;
      }
    });

    return result;
  }, [enquiries, search, filters, sorting]);

  const totalPages = Math.ceil(filteredAndSortedEnquiries.length / itemsPerPage) || 1;
  const paginatedEnquiries = filteredAndSortedEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    enquiries: filteredAndSortedEnquiries,
    paginatedEnquiries,
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
    totalCount: filteredAndSortedEnquiries.length
  };
}
