import React from 'react';
import { Heart } from 'lucide-react';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import { useUserStore } from '@/store/useUserStore';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  iconClassName?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ listingId, className = '', iconClassName = '' }) => {
  const isFavorite = useIsFavorite(listingId);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { user } = useUserStore();

  // If not logged in as a buyer, we could either hide it or show it but redirect to login.
  // The PRD says it's for authenticated buyers. We'll show it if they are a buyer.
  const isBuyer = user?.roles?.includes('BUYER');

  if (!isBuyer) return null;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFavorite.mutate(listingId);
    } else {
      addFavorite.mutate(listingId);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm transition-all duration-200 focus:outline-none ${className}`}
      aria-label={isFavorite ? "Remove from saved listings" : "Save listing"}
    >
      <Heart
        className={`w-5 h-5 transition-colors duration-200 ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500 hover:text-red-500'
        } ${iconClassName}`}
      />
    </button>
  );
};
