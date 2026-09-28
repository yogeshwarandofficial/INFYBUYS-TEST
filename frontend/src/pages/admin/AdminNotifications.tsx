import type { AdminNotification } from '../../store/useAdminStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminNotificationSearch } from '../../hooks/useAdminNotificationSearch';
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
import { cn } from '../../lib/utils';

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

  const groupNotificationsByDate = (notifs: AdminNotification[]) => {
    const today: AdminNotification[] = [];
    const yesterday: AdminNotification[] = [];
    const earlier: AdminNotification[] = [];

    const now = new Date();
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStr = todayStr - 86400000;

    notifs.forEach(n => {
      const d = new Date(n.createdAt);
      const time = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (time === todayStr) today.push(n);
      else if (time === yesterdayStr) yesterday.push(n);
      else earlier.push(n);
    });

    const groups: { label: string; items: AdminNotification[] }[] = [];
    if (today.length > 0) groups.push({ label: 'Today', items: today });
    if (yesterday.length > 0) groups.push({ label: 'Yesterday', items: yesterday });
    if (earlier.length > 0) groups.push({ label: 'Earlier', items: earlier });

    return groups;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Notifications</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage system alerts, announcements, and platform notifications</p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{totalNotifications}</span>
          </div>
          <div className={cn(
            "backdrop-blur-md border shadow-sm rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md",
            unreadCount > 0 
              ? "bg-blue-600 border-blue-600 shadow-blue-600/20 text-white" 
              : "bg-white/85 border-[#E5E9F2] shadow-blue-900/5 text-[#111827]"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                unreadCount > 0
                  ? "bg-white/20 text-white border-white/20"
                  : "bg-blue-50 text-blue-600 border-blue-100/50"
              )}>
                <BellRing className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-[12px] font-semibold uppercase tracking-wider",
                unreadCount > 0 ? "text-blue-50" : "text-[#64748B]"
              )}>Unread</span>
            </div>
            <span className="text-2xl font-bold mt-3">{unreadCount}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100/50 flex items-center justify-center shrink-0">
                <Megaphone className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Announcements</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{announcementsCount}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/50 flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">System / Security</span>
            </div>
            <span className="text-2xl font-bold text-[#111827] mt-3">{systemAlertsCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Unified Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/50 p-3 rounded-2xl border border-[#E5E9F2] shadow-sm">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] lg:max-w-xs">
                <AdminNotificationSearch
                  value={search}
                  onChange={setSearch}
                  className="flex-1 w-full"
                />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden shrink-0">
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
              </div>

              <div className="hidden lg:flex flex-1 items-center gap-4">
                <AdminNotificationFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  sorting={sorting}
                  onSortChange={setSorting}
                  onReset={resetFilters}
                  orientation="horizontal"
                />
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto">
                <AdminNotificationCompose />
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    className="h-9 text-xs gap-2 w-full lg:w-auto"
                    onClick={() => markAllAdminNotificationsRead()}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>

            {paginatedNotifications.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
                <EmptyState
                title="No notifications found"
                description="No notifications match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Grouped Notification List Layout */}
                <div className="flex flex-col gap-8">
                  {groupNotificationsByDate(paginatedNotifications).map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-3">
                      <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider pl-1">
                        {group.label}
                      </h3>
                      <div className="flex flex-col gap-2.5">
                        {group.items.map(notification => (
                          <AdminNotificationCard key={notification.id} notification={notification} />
                        ))}
                      </div>
                    </div>
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
