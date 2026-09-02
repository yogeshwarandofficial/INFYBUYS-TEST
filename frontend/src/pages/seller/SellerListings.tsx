import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { useSellerListingSearch } from '@/hooks/useSellerListingSearch';
import { SellerListingCard } from '@/components/seller/listings/SellerListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  PlusCircle,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useSellerStore, type SellerListingStatus } from '@/store/useSellerStore';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: { value: SellerListingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'enquiries', label: 'Most Enquiries' },
];

function FiltersPanel({
  filters,
  updateFilter,
  resetFilters,
  categories,
  locations,
  hasActiveFilters,
}: ReturnType<typeof useSellerListingSearch>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Status</Label>
        <Select value={filters.status} onValueChange={(v) => updateFilter('status', v as SellerListingStatus | 'all')}>
          <SelectTrigger aria-label="Filter by status" className="bg-white border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Category</Label>
        <Select value={filters.category || '_all'} onValueChange={(v) => updateFilter('category', v === '_all' ? '' : v)}>
          <SelectTrigger aria-label="Filter by category" className="bg-white border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Location</Label>
        <Select value={filters.location || '_all'} onValueChange={(v) => updateFilter('location', v === '_all' ? '' : v)}>
          <SelectTrigger aria-label="Filter by location" className="bg-white border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Locations</SelectItem>
            {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Price Range (USD)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.priceMin}
            onChange={(e) => updateFilter('priceMin', e.target.value)}
            aria-label="Minimum price"
            className="bg-white border-[#E5E9F2] rounded-xl focus-visible:ring-blue-500 shadow-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.priceMax}
            onChange={(e) => updateFilter('priceMax', e.target.value)}
            aria-label="Maximum price"
            className="bg-white border-[#E5E9F2] rounded-xl focus-visible:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator className="bg-[#E5E9F2]" />
          <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-[#E5E9F2] rounded-xl shadow-sm text-[#111827]" onClick={resetFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}

export default function SellerListings() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const fetchListings = useSellerStore(state => state.fetchListings);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const search = useSellerListingSearch();
  const { filters, updateFilter, paginated, currentPage, setCurrentPage, totalPages, totalCount, hasActiveFilters } = search;

  return (
    <>
      <Seo title="My Listings" description="Manage your business listings on InfyBuys." />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">My Listings</h1>
            <p className="text-[15px] text-[#64748B]">
              {totalCount} listing{totalCount !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button asChild className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all h-11 px-6 font-medium">
            <Link to="/seller/listings/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Listing
            </Link>
          </Button>
        </div>

        {/* Search & Sort bar */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
            <Input
              placeholder="Search by title, category, location..."
              className="pl-10 bg-white/60 border-[#E5E9F2] rounded-xl focus-visible:ring-blue-500 shadow-sm h-10"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              aria-label="Search listings"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={filters.sort} onValueChange={(v) => updateFilter('sort', v as typeof filters.sort)}>
              <SelectTrigger className="w-[180px] bg-white/60 border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm h-10" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-white/60 border border-[#E5E9F2] p-1 rounded-xl shadow-sm h-10">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                className={cn("h-8 w-8 rounded-lg", view === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#64748B] hover:text-[#111827]')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                aria-label="List view"
                aria-pressed={view === 'list'}
                className={cn("h-8 w-8 rounded-lg", view === 'list' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#64748B] hover:text-[#111827]')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile filter trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative lg:hidden bg-white/60 border-[#E5E9F2] rounded-xl shadow-sm h-10 text-[#111827]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">!</Badge>
                  )}
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Listings</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersPanel {...search} />
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>

        <div className="flex gap-8 mt-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm shadow-blue-900/5 p-6 sticky top-24">
              <h2 className="font-bold text-base text-[#111827] mb-6">Filters</h2>
              <FiltersPanel {...search} />
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <EmptyState
                title={hasActiveFilters ? 'No matching listings' : 'No listings yet'}
                description={
                  hasActiveFilters
                    ? 'Try adjusting your filters or search term.'
                    : 'Create your first listing to start selling on InfyBuys.'
                }
                actionLabel={hasActiveFilters ? 'Clear Filters' : 'Create Listing'}
                onAction={hasActiveFilters ? search.resetFilters : undefined}
              />
            ) : (
              <>
                <div
                  className={cn(
                    view === 'grid'
                      ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-4'
                      : 'flex flex-col gap-3'
                  )}
                >
                  {paginated.map((listing) => (
                    <SellerListingCard key={listing.id} listing={listing} view={view} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
