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

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.query || '');

  const handleSearch = (term: string) => {
    updateFilter('query', term);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Search Bar Area */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <BuyerSearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
          />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button size="lg" className="h-12 flex-1 sm:flex-none bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-md" onClick={() => handleSearch(searchInput)}>
              Search
            </Button>

            {/* Save Search Button for Desktop */}
            <div className="hidden sm:block">
              <SaveSearchDialog 
                filters={{ ...filters, query: searchInput || filters.query }} 
                resultCount={totalResults} 
                trigger={<Button variant="outline" size="lg" className="h-12 bg-white/80 backdrop-blur-md border border-gray-200 text-[#111827] shadow-sm hover:bg-gray-50 rounded-xl">Save Search</Button>}
              />
            </div>

            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button size="lg" variant="outline" className="h-12 lg:hidden rounded-xl">
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

      <div className="flex-1 w-full flex gap-6 mt-6 max-w-7xl mx-auto px-4 xl:px-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl p-5">
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
            <div className="flex items-center gap-2 text-[15px] text-[#64748B] font-medium">
              <span className="text-[#111827] font-semibold">{totalResults}</span> Businesses Found
              {filters.query && (
                <Badge variant="secondary" className="ml-2 font-normal bg-blue-50 text-blue-700 border-blue-100">
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
                  filters={{ ...filters, query: searchInput || filters.query }}
                  resultCount={totalResults}
                  trigger={<Button variant="outline" size="sm" className="rounded-lg">Save</Button>}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-sm text-[#334155]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="revenue-desc">Revenue: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-sm hidden sm:flex overflow-hidden p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md h-8 w-8 ${viewMode === 'grid' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:text-[#111827]'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md h-8 w-8 ${viewMode === 'list' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:text-[#111827]'}`}
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
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl mb-8">
              <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-5 shadow-inner">
                <SearchIcon className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">No businesses found</h3>
              <p className="text-[#64748B] mb-6 max-w-sm">
                We couldn't find any listings matching your current filters.
              </p>
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg shadow-md px-6 h-11" onClick={() => { clearFilters(); setSearchInput(''); }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid'
                  ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-5"
              }>
                {listings.map(listing => (
                  <Link key={listing.id} to={`/buyer/listing/${listing.id}`} className="block h-full group">
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
