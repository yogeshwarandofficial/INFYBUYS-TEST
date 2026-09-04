import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Search, Building2, User, Info, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { useNotifications, useUnreadNotificationCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications(1, 5);
  const { data: unreadData } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.data || [];
  const notificationCount = unreadData?.count || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_MESSAGE':
      case 'NEW_ENQUIRY':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'SAVED_SEARCH_MATCH':
        return <Search className="w-4 h-4 text-purple-500" />;
      case 'LISTING_APPROVED':
      case 'LISTING_REJECTED':
        return <Building2 className="w-4 h-4 text-amber-500" />;
      case 'KYC_APPROVED':
      case 'KYC_REJECTED':
      case 'NDA_REQUESTED':
      case 'NDA_SIGNED':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (id: string, path?: string) => {
    markAsRead.mutate(id);
    setOpen(false);
    if (path) {
      navigate(path);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {notificationCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={cn(
                    "p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors flex gap-3",
                    !notification.isRead ? "bg-primary/5" : ""
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-sm leading-tight",
                      !notification.isRead ? "font-semibold" : "font-medium"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground pt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild onClick={() => setOpen(false)}>
            <Link to="/buyer/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
