import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { motion } from 'framer-motion';
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

      {/* Search Page Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[600px] flex flex-col items-center justify-center pt-32 lg:pt-40 pb-20 overflow-hidden">
        {/* Background Image */}
        <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788425504/82c86dbe-495d-45f7-9052-4fc08e5185f5_rsyl9e.png")' }}
      >
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
      </div>
                
        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center max-w-5xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full"
          >
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-6 px-5 py-2 bg-[#F1F7FC]/90 shadow-sm rounded-full backdrop-blur-sm border border-[#0B4C8C]/10">
              EXPLORE OPPORTUNITIES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Browse <span className="text-[#00B8E6]">Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium mb-12 drop-shadow-md">
              Discover verified online businesses, SaaS companies, digital assets, and profitable ventures available for acquisition.
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="w-full bg-transparent backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 relative flex items-center">
              <Input
                type="text"
                placeholder="Find Listings, Categories, Or Enter A Listing ID..."
                className="w-full h-14 md:h-18 pl-6 pr-20 text-base md:text-lg bg-transparent border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[#ffffff] placeholder:text-white/60 font-medium rounded-full"
              />
              <button className="absolute right-2 md:right-2.5 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-[#0B4C8C] hover:scale-105 active:scale-95 transition-all">
                <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            {/* Mobile Filters Toggle (Only visible on mobile) */}
            <div className="flex justify-center mt-6 md:hidden">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full bg-white/80 backdrop-blur-md border-slate-200 text-[#0B152A] font-semibold hover:bg-white"
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
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Active Filters & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-base text-slate-800 mr-4 font-bold">
                  {listings.length} Results
                </span>
                {/* Mock Active Chips */}
                <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-[#0B4C8C]/10 text-[#0B4C8C] hover:bg-[#0B4C8C]/20 border-none transition-colors">
                  SaaS <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" />
                </Badge>
                <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-[#0B4C8C]/10 text-[#0B4C8C] hover:bg-[#0B4C8C]/20 border-none transition-colors">
                  Over $500k <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" />
                </Badge>
                <Button variant="link" size="sm" className="text-[#0B4C8C] font-semibold text-sm hover:text-[#0B152A] h-auto p-0 ml-2">
                  Clear all
                </Button>
              </div>

              <div className="flex items-center gap-4 w-full xl:w-auto self-end xl:self-auto">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[200px] h-11 text-base font-medium bg-white text-[#0F172A] border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors [&_svg]:!text-[#0B4C8C]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white border-slate-200 shadow-md rounded-lg z-[100] w-[200px]">
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
              <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
            </div>
          </main>
        </div>
        </div>
      </div>
    </>
  );
}
