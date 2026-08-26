import { Star } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminStarRatingProps {
  rating: number;
  className?: string;
}

export function AdminStarRating({ rating, className }: AdminStarRatingProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground opacity-30"
          )}
        />
      ))}
    </div>
  );
}
