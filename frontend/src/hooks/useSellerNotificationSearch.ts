import { useMemo, useState } from 'react';
import { useSellerStore, type SellerNotificationType, type SellerNotificationPriority } from '@/store/useSellerStore';

export type SellerNotificationSort = 'newest' | 'oldest' | 'highest-priority';
export type SellerNotificationStatusFilter = 'all' | 'unread' | 'read';
export type SellerNotificationTypeFilter = SellerNotificationType | 'all';
export type SellerNotificationPriorityFilter = SellerNotificationPriority | 'all';

export interface SellerNotificationFilters {
  search: string;
  status: SellerNotificationStatusFilter;
  type: SellerNotificationTypeFilter;
  priority: SellerNotificationPriorityFilter;
  sort: SellerNotificationSort;
}

const ITEMS_PER_PAGE = 15;

export const defaultNotificationFilters: SellerNotificationFilters = {
  search: '',
  status: 'all',
  type: 'all',
  priority: 'all',
  sort: 'newest',
};

const PRIORITY_WEIGHT: Record<SellerNotificationPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function useSellerNotificationSearch() {
  const { notifications } = useSellerStore();
  const [filters, setFilters] = useState<SellerNotificationFilters>(defaultNotificationFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = <K extends keyof SellerNotificationFilters>(
    key: K,
    value: SellerNotificationFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultNotificationFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...notifications];

    // Text search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.status === 'unread') {
      result = result.filter((n) => !n.isRead);
    } else if (filters.status === 'read') {
      result = result.filter((n) => n.isRead);
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((n) => n.type === filters.type);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      result = result.filter((n) => n.priority === filters.priority);
    }

    // Sort
    switch (filters.sort) {
      case 'oldest':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'highest-priority':
        result.sort((a, b) => {
          const weightDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          if (weightDiff !== 0) return weightDiff;
          return b.createdAt.localeCompare(a.createdAt); // Fallback to newest
        });
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  }, [notifications, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [filtered, safePage]
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.priority !== 'all';

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
