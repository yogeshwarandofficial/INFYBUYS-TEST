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
    <Card className="h-full flex flex-col bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 p-5">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-[#111827]">Recent Activity</CardTitle>
          <CardDescription className="text-[13px] text-[#64748B]">Latest updates on your listings and account</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="h-8 text-xs text-[#2563EB] hover:bg-blue-50">
            <Check className="w-3 h-3 mr-1.5" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-5 pt-2">
        <div className="space-y-6">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-8 text-[#64748B] text-sm">
              No recent activity.
            </div>
          ) : (
            recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "relative pl-6 pb-6 last:pb-0 border-l border-[#E5E9F2]",
                  "before:absolute before:left-[-5px] before:top-1 before:w-2.5 before:h-2.5 before:rounded-full before:bg-white before:border-2 before:border-[#E5E9F2]",
                  !notif.isRead && "before:bg-[#2563EB] before:border-[#2563EB] cursor-pointer hover:bg-slate-50/80 transition-colors -ml-4 pl-10 pr-2 pt-1 -mt-1 rounded-xl"
                )}
                onClick={() => handleClick(notif)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-white shadow-sm">
                    <SellerNotificationIcon type={notif.type} className="w-5 h-5 text-[#64748B]" />
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-sm font-semibold leading-none", !notif.isRead ? "text-[#111827]" : "text-[#334155]")}>
                      {notif.title}
                    </p>
                    <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-xs text-[#94A3B8] pt-1 font-medium">
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
