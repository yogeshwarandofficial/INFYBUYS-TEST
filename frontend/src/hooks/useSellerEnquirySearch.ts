import { useMemo, useState } from 'react';
import type { Enquiry } from '@/types/api';

export type SellerEnquirySort =
  | 'newest'
  | 'oldest'
  | 'recently-updated';

export type SellerEnquiryStatusFilter = 'all' | 'unread';

export interface SellerEnquiryFilters {
  search: string;
  status: SellerEnquiryStatusFilter;
  sort: SellerEnquirySort;
}

const ITEMS_PER_PAGE = 12;

export const defaultEnquiryFilters: SellerEnquiryFilters = {
  search: '',
  status: 'all',
  sort: 'recently-updated',
};

export function useSellerEnquirySearch(enquiries: Enquiry[] = []) {
  const [filters, setFilters] = useState<SellerEnquiryFilters>(defaultEnquiryFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = <K extends keyof SellerEnquiryFilters>(
    key: K,
    value: SellerEnquiryFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultEnquiryFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...enquiries];

    // Text search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.buyer?.name.toLowerCase().includes(q) ||
          e.listing?.title.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.status === 'unread') {
      result = result.filter((e) => e.unreadCount && e.unreadCount > 0);
    }

    // Sort
    switch (filters.sort) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'recently-updated':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [enquiries, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [filtered, safePage]
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all';

  return {
    filters,
    updateFilter,
    resetFilters,
    filtered,
    paginated,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    totalCount: filtered.length,
    hasActiveFilters,
  };
}
