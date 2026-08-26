import type { AdminNotification } from '../../../store/useAdminStore';
import { AdminNotificationTypeBadge } from './AdminNotificationTypeBadge';
import { AdminNotificationActions } from './AdminNotificationActions';
import { Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAdminStore } from '../../../store/useAdminStore';
import { useNavigate } from 'react-router';

interface AdminNotificationsTableProps {
  notifications: AdminNotification[];
}

export function AdminNotificationsTable({ notifications }: AdminNotificationsTableProps) {
  const navigate = useNavigate();
  const { markAdminNotificationRead } = useAdminStore();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const handleRowClick = (notification: AdminNotification) => {
    if (!notification.isRead) {
      markAdminNotificationRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="w-full overflow-auto border rounded-md bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Type</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[250px]">Title & Message</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {notifications.map((notification) => (
            <tr
              key={notification.id}
              className={cn(
                "transition-colors group",
                !notification.isRead ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-muted/50",
                notification.link ? "cursor-pointer" : ""
              )}
              onClick={() => handleRowClick(notification)}
            >
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  <AdminNotificationTypeBadge type={notification.type} />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 max-w-lg">
                  <span className={cn("font-medium", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2" title={notification.message}>
                    {notification.message}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatDate(notification.createdAt)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right align-top" onClick={(e) => e.stopPropagation()}>
                <AdminNotificationActions notification={notification} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
