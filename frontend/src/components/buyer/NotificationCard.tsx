import type { BuyerNotification } from '@/store/useBuyerStore';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Building2, User, Info, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { useBuyerStore } from '@/store/useBuyerStore';

interface NotificationCardProps {
  notification: BuyerNotification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { markNotificationAsRead, deleteNotification } = useBuyerStore();

  const getIcon = () => {
    switch (notification.type) {
      case 'enquiry': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'saved-search': return <Search className="w-5 h-5 text-purple-500" />;
      case 'listing': return <Building2 className="w-5 h-5 text-amber-500" />;
      case 'account': return <User className="w-5 h-5 text-green-500" />;
      case 'system': return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleRead = () => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-5 rounded-xl transition-all duration-200 border",
        notification.read
          ? "bg-white/50 backdrop-blur-sm hover:bg-white/80 border-[#E2E8F0]"
          : "bg-white/85 backdrop-blur-md hover:bg-white/95 border-blue-200 shadow-sm"
      )}
      onClick={handleRead}
    >
      <div className={cn(
        "shrink-0 w-11 h-11 rounded-full flex items-center justify-center",
        notification.read ? "bg-slate-100" : "bg-blue-50 shadow-inner ring-2 ring-blue-50/50"
      )}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className={cn(
            "text-[15px] truncate",
            notification.read ? "font-medium text-[#64748B]" : "font-semibold text-[#0F172A]"
          )}>
            {notification.title}
          </h4>
          <span className="shrink-0 text-[11px] font-medium text-[#94A3B8] whitespace-nowrap mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className={cn(
          "text-[13px] mb-3 line-clamp-2 leading-relaxed",
          notification.read ? "text-[#94A3B8]" : "text-[#64748B]"
        )}>
          {notification.message}
        </p>

        {notification.relatedPath && (
          <Button
            variant={notification.read ? "outline" : "default"}
            size="sm"
            className={cn(
              "h-8 text-xs px-3 rounded-lg",
              notification.read ? "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]" : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
            )}
            asChild
          >
            <Link to={notification.relatedPath} onClick={handleRead}>
              View Details <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        )}
      </div>

      {!notification.read && (
        <div className="absolute top-6 right-4 w-2 h-2 bg-[#2563EB] rounded-full shadow-sm" aria-label="Unread indicator" />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        aria-label="Delete notification"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
