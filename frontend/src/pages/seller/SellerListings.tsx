import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { useSellerListingSearch, type SellerListingSort } from '@/hooks/useSellerListingSearch';
import { SellerListingCard } from '@/components/seller/listings/SellerListingCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw
} from 'lucide-react';
import { useSellerStore, type SellerListingStatus } from '@/store/useSellerStore';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: { value: SellerListingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Status: All' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'sold', label: 'Sold' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS: { value: SellerListingSort; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'enquiries', label: 'Most Enquiries' },
];

export default function SellerListings() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const fetchListings = useSellerStore((state) => state.fetchListings);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const search = useSellerListingSearch();
  const {
    filters,
    updateFilter,
    resetFilters,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    categories,
    locations,
    hasActiveFilters,
  } = search;

  return (
    <>
      <Seo title="My Listings | InfyBuys Seller" description="Manage your business listings on InfyBuys." />

      <div className="max-w-[1400px] mx-auto space-y-6 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 animate-slide-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Listings
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
              <span>
                {totalCount} listing{totalCount !== 1 ? 's' : ''} found
              </span>
            </p>
          </div>

          <Link
            to="/seller/listings/new"
            className="h-11 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>

        {/* Modern Horizontal Command Bar */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between z-10 relative animate-slide-up delay-100">
          {/* Search Input */}
          <div className="relative w-full lg:w-80 group shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, category, location..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all font-medium"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Filters Ribbon */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto py-0.5 px-1 scrollbar-none">
            {/* Status Filter */}
            <div className="relative shrink-0">
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value as SellerListingStatus | 'all')}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl h-11 pl-4 pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative shrink-0">
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl h-11 pl-4 pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all max-w-[180px] truncate"
              >
                <option value="">Category: All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative shrink-0">
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl h-11 pl-4 pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all max-w-[180px] truncate"
              >
                <option value="">Location: All</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Price Range Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "shrink-0 h-11 px-4 border text-sm font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer",
                    filters.priceMin || filters.priceMax
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  )}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {filters.priceMin || filters.priceMax ? 'Price: Filtered' : 'Price Range'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50" align="start">
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Price Range (USD)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 mb-1 block">Min ($)</label>
                      <input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={filters.priceMin}
                        onChange={(e) => updateFilter('priceMin', e.target.value)}
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 mb-1 block">Max ($)</label>
                      <input
                        type="number"
                        placeholder="Max"
                        min={0}
                        value={filters.priceMax}
                        onChange={(e) => updateFilter('priceMax', e.target.value)}
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>
                  {(filters.priceMin || filters.priceMax) && (
                    <button
                      type="button"
                      onClick={() => {
                        updateFilter('priceMin', '');
                        updateFilter('priceMax', '');
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Reset Price
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 h-11 px-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sort & View Toggles */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 lg:pl-3 lg:border-l border-slate-200">
            {/* Sort Dropdown */}
            <div className="relative group">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value as SellerListingSort)}
                className="appearance-none bg-transparent hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl h-11 pl-3 pr-8 cursor-pointer focus:outline-none transition-all"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / List Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                  view === 'grid'
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-900"
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                  view === 'list'
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-900"
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Display Area */}
        <div className="animate-slide-up delay-200">
          {paginated.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <EmptyState
                title={hasActiveFilters ? 'No matching listings found' : 'No listings published yet'}
                description={
                  hasActiveFilters
                    ? 'Try adjusting your search criteria, price range, or clearing active filters.'
                    : 'Create your first listing to start selling your business on InfyBuys.'
                }
                actionLabel={hasActiveFilters ? 'Clear All Filters' : 'Create Listing'}
                onAction={hasActiveFilters ? search.resetFilters : undefined}
              />
            </div>
          ) : (
            <>
              <div
                className={cn(
                  view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7'
                    : 'flex flex-col gap-4'
                )}
              >
                {paginated.map((listing) => (
                  <SellerListingCard key={listing.id} listing={listing} view={view} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
