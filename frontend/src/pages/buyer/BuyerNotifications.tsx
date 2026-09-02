import { useState, useMemo } from 'react';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { NotificationType } from '@/store/useBuyerStore';
import { NotificationCard } from '@/components/buyer/NotificationCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function BuyerNotifications() {
  const { notifications, notificationCount, markAllNotificationsAsRead } = useBuyerStore();
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filterType !== 'all') {
      result = result.filter(n => n.type === filterType);
    }

    if (filterRead === 'unread') {
      result = result.filter(n => !n.read);
    } else if (filterRead === 'read') {
      result = result.filter(n => n.read);
    }

    return result;
  }, [notifications, filterType, filterRead]);

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">Notifications</h1>
          <p className="text-[#64748B] mt-2 font-medium flex items-center gap-2">
            You have {notificationCount} unread message{notificationCount !== 1 ? 's' : ''}.
          </p>
        </div>

        {notificationCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead} className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] text-[#0F172A] shadow-sm hover:bg-blue-50/50 hover:text-[#2563EB] rounded-xl h-11 px-6 transition-all">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white/80 backdrop-blur-md p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus:ring-[#2563EB]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="enquiry">Enquiries</SelectItem>
            <SelectItem value="saved-search">Saved Searches</SelectItem>
            <SelectItem value="listing">Listings</SelectItem>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRead} onValueChange={(val) => setFilterRead(val as any)}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus:ring-[#2563EB]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {notifications.length === 0 ? (
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100/40 blur-3xl rounded-full -z-10" />
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
              <Bell className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">No notifications yet</h3>
            <p className="text-[#64748B] max-w-sm mx-auto text-[15px] leading-relaxed">
              We'll let you know when there's an update on your enquiries, saved searches, or account activity.
            </p>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white/60 backdrop-blur-md rounded-xl border border-[#E2E8F0]">
          <p className="text-[#64748B] font-medium">No notifications match your filters.</p>
          <Button variant="link" onClick={() => { setFilterType('all'); setFilterRead('all'); }} className="text-[#2563EB]">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
