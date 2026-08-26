import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSellerStore } from '@/store/useSellerStore';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SellerNotificationIcon } from '@/components/seller/notifications/SellerNotificationIcon';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useNavigate } from 'react-router';

export function SellerRecentActivity() {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useSellerStore();
  const navigate = useNavigate();

  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <div>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest updates on your listings and account</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="h-8 text-xs">
            <Check className="w-3 h-3 mr-1.5" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6 pt-4">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No recent activity.
            </div>
          ) : (
            recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "relative pl-6 pb-6 last:pb-0 border-l border-border/50",
                  "before:absolute before:left-[-5px] before:top-1 before:w-2.5 before:h-2.5 before:rounded-full before:bg-background before:border-2 before:border-primary",
                  !notif.isRead && "before:bg-primary cursor-pointer hover:bg-muted/50 transition-colors -ml-4 pl-10 pr-2 pt-1 -mt-1 rounded-md"
                )}
                onClick={() => handleClick(notif)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <SellerNotificationIcon type={notif.type} className="w-8 h-8 border-none" />
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-sm font-medium leading-none", !notif.isRead && "text-foreground")}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {formatDistanceToNow(notif.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
