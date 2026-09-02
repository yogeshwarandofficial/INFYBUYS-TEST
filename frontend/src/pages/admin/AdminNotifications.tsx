import { useAdminStore } from '../../store/useAdminStore';
import { useAdminNotificationSearch } from '../../hooks/useAdminNotificationSearch';
import { AdminNotificationsTable } from '../../components/admin/notifications/AdminNotificationsTable';
import { AdminNotificationCard } from '../../components/admin/notifications/AdminNotificationCard';
import { AdminNotificationSearch } from '../../components/admin/notifications/AdminNotificationSearch';
import { AdminNotificationFilters } from '../../components/admin/notifications/AdminNotificationFilters';
import { AdminNotificationCompose } from '../../components/admin/notifications/AdminNotificationCompose';
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
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Notifications</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage system alerts, announcements, and platform notifications</p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center"><Bell className="h-5 w-5" /></div></div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Total</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{totalNotifications}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center">
                <BellRing className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Unread</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{unreadCount}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50/80 text-purple-600 border border-purple-100/50 flex items-center justify-center">
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Announcements</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{announcementsCount}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-50/80 text-slate-600 border border-slate-200/50 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">System / Security</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{systemAlertsCount}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
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
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-2">
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
              <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-8 flex items-center justify-center">
                <EmptyState
                title="No notifications found"
                description="No notifications match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
              </div>
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
