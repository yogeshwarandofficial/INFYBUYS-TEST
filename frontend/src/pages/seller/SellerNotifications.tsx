import { useSellerStore } from '@/store/useSellerStore';
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
  const { notifications } = useSellerStore();
  const {
    filters,
    updateFilter,
    resetFilters,
    filtered,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    hasActiveFilters,
  } = useSellerNotificationSearch();

  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const readNotifications = totalNotifications - unreadNotifications;
  const highPriority = notifications.filter((n) => n.priority === 'high' && !n.isRead).length;

  return (
    <>
      <Seo title="Notifications - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
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
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <SellerNotificationFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* List Section */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Search and Mobile Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <SellerNotificationSearch
                value={filters.search}
                onChange={(v) => updateFilter('search', v)}
              />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="mb-4">Filter Notifications</SheetTitle>
                  <SellerNotificationFilters
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <SellerNotificationEmptyState type="empty" />
              ) : filtered.length === 0 ? (
                <SellerNotificationEmptyState type="no-results" onClearFilters={resetFilters} />
              ) : filtered.length === 0 && filters.status === 'unread' ? (
                <SellerNotificationEmptyState type="all-read" />
              ) : (
                paginated.map((notification) => (
                  <SellerNotificationCard key={notification.id} notification={notification} />
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
