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
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Search Section */}
      <div className="bg-white border-b border-slate-200/60 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 xl:px-8 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Discover Premium Businesses
            </h1>
            <p className="text-[15px] text-slate-500 font-medium">
              Explore curated listings, save your searches, and find the perfect acquisition.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <BuyerSearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
            />
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <Button size="lg" className="h-[52px] px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[16px] shadow-sm text-[15px] font-bold transition-all hover:shadow-md hover:-translate-y-0.5" onClick={() => handleSearch(searchInput)}>
                Search
              </Button>

              {/* Save Search Button for Desktop */}
              <div className="hidden sm:block">
                <SaveSearchDialog 
                  filters={{ ...filters, query: searchInput || filters.query }} 
                  resultCount={totalResults} 
                  trigger={<Button variant="outline" size="lg" className="h-[52px] px-6 bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm hover:bg-slate-50 rounded-[16px] text-[15px] font-bold transition-all">Save Search</Button>}
                />
              </div>

              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button size="lg" variant="outline" className="h-[52px] px-5 lg:hidden rounded-[16px] border-slate-200 text-slate-700 font-bold">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0 overflow-hidden flex flex-col bg-slate-50">
                  <div className="h-full overflow-y-auto p-6">
                    <BuyerFilterSidebar
                      filters={filters}
                      updateFilter={updateFilter}
                      clearFilters={() => {
                        clearFilters();
                        setSearchInput('');
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 xl:px-8 py-8 flex flex-col gap-6">
        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Results Toolbar */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 text-[15px] text-slate-500 font-medium px-2 flex-wrap">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{totalResults}</span> 
                <span>results</span>
              </div>
              
              {filters.query && (
                <>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <Badge variant="secondary" className="font-semibold bg-blue-50 text-blue-700 border-blue-100/50 px-3 py-1 rounded-lg">
                    "{filters.query}"
                    <X
                      className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-blue-900 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        updateFilter('query', '');
                        setSearchInput('');
                      }}
                    />
                  </Badge>
                </>
              )}

              {/* Desktop Collapsible Filter Toggle */}
              <div className="hidden lg:block ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowMobileFilters(true)} 
                  className="rounded-lg h-9 font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Mobile Save Search Button */}
              <div className="sm:hidden ml-auto">
                <SaveSearchDialog
                  filters={{ ...filters, query: searchInput || filters.query }}
                  resultCount={totalResults}
                  trigger={<Button variant="outline" size="sm" className="rounded-lg h-9 font-bold">Save</Button>}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="relative">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 transition-all">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="revenue-desc">Revenue: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {listings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                <SearchIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">No businesses found</h3>
              <p className="text-[15px] font-medium text-slate-500 mb-8 max-w-sm">
                We couldn't find any listings matching your current filters. Try adjusting your criteria.
              </p>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-[14px] shadow-md px-8 h-12 text-[15px] font-bold" onClick={() => { clearFilters(); setSearchInput(''); }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {listings.map(listing => (
                  <Link key={listing.id} to={`/buyer/listing/${listing.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[24px]">
                    <ListingCard
                      listing={listing}
                      variant="list"
                      showFavoriteButton={true}
                    />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 pt-8 border-t border-slate-200/60 flex justify-center">
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
