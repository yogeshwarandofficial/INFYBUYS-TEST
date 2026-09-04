import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Building2, TrendingUp, DollarSign } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

export type ListingCardVariant = 'featured' | 'latest' | 'premium' | 'similar' | 'compact';

interface ListingCardProps {
  listing: any;
  variant?: ListingCardVariant;
  className?: string;
  showFavoriteButton?: boolean;
}

export function ListingCard({ listing, variant = 'latest', className, showFavoriteButton = true }: ListingCardProps) {
  const isCompact = variant === 'compact' || variant === 'similar';

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg relative', className)}>
      {showFavoriteButton && (
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton listingId={listing.id} />
        </div>
      )}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {(() => {
          const coverMedia = listing.media?.find((m: any) => m.id === listing.coverMediaId);
          const firstPhoto = listing.media?.find((m: any) => m.type === 'PHOTO');
          const heroUrl = coverMedia?.url || firstPhoto?.url;

          if (heroUrl) {
            return (
              <img src={heroUrl} alt={listing.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
            );
          }
          return (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <DollarSign className="w-10 h-10 text-primary/30" />
            </div>
          );
        })()}
        {listing.status === 'SOLD_LET' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[2px]">
            <div className="bg-red-600 text-white font-black text-2xl tracking-widest px-6 py-2 rounded shadow-lg border-2 border-white/20 rotate-[-12deg]">
              SOLD
            </div>
          </div>
        )}
      </div>
      <CardHeader className={cn(isCompact ? 'p-4' : 'p-6', 'pb-4')}>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={listing.isPremium ? 'default' : 'secondary'}>
            {listing.category}
          </Badge>
          {listing.isFeatured && variant !== 'compact' && (
            <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
          )}
        </div>
        <CardTitle className={cn('font-bold leading-tight', isCompact ? 'text-lg' : 'text-xl')}>
          {listing.title}
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(isCompact ? 'p-4 pt-0' : 'p-6 pt-0')}>
        {!isCompact && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {listing.priceOrRent != null && (
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1 text-primary" />
              <span className="font-semibold text-foreground">
                ${((Number(listing.priceOrRent) || 0) / 1000).toFixed(0)}k
              </span>
              <span className="ml-1 text-xs">Asking</span>
            </div>
          )}
          {listing.netProfit != null && (
            <div className="flex items-center text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-1 text-success" />
              <span className="font-semibold text-foreground">
                ${((Number(listing.netProfit) || 0) / 1000).toFixed(1)}k
              </span>
              <span className="ml-1 text-xs">Profit</span>
            </div>
          )}
        </div>

        {!isCompact && listing.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {listing.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className={cn(isCompact ? 'p-4 pt-0' : 'p-6 pt-0', 'flex justify-between items-center')}>
        {listing.type ? (
          <span className="text-xs text-muted-foreground flex items-center">
            <Building2 className="w-3 h-3 mr-1" />
            {listing.type}
          </span>
        ) : (
          <span />
        )}
        <Button variant={variant === 'premium' ? 'default' : 'secondary'} size="sm" onClick={() => window.location.href = `/listing/${listing.id}`}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
