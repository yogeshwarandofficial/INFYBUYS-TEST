import { useAdminStore } from '../../store/useAdminStore';
import { useAdminEnquirySearch } from '../../hooks/useAdminEnquirySearch';
import { AdminEnquiriesTable } from '../../components/admin/enquiries/AdminEnquiriesTable';
import { AdminEnquiryCard } from '../../components/admin/enquiries/AdminEnquiryCard';
import { AdminEnquirySearch } from '../../components/admin/enquiries/AdminEnquirySearch';
import { AdminEnquiryFilters } from '../../components/admin/enquiries/AdminEnquiryFilters';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { MessageSquare, Mail, Handshake, Ban } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Filter } from 'lucide-react';

export default function AdminEnquiries() {
  const enquiries = useAdminStore((state) => state.enquiries);

  const {
    paginatedEnquiries,
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
  } = useAdminEnquirySearch();

  // KPI Calculations
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const activeEnquiries = enquiries.filter(e => e.status === 'contacted' || e.status === 'qualified' || e.status === 'negotiating').length;
  const closedEnquiries = enquiries.filter(e => e.status === 'closed').length;

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Enquiries Management"
        description={`Manage ${totalEnquiries} total buyer-seller enquiries across the platform`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Enquiries' }]}
      />

      {/* KPI Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Total Enquiries</span>
            </div>
            <span className="text-2xl font-bold">{totalEnquiries}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">New</span>
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{newEnquiries}</span>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Handshake className="h-4 w-4" />
              <span className="text-sm font-medium">Active Discussions</span>
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{activeEnquiries}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Ban className="h-4 w-4" />
              <span className="text-sm font-medium">Closed</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{closedEnquiries}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdminEnquiryFilters
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
              <AdminEnquirySearch
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
                  <AdminEnquiryFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    sorting={sorting}
                    onSortChange={setSorting}
                    onReset={resetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {paginatedEnquiries.length === 0 ? (
              <EmptyState
                title="No enquiries found"
                description="No enquiries match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <AdminEnquiriesTable enquiries={paginatedEnquiries} />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedEnquiries.map(enquiry => (
                    <AdminEnquiryCard key={enquiry.id} enquiry={enquiry} />
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
