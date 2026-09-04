import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export interface SavedSearch {
  id: string;
  buyerId: string;
  name: string;
  search?: string | null;
  listingType?: string | null;
  category?: string | null;
  location?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  filtersJson?: any;
  alertFrequency?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useSavedSearches() {
  return useQuery<SavedSearch[], Error>({
    queryKey: ['saved-searches'],
    queryFn: async () => {
      const response = await apiClient.get<SavedSearch[]>('/saved-searches');
      return response;
    },
  });
}

export function useSavedSearch(id: string) {
  return useQuery<SavedSearch, Error>({
    queryKey: ['saved-searches', id],
    queryFn: async () => {
      const response = await apiClient.get<SavedSearch>(`/saved-searches/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SavedSearch>) => {
      return await apiClient.post<SavedSearch>('/saved-searches', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
    },
  });
}

export function useUpdateSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SavedSearch> }) => {
      return await apiClient.patch<SavedSearch>(`/saved-searches/${id}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      queryClient.invalidateQueries({ queryKey: ['saved-searches', data.id] });
    },
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/saved-searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
    },
  });
}
