import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { apiClient } from '@/services/apiClient';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { Listing } from '@/types/api';

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRevenue: number;
  status: string;
  location: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 0,
  minRevenue: 0,
  status: 'all',
  location: 'all',
};

export function useListingSearch(itemsPerPage = 12) {
  const { addSearchHistory } = useBuyerStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get<{ data: Listing[] }>('/listings');
        setAllListings(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Initialize from URL params or default
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      query: searchParams.get('q') || defaultFilters.query,
      category: searchParams.get('cat') || defaultFilters.category,
      minPrice: Number(searchParams.get('minP')) || defaultFilters.minPrice,
      maxPrice: Number(searchParams.get('maxP')) || defaultFilters.maxPrice,
      minRevenue: Number(searchParams.get('minR')) || defaultFilters.minRevenue,
      status: searchParams.get('st') || defaultFilters.status,
      location: searchParams.get('loc') || defaultFilters.location,
    };
  });

  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category !== 'all') params.set('cat', filters.category);
    if (filters.minPrice > 0) params.set('minP', filters.minPrice.toString());
    if (filters.maxPrice > 0) params.set('maxP', filters.maxPrice.toString());
    if (filters.minRevenue > 0) params.set('minR', filters.minRevenue.toString());
    if (filters.status !== 'all') params.set('st', filters.status);
    if (filters.location !== 'all') params.set('loc', filters.location);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, currentPage, setSearchParams]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset page on filter change

    // If it's a search query, save to history
    if (key === 'query' && value && typeof value === 'string') {
      // Debouncing could be added here, but for mock purposes we'll just add it
      const timeout = setTimeout(() => {
        addSearchHistory(value);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const filteredListings = useMemo(() => {
    let result = [...allListings];

    // Query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category && filters.category !== 'all') {
      result = result.filter((l) => l.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Price
    if (filters.minPrice > 0) {
      result = result.filter((l) => Number(l.priceOrRent) >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      result = result.filter((l) => Number(l.priceOrRent) <= filters.maxPrice);
    }

    // Revenue
    if (filters.minRevenue > 0) {
      result = result.filter((l) => (Number(l.turnover) || 0) >= filters.minRevenue);
    }

    // Location
    if (filters.location && filters.location !== 'all') {
      result = result.filter((l) => l.locationArea?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.priceOrRent) - Number(b.priceOrRent));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.priceOrRent) - Number(a.priceOrRent));
        break;
      case 'revenue-desc':
        result.sort((a, b) => (Number(b.turnover) || 0) - (Number(a.turnover) || 0));
        break;
      case 'newest':
      default:
        // Mock data doesn't have reliable dates, we assume original array is "newest"
        break;
    }

    return result;
  }, [filters, sortBy, allListings]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults: filteredListings.length,
    listings: paginatedListings,
    isLoading,
    error,
  };
}
