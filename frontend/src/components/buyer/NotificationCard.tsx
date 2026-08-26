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
        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
        notification.read
          ? "bg-card hover:bg-muted/50 border-border"
          : "bg-primary/5 hover:bg-primary/10 border-primary/20 shadow-sm"
      )}
      onClick={handleRead}
    >
      <div className={cn(
        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        notification.read ? "bg-muted" : "bg-background shadow-sm border border-primary/10"
      )}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className={cn(
            "text-base truncate",
            notification.read ? "font-medium text-muted-foreground" : "font-semibold text-foreground"
          )}>
            {notification.title}
          </h4>
          <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className={cn(
          "text-sm mb-3 line-clamp-2",
          notification.read ? "text-muted-foreground/80" : "text-muted-foreground"
        )}>
          {notification.message}
        </p>

        {notification.relatedPath && (
          <Button
            variant={notification.read ? "outline" : "default"}
            size="sm"
            className="h-8 text-xs"
            asChild
          >
            <Link to={notification.relatedPath} onClick={handleRead}>
              View Details <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
          </Button>
        )}
      </div>

      {!notification.read && (
        <div className="absolute top-6 right-4 w-2 h-2 bg-primary rounded-full" aria-label="Unread indicator" />
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
