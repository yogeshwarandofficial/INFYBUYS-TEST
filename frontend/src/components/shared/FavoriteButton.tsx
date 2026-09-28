import React from 'react';
import { Heart } from 'lucide-react';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';

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
  const isBuyer = user?.roles?.some(r => r.toLowerCase() === 'buyer');

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
      className={cn("w-[38px] h-[38px] flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-sm border border-slate-100 hover:border-slate-200 transition-all duration-300 focus:outline-none hover:shadow-md hover:-translate-y-0.5 group", className)}
      aria-label={isFavorite ? "Remove from saved listings" : "Save listing"}
    >
      <Heart
        className={cn("w-[18px] h-[18px] transition-all duration-300", 
          isFavorite 
            ? 'fill-red-500 text-red-500 scale-110' 
            : 'text-slate-500 group-hover:text-red-500 group-hover:scale-110',
          iconClassName
        )}
      />
    </button>
  );
};
