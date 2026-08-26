import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
// CATEGORIES imported as needed later
import { apiClient } from '@/services/apiClient';
import type { Listing } from '@/types/api';
import { useParams } from 'react-router';

export default function CategoryDetails() {
  const { slug } = useParams();
  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'SaaS';

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get<{ data: Listing[] }>(`/listings?category=${encodeURIComponent(categoryName)}`);
        setListings(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load category listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [categoryName]);

  return (
    <>
      <Seo
        title={`${categoryName} Businesses for Sale`}
        description={`Browse profitable ${categoryName} businesses and digital assets for sale.`}
      />

      <PageHeader
        title={`${categoryName} Businesses for Sale`}
        description={`Explore verified ${categoryName.toLowerCase()} assets currently on the market.`}
        breadcrumbs={[
          { label: 'Categories', href: '/categories' },
          { label: categoryName }
        ]}
        className="pb-8"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0 hidden md:block">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                {listings.length} Results in {categoryName}
              </span>
            </div>

            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : listings.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} variant="latest" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                <p className="text-muted-foreground">No listings found in this category.</p>
              </div>
            )}

            <div className="mt-12">
              <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
