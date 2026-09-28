import { useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminListingSearch } from '../../hooks/useAdminListingSearch';
import { AdminListingsTable } from '../../components/admin/listings/AdminListingsTable';
import { AdminListingCard } from '../../components/admin/listings/AdminListingCard';
import { AdminListingSearch } from '../../components/admin/listings/AdminListingSearch';
import { AdminListingFilters } from '../../components/admin/listings/AdminListingFilters';
import { EmptyState } from '../../components/shared/EmptyState';
import { Package, CheckCircle2, Clock, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Filter } from 'lucide-react';

export default function AdminListings() {
  const listings = useAdminStore((state) => state.listings);
  const fetchPlatformData = useAdminStore((state) => state.fetchPlatformData);

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const {
    paginatedListings,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    filters,
    setFilters,
    sorting,
    setSorting,
    resetFilters,
    categories
  } = useAdminListingSearch();

  // KPI Calculations
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'PUBLISHED' || l.status === 'active').length;
  const pendingListings = listings.filter(l => l.status === 'SUBMITTED_FOR_REVIEW' || l.status === 'pending').length;
  const soldListings = listings.filter(l => l.status === 'SOLD_LET' || l.status === 'sold').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Listings Management</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage {totalListings} total business listings across the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Listings</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{totalListings}</span>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Active</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{activeListings}</span>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{pendingListings}</span>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100/50 flex items-center justify-center shrink-0">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Sold</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{soldListings}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Unified Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/50 p-3 rounded-2xl border border-[#E5E9F2] shadow-sm">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] lg:max-w-xs">
                <AdminListingSearch
                  value={search}
                  onChange={setSearch}
                  className="flex-1"
                />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <AdminListingFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    sorting={sorting}
                    onSortChange={setSorting}
                    onReset={resetFilters}
                    categories={categories}
                  />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="hidden lg:flex flex-1">
                <AdminListingFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  sorting={sorting}
                  onSortChange={setSorting}
                  onReset={resetFilters}
                  categories={categories}
                  orientation="horizontal"
                />
              </div>
            </div>

            {paginatedListings.length === 0 ? (
              <EmptyState
                title="No listings found"
                description="No listings match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <AdminListingsTable listings={paginatedListings} />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedListings.map(listing => (
                    <AdminListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
