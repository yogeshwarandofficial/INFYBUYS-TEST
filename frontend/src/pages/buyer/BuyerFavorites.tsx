import { useBuyerStore } from '@/store/useBuyerStore';
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import type { Listing } from '@/types/api';
import { ListingCard } from '@/components/shared/ListingCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link } from 'react-router';

export default function BuyerFavorites() {
  const { favorites, viewMode } = useBuyerStore();

  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        if (favorites.length === 0) {
          setFavoriteListings([]);
          return;
        }
        // Fetch all listings and filter by favorite ids
        // Alternatively, the backend could support a query by ids,
        // but fetching all is a fallback that works.
        const data = await apiClient.get<{ data: Listing[] }>('/listings');
        setFavoriteListings(data.data.filter(l => favorites.includes(l.id)));
      } catch (err: any) {
        setError(err.message || 'Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [favorites]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Saved Listings</h1>
          <p className="text-muted-foreground mt-1">
            You have {favoriteListings.length} saved business{favoriteListings.length !== 1 ? 'es' : ''}.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/buyer/browse">Browse More</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border">
          Loading...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border text-destructive">
          {error}
        </div>
      ) : favoriteListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No saved listings</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Listings you save will appear here. Start browsing to find your next business acquisition.
          </p>
          <Button asChild>
            <Link to="/buyer/browse">Browse Businesses</Link>
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }>
          {favoriteListings.map(listing => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="block h-full group">
              <ListingCard
                listing={listing}
                variant={viewMode === 'list' ? 'featured' : 'latest'}
                showFavoriteButton={true}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
