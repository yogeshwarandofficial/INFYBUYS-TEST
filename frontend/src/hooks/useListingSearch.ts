import { useState, useEffect } from 'react';
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
  listingType: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 0,
  minRevenue: 0,
  status: 'all',
  location: 'all',
  listingType: 'all',
};

export function useListingSearch(itemsPerPage = 12) {
  const { addSearchHistory } = useBuyerStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      listingType: searchParams.get('type') || defaultFilters.listingType,
    };
  });

  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category && filters.category !== 'all') params.set('cat', filters.category);
    if (filters.minPrice > 0) params.set('minP', filters.minPrice.toString());
    if (filters.maxPrice > 0) params.set('maxP', filters.maxPrice.toString());
    if (filters.minRevenue > 0) params.set('minR', filters.minRevenue.toString());
    if (filters.status && filters.status !== 'all') params.set('st', filters.status);
    if (filters.location && filters.location !== 'all') params.set('loc', filters.location);
    if (filters.listingType && filters.listingType !== 'all') params.set('type', filters.listingType);
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, currentPage, setSearchParams]);

  // Fetch listings from backend using current filters
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        
        const params = new URLSearchParams();
        if (filters.query) params.set('search', filters.query);
        if (filters.category && filters.category !== 'all') params.set('category', filters.category);
        if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice > 0) params.set('maxPrice', filters.maxPrice.toString());
        if (filters.minRevenue > 0) params.set('minTurnover', filters.minRevenue.toString());
        if (filters.location && filters.location !== 'all') params.set('location', filters.location);
        if (filters.listingType && filters.listingType !== 'all') params.set('listingType', filters.listingType);
        
        let apiSort = sortBy;
        if (sortBy === 'price-asc') apiSort = 'price_low';
        else if (sortBy === 'price-desc') apiSort = 'price_high';
        params.set('sort', apiSort);
        
        params.set('page', currentPage.toString());
        params.set('limit', itemsPerPage.toString());

        const data = await apiClient.get<{ data: Listing[], meta: { total: number, totalPages: number } }>(`/listings?${params.toString()}`);
        setListings(data.data || []);
        setTotalResults(data.meta?.total || 0);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce slightly to prevent rapid API calls while typing
    const timeout = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, sortBy, currentPage, itemsPerPage]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset page on filter change

    // If it's a search query, save to history
    if (key === 'query' && value && typeof value === 'string') {
      const timeout = setTimeout(() => {
        addSearchHistory(value);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    setSortBy('newest');
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    listings,
    isLoading,
    error,
  };
}
