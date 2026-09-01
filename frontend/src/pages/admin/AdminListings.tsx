import { useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminListingSearch } from '../../hooks/useAdminListingSearch';
import { AdminListingsTable } from '../../components/admin/listings/AdminListingsTable';
import { AdminListingCard } from '../../components/admin/listings/AdminListingCard';
import { AdminListingSearch } from '../../components/admin/listings/AdminListingSearch';
import { AdminListingFilters } from '../../components/admin/listings/AdminListingFilters';
import { PageHeader } from '../../components/shared/PageHeader';
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
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Listings Management"
        description={`Manage ${totalListings} total business listings across the platform`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Listings' }]}
      />

      {/* KPI Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">Total Listings</span>
            </div>
            <span className="text-2xl font-bold">{totalListings}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeListings}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{pendingListings}</span>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Sold</span>
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{soldListings}</span>
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
