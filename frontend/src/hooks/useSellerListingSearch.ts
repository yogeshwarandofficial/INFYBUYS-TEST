import { useMemo, useState } from 'react';
import { useSellerStore, type SellerListingStatus } from '@/store/useSellerStore';

export type SellerListingSort =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'views'
  | 'enquiries';

export interface SellerListingFilters {
  search: string;
  status: SellerListingStatus | 'all';
  category: string;
  location: string;
  priceMin: string;
  priceMax: string;
  sort: SellerListingSort;
}

const ITEMS_PER_PAGE = 10;

export const defaultFilters: SellerListingFilters = {
  search: '',
  status: 'all',
  category: '',
  location: '',
  priceMin: '',
  priceMax: '',
  sort: 'newest',
};

export function useSellerListingSearch() {
  const { listings } = useSellerStore();
  const [filters, setFilters] = useState<SellerListingFilters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = <K extends keyof SellerListingFilters>(
    key: K,
    value: SellerListingFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...listings];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.title && l.title.toLowerCase().includes(q)) ||
          (l.category && l.category.toLowerCase().includes(q)) ||
          (l.location && l.location.toLowerCase().includes(q)) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((l) => l.status === filters.status);
    }

    if (filters.category) {
      result = result.filter((l) =>
        l.category && l.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter((l) =>
        l.location && l.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    const minPrice = filters.priceMin ? parseFloat(filters.priceMin) : null;
    const maxPrice = filters.priceMax ? parseFloat(filters.priceMax) : null;
    if (minPrice !== null) result = result.filter((l) => l.askingPrice >= minPrice);
    if (maxPrice !== null) result = result.filter((l) => l.askingPrice <= maxPrice);

    switch (filters.sort) {
      case 'oldest':
        result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      case 'price-asc':
        result.sort((a, b) => a.askingPrice - b.askingPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'enquiries':
        result.sort((a, b) => b.enquiries - a.enquiries);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  }, [listings, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [filtered, safePage]
  );

  // Unique values for filter dropdowns
  const categories = useMemo(
    () => [...new Set(listings.map((l) => l.category))].sort(),
    [listings]
  );
  const locations = useMemo(
    () => [...new Set(listings.map((l) => l.location))].sort(),
    [listings]
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.category !== '' ||
    filters.location !== '' ||
    filters.priceMin !== '' ||
    filters.priceMax !== '';

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
    categories,
    locations,
    hasActiveFilters,
  };
}
