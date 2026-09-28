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
    <div className="w-full overflow-auto rounded-2xl border border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm">
      <table className="w-full text-sm text-left table-fixed">
        <thead className="text-[12px] font-semibold text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#E5E9F2]">
          <tr>
            <th className="px-4 py-3 font-medium w-[15%]">Type</th>
            <th className="px-4 py-3 font-medium w-[65%]">Title & Message</th>
            <th className="px-4 py-3 font-medium w-[15%]">Date</th>
            <th className="px-4 py-3 font-medium w-[60px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9F2]">
          {notifications.map((notification) => (
            <tr
              key={notification.id}
              className={cn(
                "transition-colors group h-[72px]",
                !notification.isRead ? "bg-blue-50/30" : "hover:bg-[#F8FAFC]/50",
                notification.link ? "cursor-pointer" : ""
              )}
              onClick={() => handleRowClick(notification)}
            >
              <td className="px-4 py-2 align-middle">
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                  <AdminNotificationTypeBadge type={notification.type} />
                </div>
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex flex-col gap-1 pr-4">
                  <span className={cn("font-semibold text-[14px] line-clamp-1", !notification.isRead ? "text-gray-900" : "text-gray-700")}>
                    {notification.title}
                  </span>
                  <span className="text-[13px] text-slate-500 line-clamp-1" title={notification.message}>
                    {notification.message}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{formatDate(notification.createdAt)}</span>
                </div>
              </td>
              <td className="px-4 py-2 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                <AdminNotificationActions notification={notification} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
