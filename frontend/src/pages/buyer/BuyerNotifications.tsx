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
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            You have {notificationCount} unread message{notificationCount !== 1 ? 's' : ''}.
          </p>
        </div>

        {notificationCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
          <SelectTrigger className="w-full sm:w-[200px]">
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
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-xl border shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <Bell className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We'll let you know when there's an update on your enquiries, saved searches, or account activity.
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notifications match your filters.</p>
          <Button variant="link" onClick={() => { setFilterType('all'); setFilterRead('all'); }}>
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
