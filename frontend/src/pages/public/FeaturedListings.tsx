import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { Loader2 } from 'lucide-react';

export default function FeaturedListings() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming backend supports filtering by isFeatured via query param or status
        const response = await apiClient.get<any>(`/listings`, { isFeatured: true, page, limit: 12 });
        setFeatured(response.data || []);
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
        title="Premium & Featured Listings"
        description="Browse the highest quality vetted businesses on our marketplace."
      />
      <PageHeader
        title="Premium Acquisitions"
        description="Hand-picked, highly profitable businesses vetted by our expert team."
        breadcrumbs={[{ label: 'Featured Listings' }]}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground font-medium">Premium Listings</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No featured listings found.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map(listing => (
                <ListingCard key={listing.id} listing={listing} variant="featured" />
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
