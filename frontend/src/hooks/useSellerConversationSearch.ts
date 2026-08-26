import { useMemo, useState } from 'react';
import { useSellerStore, type SellerConversationStatus } from '@/store/useSellerStore';

export type SellerConversationSort =
  | 'newest'
  | 'oldest'
  | 'recently-updated'
  | 'most-unread';

export type SellerConversationStatusFilter = SellerConversationStatus | 'all' | 'unread';

export interface SellerConversationFilters {
  search: string;
  status: SellerConversationStatusFilter;
  sort: SellerConversationSort;
}

const ITEMS_PER_PAGE = 15;

export const defaultConversationFilters: SellerConversationFilters = {
  search: '',
  status: 'all',
  sort: 'newest',
};

export function useSellerConversationSearch() {
  const { conversations } = useSellerStore();
  const [filters, setFilters] = useState<SellerConversationFilters>(defaultConversationFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = <K extends keyof SellerConversationFilters>(
    key: K,
    value: SellerConversationFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultConversationFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...conversations];

    // Text search across buyer fields + last message + message content
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.buyerName.toLowerCase().includes(q) ||
          (c.buyerCompany ?? '').toLowerCase().includes(q) ||
          c.listingTitle.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q) ||
          c.messages.some((m) => m.message.toLowerCase().includes(q))
      );
    }

    // Status / unread filter
    if (filters.status === 'unread') {
      result = result.filter((c) => c.unreadCount > 0);
    } else if (filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }

    // Sort
    switch (filters.sort) {
      case 'oldest':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'recently-updated':
        result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
      case 'most-unread':
        result.sort((a, b) => b.unreadCount - a.unreadCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
        break;
    }

    return result;
  }, [conversations, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [filtered, safePage]
  );

  const hasActiveFilters = filters.search !== '' || filters.status !== 'all';

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
