import { useState } from 'react';
import { useListingSearch } from '@/hooks/useListingSearch';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BuyerSearchBar } from '@/components/buyer/BuyerSearchBar';
import { BuyerFilterSidebar } from '@/components/buyer/BuyerFilterSidebar';
import { SaveSearchDialog } from '@/components/buyer/SaveSearchDialog';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutGrid, List, SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';

export default function BuyerBrowse() {
  const { viewMode, setViewMode } = useBuyerStore();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const {
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    listings,
  } = useListingSearch(12);

  const handleSearch = (term: string) => {
    updateFilter('query', term);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Search Bar Area */}
      <div className="border-b bg-card p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <BuyerSearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="lg" className="h-12 flex-1 sm:flex-none" onClick={() => handleSearch(searchInput)}>
              Search
            </Button>

            {/* Save Search Button for Desktop */}
            <div className="hidden sm:block">
              <SaveSearchDialog filters={filters} resultCount={totalResults} />
            </div>

            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button size="lg" variant="outline" className="h-12 lg:hidden">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <BuyerFilterSidebar
                  filters={filters}
                  updateFilter={updateFilter}
                  clearFilters={() => {
                    clearFilters();
                    setSearchInput('');
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <BuyerFilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={() => {
                clearFilters();
                setSearchInput('');
              }}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              {totalResults} Businesses Found
              {filters.query && (
                <Badge variant="secondary" className="ml-2 font-normal">
                  "{filters.query}"
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => {
                      updateFilter('query', '');
                      setSearchInput('');
                    }}
                  />
                </Badge>
              )}

              {/* Mobile Save Search Button */}
              <div className="sm:hidden ml-auto">
                <SaveSearchDialog
                  filters={filters}
                  resultCount={totalResults}
                  trigger={<Button variant="outline" size="sm">Save</Button>}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-9">
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
                  className="rounded-none rounded-l-md h-9 w-9"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-none rounded-r-md h-9 w-9"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {listings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any listings matching your current filters.
              </p>
              <Button onClick={() => { clearFilters(); setSearchInput(''); }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid'
                  ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }>
                {listings.map(listing => (
                  <Link key={listing.id} to={`/listing/${listing.id}`} className="block h-full group">
                    <ListingCard
                      listing={listing}
                      variant={viewMode === 'list' ? 'featured' : 'latest'}
                      showFavoriteButton={true}
                    />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
