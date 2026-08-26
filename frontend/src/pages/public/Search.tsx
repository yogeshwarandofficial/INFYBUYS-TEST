import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/services/apiClient';
import type { Listing } from '@/types/api';
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';

export default function Search() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get<{ data: Listing[] }>('/listings');
        setListings(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <>
      <Seo
        title="Browse Businesses for Sale"
        description="Search, filter, and discover profitable online businesses for sale on InfyBuys."
      />

      <PageHeader
        title="Browse Businesses"
        breadcrumbs={[{ label: 'Browse' }]}
        className="pb-8"
      />

      <div className="border-b bg-background sticky top-[73px] z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by keyword, niche, or URL..."
                className="pl-10 h-12 bg-background shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button size="lg" className="h-12 flex-1 sm:flex-none">Search</Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 md:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className={`md:w-64 shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Active Filters & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2 font-medium">
                  {listings.length} Results
                </span>
                {/* Mock Active Chips */}
                <Badge variant="secondary" className="px-3 py-1 text-sm font-normal">
                  SaaS <X className="w-3 h-3 ml-2 cursor-pointer" />
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-normal">
                  Over $500k <X className="w-3 h-3 ml-2 cursor-pointer" />
                </Badge>
                <Button variant="link" size="sm" className="text-muted-foreground h-auto p-0 ml-2">
                  Clear all
                </Button>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto self-end lg:self-auto">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="revenue-desc">Revenue: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md hidden sm:flex">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none rounded-l-md h-9"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-none rounded-r-md h-9"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={
              viewMode === 'grid'
                ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-6"
            }>
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-destructive">{error}</div>
              ) : listings.length === 0 ? (
                <div>No results found.</div>
              ) : (
                listings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    variant={viewMode === 'list' ? 'featured' : 'latest'}
                  />
                ))
              )}
            </div>

            <div className="mt-12">
              <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
