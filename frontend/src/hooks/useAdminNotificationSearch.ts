import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminNotificationType } from '../store/useAdminStore';

export type AdminNotificationSortOption = 'newest' | 'oldest';

export interface AdminNotificationFiltersState {
  type: AdminNotificationType | 'all';
  status: 'all' | 'read' | 'unread';
}

export function useAdminNotificationSearch(itemsPerPage: number = 10) {
  const notifications = useAdminStore((state) => state.notifications);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminNotificationFiltersState>({
    type: 'all',
    status: 'all'
  });
  const [sorting, setSorting] = useState<AdminNotificationSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminNotificationFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: AdminNotificationSortOption) => {
    setSorting(newSort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ type: 'all', status: 'all' });
    setSorting('newest');
    setCurrentPage(1);
  };

  const filteredAndSortedNotifications = useMemo(() => {
    let result = [...notifications];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        notif =>
          notif.title.toLowerCase().includes(query) ||
          notif.message.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.type !== 'all') {
      result = result.filter(notif => notif.type === filters.type);
    }

    if (filters.status !== 'all') {
      const isRead = filters.status === 'read';
      result = result.filter(notif => notif.isRead === isRead);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sorting) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [notifications, search, filters, sorting]);

  const totalPages = Math.ceil(filteredAndSortedNotifications.length / itemsPerPage) || 1;
  const paginatedNotifications = filteredAndSortedNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    notifications: filteredAndSortedNotifications,
    paginatedNotifications,
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
    totalCount: filteredAndSortedNotifications.length,
    unreadCount: notifications.filter(n => !n.isRead).length
  };
}
