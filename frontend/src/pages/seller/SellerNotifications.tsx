import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { Seo } from '@/components/shared/Seo';
import { SellerStatCard } from '@/components/seller/dashboard/SellerStatCard';
import { Bell, BellRing, MailOpen, AlertCircle } from 'lucide-react';
import { useSellerNotificationSearch } from '@/hooks/useSellerNotificationSearch';
import { SellerNotificationCard } from '@/components/seller/notifications/SellerNotificationCard';
import { SellerNotificationFilters } from '@/components/seller/notifications/SellerNotificationFilters';
import { SellerNotificationSearch } from '@/components/seller/notifications/SellerNotificationSearch';
import { SellerNotificationActions } from '@/components/seller/notifications/SellerNotificationActions';
import { SellerNotificationEmptyState } from '@/components/seller/notifications/SellerNotificationEmptyState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

export default function SellerNotifications() {
  const {
    filters,
    updateFilter,
    resetFilters,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    hasActiveFilters,
    isLoading,
  } = useSellerNotificationSearch();

  const { data: unreadData } = useUnreadNotificationCount();

  const totalNotifications = totalCount;
  const unreadNotifications = unreadData?.count || 0;
  const readNotifications = Math.max(0, totalNotifications - unreadNotifications);
  const highPriority = 0; // Not implemented on backend yet

  return (
    <>
      <Seo title="Notifications - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Notifications</h1>
            <p className="text-[15px] text-[#64748B]">
              Manage your alerts and stay updated on your business activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SellerNotificationActions />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SellerStatCard
            title="Total"
            value={totalNotifications}
            icon={Bell}
            description="All notifications"
          />
          <SellerStatCard
            title="Unread"
            value={unreadNotifications}
            icon={BellRing}
            description="Needs attention"
          />
          <SellerStatCard
            title="Read"
            value={readNotifications}
            icon={MailOpen}
            description="Previously viewed"
          />
          <SellerStatCard
            title="High Priority"
            value={highPriority}
            icon={AlertCircle}
            description="Urgent (unread)"
            trend={highPriority > 0 ? { value: highPriority, isPositive: false } : undefined}
          />
        </div>

        {/* Main Layout */}
        <div className="w-full space-y-4 mt-8">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center gap-3 bg-white/85 backdrop-blur-md p-3 rounded-2xl border border-[#E5E9F2] shadow-sm w-full">
            <div className="w-full md:w-64 shrink-0">
              <SellerNotificationSearch
                value={filters.search}
                onChange={(v) => updateFilter('search', v)}
              />
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-200 mx-1 shrink-0" />
            <div className="w-full flex-1 overflow-x-auto">
              <SellerNotificationFilters
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E9F2] overflow-hidden flex flex-col">
            <div className="divide-y divide-[#E5E9F2] flex-1">
              {isLoading ? (
                <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center">Loading notifications...</div>
              ) : totalCount === 0 ? (
                <div className="p-8"><SellerNotificationEmptyState type="empty" /></div>
              ) : paginated.length === 0 ? (
                <div className="p-8"><SellerNotificationEmptyState type="no-results" onClearFilters={resetFilters} /></div>
              ) : (
                paginated.map((notification) => (
                  <SellerNotificationCard key={notification.id} notification={notification as any} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
