import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { Listing } from '@/types/api';

export interface FavoriteItem {
  favoriteCreatedAt: string;
  listing: Listing;
}

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.get<FavoriteItem[]>('/favorites/me'),
  });
};

export const useIsFavorite = (listingId?: string) => {
  const { data: favorites } = useFavorites();
  
  if (!listingId || !favorites) return false;
  return favorites.some(f => f.listing.id === listingId);
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => apiClient.post(`/favorites/${listingId}`, {}),
    onMutate: async (listingId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(['favorites']);

      // Optimistically add to favorites list if not there
      if (previousFavorites) {
        queryClient.setQueryData<FavoriteItem[]>(['favorites'], old => {
          if (!old) return old;
          if (old.some(f => f.listing.id === listingId)) return old;
          
          // We don't have the full listing data here, but we can mock enough to make `useIsFavorite` work.
          // The actual data will be fetched on invalidation or next load.
          return [
            ...old,
            {
              favoriteCreatedAt: new Date().toISOString(),
              listing: { id: listingId } as Listing,
            }
          ];
        });
      }

      return { previousFavorites };
    },
    onError: (_err, _newFavorite, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => apiClient.delete(`/favorites/${listingId}`),
    onMutate: async (listingId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(['favorites']);

      if (previousFavorites) {
        queryClient.setQueryData<FavoriteItem[]>(['favorites'], old => {
          if (!old) return old;
          return old.filter(f => f.listing.id !== listingId);
        });
      }

      return { previousFavorites };
    },
    onError: (_err, _newFavorite, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
