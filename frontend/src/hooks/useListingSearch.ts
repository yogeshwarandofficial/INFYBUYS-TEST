import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { Listing, ApiResponse } from '@/types/api';

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRevenue: number;
  status: string;
  location: string;
  listingType?: string;
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

  // Initialize from URL params or default
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      query: searchParams.get('q') || defaultFilters.query,
      category: searchParams.get('category') || searchParams.get('cat') || defaultFilters.category,
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
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice > 0) params.set('minP', filters.minPrice.toString());
    if (filters.maxPrice > 0) params.set('maxP', filters.maxPrice.toString());
    if (filters.minRevenue > 0) params.set('minR', filters.minRevenue.toString());
    if (filters.status !== 'all') params.set('st', filters.status);
    if (filters.location !== 'all') params.set('loc', filters.location);
    if (filters.listingType && filters.listingType !== 'all') params.set('type', filters.listingType);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, currentPage, setSearchParams]);

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
  };

  // Build query string for the API call
  const queryParams = new URLSearchParams();
  if (filters.query) queryParams.set('search', filters.query);
  if (filters.category !== 'all') queryParams.set('category', filters.category);
  if (filters.minPrice > 0) queryParams.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice > 0) queryParams.set('maxPrice', filters.maxPrice.toString());
  if (filters.minRevenue > 0) queryParams.set('minTurnover', filters.minRevenue.toString());
  // Normal search usually only returns PUBLISHED, but if status is passed we can include it
  if (filters.status !== 'all') queryParams.set('status', filters.status.toUpperCase());
  if (filters.location !== 'all') queryParams.set('location', filters.location);
  if (filters.listingType && filters.listingType !== 'all') queryParams.set('listingType', filters.listingType.toUpperCase());
  
  if (sortBy) {
    if (sortBy === 'price-asc') queryParams.set('sort', 'price_low');
    else if (sortBy === 'price-desc') queryParams.set('sort', 'price_high');
    else if (sortBy === 'newest') queryParams.set('sort', 'newest');
  }
  
  queryParams.set('page', currentPage.toString());
  queryParams.set('limit', itemsPerPage.toString());

  const queryString = queryParams.toString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['listings', queryString],
    queryFn: async () => {
      return apiClient.get<ApiResponse<Listing[]>>(`/listings?${queryString}`);
    },
  });

  const listings = data?.data || [];
  const totalResults = data?.meta?.totalItems || 0;
  const totalPages = data?.meta?.totalPages || 0;

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
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
