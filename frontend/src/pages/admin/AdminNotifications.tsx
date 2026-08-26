import { useAdminStore } from '../../store/useAdminStore';
import { useAdminNotificationSearch } from '../../hooks/useAdminNotificationSearch';
import { AdminNotificationsTable } from '../../components/admin/notifications/AdminNotificationsTable';
import { AdminNotificationCard } from '../../components/admin/notifications/AdminNotificationCard';
import { AdminNotificationSearch } from '../../components/admin/notifications/AdminNotificationSearch';
import { AdminNotificationFilters } from '../../components/admin/notifications/AdminNotificationFilters';
import { AdminNotificationCompose } from '../../components/admin/notifications/AdminNotificationCompose';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Bell, BellRing, Megaphone, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Filter } from 'lucide-react';

export default function AdminNotifications() {
  const {
    notifications,
    markAllAdminNotificationsRead
  } = useAdminStore();

  const {
    paginatedNotifications,
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
    unreadCount
  } = useAdminNotificationSearch();

  // KPI Calculations
  const totalNotifications = notifications.length;
  const announcementsCount = notifications.filter(n => n.type === 'announcement').length;
  const systemAlertsCount = notifications.filter(n => n.type === 'system' || n.type === 'security').length;

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Notifications"
        description={`Manage system alerts, announcements, and platform notifications`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]}
      />

      {/* KPI Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <span className="text-2xl font-bold">{totalNotifications}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BellRing className="h-4 w-4" />
              <span className="text-sm font-medium">Unread</span>
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{unreadCount}</span>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
            )}
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Megaphone className="h-4 w-4" />
              <span className="text-sm font-medium">Announcements</span>
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{announcementsCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">System / Security</span>
            </div>
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{systemAlertsCount}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdminNotificationFilters
                filters={filters}
                onFilterChange={setFilters}
                sorting={sorting}
                onSortChange={setSorting}
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <AdminNotificationSearch
                value={search}
                onChange={setSearch}
                className="flex-1 w-full"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <AdminNotificationCompose />

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
                    <AdminNotificationFilters
                      filters={filters}
                      onFilterChange={setFilters}
                      sorting={sorting}
                      onSortChange={setSorting}
                      onReset={resetFilters}
                    />
                  </SheetContent>
                </Sheet>

                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => markAllAdminNotificationsRead()}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>

            {paginatedNotifications.length === 0 ? (
              <EmptyState
                title="No notifications found"
                description="No notifications match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <AdminNotificationsTable notifications={paginatedNotifications} />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedNotifications.map(notification => (
                    <AdminNotificationCard key={notification.id} notification={notification} />
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
