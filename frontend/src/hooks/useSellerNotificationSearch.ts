import { useState } from 'react';
import { useNotifications } from './useNotifications';

export type SellerNotificationSort = 'newest' | 'oldest' | 'highest-priority';
export type SellerNotificationStatusFilter = 'all' | 'unread' | 'read';
export type SellerNotificationTypeFilter = string | 'all';
export type SellerNotificationPriorityFilter = string | 'all';

export interface SellerNotificationFilters {
  search: string;
  status: SellerNotificationStatusFilter;
  type: SellerNotificationTypeFilter;
  priority: SellerNotificationPriorityFilter;
  sort: SellerNotificationSort;
}

export function useSellerNotificationSearch() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useNotifications(currentPage, 15);

  const paginated = data?.data || [];
  const totalPages = data?.meta.totalPages || 1;
  const totalCount = data?.meta.total || 0;

  // Mock filters to satisfy existing components temporarily
  const filters: SellerNotificationFilters = { search: '', status: 'all', type: 'all', priority: 'all', sort: 'newest' };
  const updateFilter = (_key: string, _value: any) => {};
  const resetFilters = () => {};
  const hasActiveFilters = false;
  const filtered = paginated;

  return {
    filters,
    updateFilter,
    resetFilters,
    filtered,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    hasActiveFilters,
    isLoading,
  };
}
