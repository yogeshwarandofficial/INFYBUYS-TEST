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
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        notification.link ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : "",
        !notification.isRead 
          ? "bg-blue-50/40 border-blue-100/50" 
          : "bg-white/85 backdrop-blur-md border-[#E5E9F2] shadow-sm shadow-blue-900/5 hover:border-blue-200"
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
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-md"></div>
      )}
      
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Left Side: Type Badge and Main Content */}
        <div className="flex-1 min-w-0 flex gap-3 sm:gap-4">
          <div className="shrink-0 mt-1 sm:mt-0.5">
            <AdminNotificationTypeBadge type={notification.type} className="shadow-sm" />
          </div>
          <div className="flex flex-col min-w-0 gap-1">
            <span className={cn(
              "text-[15px] truncate", 
              !notification.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
            )}>
              {notification.title}
            </span>
            <span className="text-[14px] text-slate-500 line-clamp-1 sm:line-clamp-2 pr-4">
              {notification.message}
            </span>
          </div>
        </div>

        {/* Right Side: Timestamp and Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 ml-10 sm:ml-0">
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(notification.createdAt)}</span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminNotificationActions notification={notification} />
          </div>
        </div>
      </div>
    </div>
  );
}
