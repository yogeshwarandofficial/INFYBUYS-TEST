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
  const pendingListings = listings.filter(l => l.status === 'SUBMITTED_FOR_REVIEW' || l.status === 'pending' || l.status === 'CHANGES_PENDING_REVIEW').length;
  const soldListings = listings.filter(l => l.status === 'SOLD_LET' || l.status === 'sold').length;

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Listings Management</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage {totalListings} total business listings across the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center"><Package className="h-5 w-5" /></div>
              </div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Total Listings</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{totalListings}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center"><CheckCircle2 className="h-5 w-5" /></div>
              </div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Active</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{activeListings}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
              </div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Pending Review</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{pendingListings}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Check className="h-4 w-4" />
              </div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Sold</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{soldListings}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdminListingFilters
                filters={filters}
                onFilterChange={setFilters}
                sorting={sorting}
                onSortChange={setSorting}
                onReset={resetFilters}
                categories={categories}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Search and Mobile Filters */}
            <div className="flex items-center gap-2">
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
