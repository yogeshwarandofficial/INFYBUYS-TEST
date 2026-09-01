import { Button } from '@/components/ui/button';
import { useBuyerStore } from '@/store/useBuyerStore';
import { useUserStore } from '@/store/useUserStore';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export function FavoriteButton({ listingId, className }: FavoriteButtonProps) {
  const { user } = useUserStore();
  const { favorites, toggleFavorite } = useBuyerStore();

  // Only buyers can favorite
  if (user?.roles && !user.roles.some(r => r.toLowerCase() === 'buyer')) {
    return null;
  }

  const isFavorite = favorites.includes(listingId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    e.stopPropagation();
    toggleFavorite(listingId);
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 shadow-sm transition-colors",
        isFavorite ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background/80 backdrop-blur-sm hover:bg-background",
        className
      )}
      onClick={handleToggle}
      aria-label={isFavorite ? "Remove listing from favorites" : "Save listing"}
    >
      <Heart className={cn("h-4 w-4", isFavorite ? "fill-current" : "")} />
    </Button>
  );
}
