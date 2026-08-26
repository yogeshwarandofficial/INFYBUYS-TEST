import type { AdminNotification } from '../../../store/useAdminStore';
import { Card, CardContent } from '../../ui/card';
import { AdminNotificationTypeBadge } from './AdminNotificationTypeBadge';
import { AdminNotificationActions } from './AdminNotificationActions';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../../store/useAdminStore';
import { cn } from '../../../lib/utils';

interface AdminNotificationCardProps {
  notification: AdminNotification;
}

export function AdminNotificationCard({ notification }: AdminNotificationCardProps) {
  const navigate = useNavigate();
  const { markAdminNotificationRead } = useAdminStore();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNavigate = () => {
    if (!notification.isRead) {
      markAdminNotificationRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors relative",
        notification.link ? "cursor-pointer hover:bg-muted/50" : "",
        !notification.isRead ? "bg-primary/5 dark:bg-primary/10 border-primary/20" : ""
      )}
      onClick={handleNavigate}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigate();
        }
      }}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AdminNotificationTypeBadge type={notification.type} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(notification.createdAt)}
              </span>
            </div>
            <span className={cn("font-semibold text-sm", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
              {notification.title}
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminNotificationActions notification={notification} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </CardContent>
    </Card>
  );
}
