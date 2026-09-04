import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { motion } from 'framer-motion';
import { BuyerFilterSidebar as FilterSidebar } from '@/components/buyer/BuyerFilterSidebar';
import { ListingCard } from '@/components/shared/ListingCard';
import { Pagination } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useListingSearch } from '@/hooks/useListingSearch';
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, X, BookmarkPlus } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useCreateSavedSearch } from '@/hooks/useSavedSearches';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

export default function Search() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const {
    filters,
    updateFilter,
    clearFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    listings,
    isLoading,
    error,
  } = useListingSearch(12);

  const { user } = useUserStore();
  const isBuyer = user?.roles?.includes('buyer');
  const { mutate: createSavedSearch, isPending: isSavingSearch } = useCreateSavedSearch();
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  useEffect(() => {
    if (filters.query !== undefined) {
      setSearchInput(filters.query);
    }
  }, [filters.query]);

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) {
      toast.error('Please enter a name for your saved search');
      return;
    }
    
    createSavedSearch({
      name: saveSearchName,
      search: filters.query || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      location: filters.location !== 'all' ? filters.location : undefined,
      listingType: filters.listingType !== 'all' ? filters.listingType : undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice > 0 ? filters.maxPrice : undefined,
    }, {
      onSuccess: () => {
        toast.success('Search saved successfully');
        setSaveSearchOpen(false);
        setSaveSearchName('');
      },
      onError: () => {
        toast.error('Failed to save search');
      }
    });
  };

  return (
    <>
      <Seo
        title="Browse Businesses for Sale"
        description="Search, filter, and discover profitable online businesses for sale on InfyBuys."
      />

      {/* Search Page Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[600px] flex flex-col items-center justify-center pt-32 lg:pt-40 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Digital business marketplace" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Subtle Blue/White Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/20"></div>
        
        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              EXPLORE OPPORTUNITIES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Browse Businesses
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Discover verified online businesses, SaaS companies, digital assets, and profitable ventures available for acquisition.
            </p>
          </motion.div>
        </div>

        {/* Premium Search Bar integrated into Hero */}
        <div className="container relative z-30 mx-auto px-4 w-full flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-3xl"
          >
            <div className="bg-[#0B152A]/90 backdrop-blur-xl p-2 pl-6 pr-2 rounded-full border border-white/20 flex items-center shadow-2xl w-full transition-all duration-300 ">
              <Input
                type="text"
                placeholder="Find Listings, Categories, Or Enter A Listing ID..."
                className="flex-1 h-14 bg-transparent border-none shadow-none text-white text-base md:text-lg placeholder:text-white/70 focus-visible:ring-0 px-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateFilter('query', searchInput)}
              />
              <button 
                type="button"
                onClick={() => updateFilter('query', searchInput)}
                className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all ml-4 shadow-md"
              >
                <SearchIcon className="w-5 h-5 md:w-6 md:h-6 text-[#0B4C8C]" />
              </button>
            </div>
            
            {/* Mobile Filters Toggle (Only visible on mobile, outside the pill) */}
            <div className="flex justify-center mt-6 md:hidden">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-[#f8fafc]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Sidebar */}
          <div className={`lg:w-72 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FilterSidebar filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Active Filters & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-base text-slate-800 mr-4 font-bold">
                  {totalResults} Results
                </span>
                
                {filters.query && (
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-[#0B4C8C]/10 text-[#0B4C8C] hover:bg-[#0B4C8C]/20 border-none transition-colors">
                    "{filters.query}" <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => updateFilter('query', '')} />
                  </Badge>
                )}
                
                {filters.category && filters.category !== 'all' && (
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-[#0B4C8C]/10 text-[#0B4C8C] hover:bg-[#0B4C8C]/20 border-none transition-colors">
                    {filters.category} <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => updateFilter('category', 'all')} />
                  </Badge>
                )}

                {filters.location && filters.location !== 'all' && (
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-[#0B4C8C]/10 text-[#0B4C8C] hover:bg-[#0B4C8C]/20 border-none transition-colors">
                    {filters.location} <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => updateFilter('location', 'all')} />
                  </Badge>
                )}
                
                <Button variant="link" size="sm" className="text-[#0B4C8C] font-semibold text-sm hover:text-[#0B152A] h-auto p-0 ml-2" onClick={clearFilters}>
                  Clear all
                </Button>
                {isBuyer && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 h-8 rounded-full border-[#0B4C8C] text-[#0B4C8C] hover:bg-[#0B4C8C] hover:text-white transition-colors"
                    onClick={() => setSaveSearchOpen(true)}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Save Search
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4 w-full xl:w-auto self-end xl:self-auto">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[200px] h-11 text-base font-medium bg-white text-[#0F172A] border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors [&_svg]:!text-[#0B4C8C]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-md rounded-lg z-[100]">
                    <SelectItem value="newest" className="text-[#0F172A] focus:bg-[#0B4C8C]/10 focus:text-[#0B4C8C] cursor-pointer [&_svg]:!text-[#0B4C8C] my-0.5">Newest First</SelectItem>
                    <SelectItem value="price-asc" className="text-[#0F172A] focus:bg-[#0B4C8C]/10 focus:text-[#0B4C8C] cursor-pointer [&_svg]:!text-[#0B4C8C] my-0.5">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="text-[#0F172A] focus:bg-[#0B4C8C]/10 focus:text-[#0B4C8C] cursor-pointer [&_svg]:!text-[#0B4C8C] my-0.5">Price: High to Low</SelectItem>
                    <SelectItem value="revenue-desc" className="text-[#0F172A] focus:bg-[#0B4C8C]/10 focus:text-[#0B4C8C] cursor-pointer [&_svg]:!text-[#0B4C8C] my-0.5">Revenue: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-slate-200 rounded-lg hidden sm:flex bg-white shadow-sm overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-11 px-4 bg-white hover:bg-slate-50 transition-colors"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-[#0B4C8C]' : 'text-[#0F172A]'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-11 px-4 border-l border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    onClick={() => setViewMode('list')}
                  >
                    <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-[#0B4C8C]' : 'text-[#0F172A]'}`} />
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
                <div className="col-span-full py-20 flex justify-center text-slate-500 text-lg font-medium">Loading...</div>
              ) : error ? (
                <div className="col-span-full py-20 flex justify-center text-red-500 text-lg font-medium">{error}</div>
              ) : listings.length === 0 ? (
                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm text-center px-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <SearchIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B152A] mb-3">No results found</h3>
                  <p className="text-slate-500 max-w-md text-lg">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <Button variant="outline" className="mt-8 rounded-xl px-6 h-12" onClick={() => {}}>
                    Clear all filters
                  </Button>
                </div>
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
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </main>
        </div>
        </div>
      </div>

      <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name your search</Label>
              <Input
                id="name"
                placeholder="e.g. London Restaurants under £500k"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
              />
            </div>
            <div className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="font-semibold mb-1 text-slate-700">Current Filters:</p>
              <ul className="list-disc pl-4 space-y-1">
                {filters.query && <li>Keyword: {filters.query}</li>}
                {filters.listingType && filters.listingType !== 'all' && <li>Type: {filters.listingType}</li>}
                {filters.category && filters.category !== 'all' && <li>Category: {filters.category}</li>}
                {filters.location && filters.location !== 'all' && <li>Location: {filters.location}</li>}
                {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                  <li>Price: {filters.minPrice > 0 ? `£${filters.minPrice.toLocaleString()}` : '£0'} - {filters.maxPrice > 0 ? `£${filters.maxPrice.toLocaleString()}` : 'Max'}</li>
                )}
                {!filters.query && filters.listingType === 'all' && filters.category === 'all' && filters.location === 'all' && filters.minPrice === 0 && filters.maxPrice === 0 && (
                  <li className="text-slate-400 italic">No filters applied</li>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveSearchOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSearch} disabled={isSavingSearch} className="bg-[#0B4C8C] hover:bg-[#0B152A] text-white">
              {isSavingSearch ? 'Saving...' : 'Save Search'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
