import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminConversationStatus } from '../store/useAdminStore';

export type AdminConversationSortOption =
  | 'newestUpdated'
  | 'oldestUpdated'
  | 'mostMessages';

export interface AdminConversationFiltersState {
  status: AdminConversationStatus | 'all';
}

export function useAdminConversationSearch(itemsPerPage: number = 10) {
  const conversations = useAdminStore((state) => state.conversations);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminConversationFiltersState>({
    status: 'all'
  });
  const [sorting, setSorting] = useState<AdminConversationSortOption>('newestUpdated');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminConversationFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: AdminConversationSortOption) => {
    setSorting(newSort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ status: 'all' });
    setSorting('newestUpdated');
    setCurrentPage(1);
  };

  const filteredAndSortedConversations = useMemo(() => {
    let result = [...conversations];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        conv =>
          conv.listingTitle.toLowerCase().includes(query) ||
          conv.buyerName.toLowerCase().includes(query) ||
          conv.sellerName.toLowerCase().includes(query) ||
          conv.messages.some(m => m.content.toLowerCase().includes(query))
      );
    }

    // Filters
    if (filters.status !== 'all') {
      result = result.filter(conv => conv.status === filters.status);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sorting) {
        case 'newestUpdated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldestUpdated':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'mostMessages':
          return b.messages.length - a.messages.length;
        default:
          return 0;
      }
    });

    return result;
  }, [conversations, search, filters, sorting]);

  const totalPages = Math.ceil(filteredAndSortedConversations.length / itemsPerPage) || 1;
  const paginatedConversations = filteredAndSortedConversations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    conversations: filteredAndSortedConversations,
    paginatedConversations,
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
    totalCount: filteredAndSortedConversations.length
  };
}
