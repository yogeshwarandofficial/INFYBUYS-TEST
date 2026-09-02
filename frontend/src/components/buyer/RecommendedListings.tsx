import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ListingCard } from '@/components/shared/ListingCard';
import { apiClient } from '@/services/apiClient';

export function RecommendedListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await apiClient.get<any>('/listings');
        const publishedListings = (response.data || []).filter((l: any) => l.status === 'PUBLISHED');
        setListings(publishedListings);
      } catch (err) {
        console.error('Failed to load listings', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-[#111827]">Recommended for you</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading listings...</p>
        ) : error ? (
          <p className="text-destructive text-sm">Unable to load listings.</p>
        ) : listings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No published listings available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
