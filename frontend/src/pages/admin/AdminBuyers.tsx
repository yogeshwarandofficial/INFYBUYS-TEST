import { useAdminStore } from '../../store/useAdminStore';
import { useAdminBuyerSearch } from '../../hooks/useAdminBuyerSearch';
import { AdminBuyersTable } from '../../components/admin/buyers/AdminBuyersTable';
import { AdminBuyerCard } from '../../components/admin/buyers/AdminBuyerCard';
import { AdminBuyerSearch } from '../../components/admin/buyers/AdminBuyerSearch';
import { AdminBuyerFilters } from '../../components/admin/buyers/AdminBuyerFilters';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Filter } from 'lucide-react';

export default function AdminBuyers() {
  const buyers = useAdminStore((state) => state.buyers);

  const {
    paginatedBuyers,
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
  } = useAdminBuyerSearch();

  // KPI Calculations
  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter(b => b.status === 'active').length;
  const pendingBuyers = buyers.filter(b => b.status === 'pending').length;
  const suspendedBuyers = buyers.filter(b => b.status === 'suspended').length;
  const verifiedBuyers = buyers.filter(b => b.verificationStatus === 'verified').length;

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Buyers Management"
        description={`Manage ${totalBuyers} total buyers across the platform`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Buyers' }]}
      />

      {/* KPI Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <span className="text-2xl font-bold">{totalBuyers}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeBuyers}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{pendingBuyers}</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Suspended</span>
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{suspendedBuyers}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
            <span className="text-2xl font-bold">{verifiedBuyers}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdminBuyerFilters
                filters={filters}
                onFilterChange={setFilters}
                sorting={sorting}
                onSortChange={setSorting}
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Search and Mobile Filters */}
            <div className="flex items-center gap-2">
              <AdminBuyerSearch
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
                  <AdminBuyerFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    sorting={sorting}
                    onSortChange={setSorting}
                    onReset={resetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {paginatedBuyers.length === 0 ? (
              <EmptyState
                title="No buyers found"
                description="No buyers match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <AdminBuyersTable buyers={paginatedBuyers} />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedBuyers.map(buyer => (
                    <AdminBuyerCard key={buyer.id} buyer={buyer} />
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
