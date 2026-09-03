import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { useSellerEnquiries } from '@/hooks/useEnquiries';
import { useSellerEnquirySearch } from '@/hooks/useSellerEnquirySearch';
import { SellerEnquiryCard } from '@/components/seller/enquiries/SellerEnquiryCard';
import { SellerEnquiryFilters } from '@/components/seller/enquiries/SellerEnquiryFilters';
import { SellerEnquirySearch } from '@/components/seller/enquiries/SellerEnquirySearch';
import { SellerStatCard } from '@/components/seller/dashboard/SellerStatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Mail,
  MessageCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { type SellerEnquirySort } from '@/hooks/useSellerEnquirySearch';

const SORT_OPTIONS: { value: SellerEnquirySort; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'recently-updated', label: 'Recently Updated' },
];

export default function SellerEnquiries() {
  const { data: enquiries = [], isLoading } = useSellerEnquiries();
  const search = useSellerEnquirySearch(enquiries);
  const {
    filters,
    updateFilter,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    hasActiveFilters,
    resetFilters,
  } = search;

  // Live KPI computations
  const totalEnquiries = enquiries.length;
  const unreadCount = enquiries.filter((e: any) => (e.unreadCount || 0) > 0).length;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading enquiries...</div>;
  }

  return (
    <>
      <Seo
        title="Enquiries"
        description="Manage buyer enquiries for your business listings on InfyBuys."
      />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Enquiries</h1>
            <p className="text-[15px] text-[#64748B]">
              {totalCount} enquir{totalCount !== 1 ? 'ies' : 'y'} found
            </p>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <SellerStatCard
            title="Total Enquiries"
            value={totalEnquiries}
            icon={Mail}
            description="All time"
          />
          <SellerStatCard
            title="Unread"
            value={unreadCount}
            icon={MessageCircle}
            description="Need attention"
          />
        </div>

        {/* Search + Sort + Filter controls */}
        <div className="flex flex-wrap gap-4">
          <SellerEnquirySearch
            value={filters.search}
            onChange={(v) => updateFilter('search', v)}
          />

          <Select
            value={filters.sort}
            onValueChange={(v) => updateFilter('sort', v as SellerEnquirySort)}
          >
            <SelectTrigger className="w-[180px] bg-white/60 border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm h-10" aria-label="Sort enquiries by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile filter trigger */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative lg:hidden bg-white/60 border-[#E5E9F2] rounded-xl shadow-sm h-10 text-[#111827]" aria-label="Open filters">
                <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Enquiries</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <SellerEnquiryFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8 mt-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0" aria-label="Enquiry filters">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm shadow-blue-900/5 p-6 sticky top-24">
              <h2 className="font-bold text-base text-[#111827] mb-6">Filters</h2>
              <SellerEnquiryFilters
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Enquiry Grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <EmptyState
                title={hasActiveFilters ? 'No matching enquiries' : 'No enquiries yet'}
                description={
                  hasActiveFilters
                    ? 'Try adjusting your filters or search term.'
                    : 'Enquiries from interested buyers will appear here once your listings are live.'
                }
                actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
                onAction={hasActiveFilters ? resetFilters : undefined}
              />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map((enquiry) => (
                    <SellerEnquiryCard key={enquiry.id} enquiry={enquiry} />
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
