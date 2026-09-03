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
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">Saved Listings</h1>
          <p className="text-[#64748B] mt-2 font-medium">
            You have {favoriteListings.length} saved business{favoriteListings.length !== 1 ? 'es' : ''}.
          </p>
        </div>
        <Button variant="outline" asChild className="bg-white/80 backdrop-blur-md border border-[#E5E9F2] text-[#111827] shadow-sm hover:bg-blue-50/50 hover:text-[#2563EB] rounded-xl h-11 px-6 transition-all">
          <Link to="/buyer/browse">Browse More</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm">
          <div className="text-[#64748B] font-medium">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm text-red-500 font-medium">
          {error}
        </div>
      ) : favoriteListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm">
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
            <Heart className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#111827]">No saved listings</h3>
          <p className="text-[#64748B] mb-8 max-w-sm mx-auto text-[15px] leading-relaxed">
            Listings you save will appear here. Start browsing to find your next business acquisition.
          </p>
          <Button asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-12 px-8 font-medium transition-all hover:shadow-lg">
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
