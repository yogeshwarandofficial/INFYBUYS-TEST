import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { Loader2 } from 'lucide-react';

export default function LatestListings() {
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming the backend has a /listings endpoint that returns { data, meta }
        const response = await apiClient.get<any>(`/listings`, { sort: 'newest', page, limit: 12 });
        setLatest(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.totalPages || 1);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [page]);

  return (
    <>
      <Seo
        title="Latest Businesses for Sale"
        description="Be the first to see the newest online businesses listed on InfyBuys."
      />
      <PageHeader
        title="Latest Listings"
        description="Fresh opportunities added to our marketplace this week."
        breadcrumbs={[{ label: 'Latest Listings' }]}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground font-medium">New Listings</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : latest.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No listings found.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latest.map(listing => (
                <ListingCard key={listing.id} listing={listing} variant="latest" />
              ))}
            </div>

            <div className="mt-16">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
