import { useNavigate } from 'react-router';
import { type SellerNotification, useSellerStore } from '@/store/useSellerStore';
import { SellerNotificationIcon } from './SellerNotificationIcon';
import { SellerNotificationPriorityBadge } from './SellerNotificationPriorityBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Trash2, Eye } from 'lucide-react';

interface SellerNotificationCardProps {
  notification: SellerNotification;
}

export function SellerNotificationCard({ notification }: SellerNotificationCardProps) {
  const navigate = useNavigate();
  const { markNotificationAsRead, deleteNotification } = useSellerStore();

  const handleClick = () => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      role={notification.actionUrl ? 'button' : 'article'}
      tabIndex={0}
      aria-label={`${!notification.isRead ? 'Unread ' : ''}${notification.type} notification: ${notification.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative overflow-hidden transition-all',
        notification.actionUrl && 'cursor-pointer hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !notification.isRead && 'border-primary/60 bg-primary/[0.02] dark:bg-primary/[0.04]'
      )}
    >
      <CardContent className="p-4 flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <SellerNotificationIcon type={notification.type} />

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8 sm:pr-12">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={cn('text-sm font-semibold truncate', !notification.isRead && 'text-foreground')}>
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0 uppercase tracking-wider">
                Unread
              </span>
            )}
            <SellerNotificationPriorityBadge priority={notification.priority} />
          </div>
          <p className={cn('text-xs leading-relaxed max-w-2xl', !notification.isRead ? 'text-foreground font-medium' : 'text-muted-foreground')}>
            {notification.message}
          </p>
          <time dateTime={notification.createdAt} className="block text-[11px] text-muted-foreground/70 mt-2">
            {formatDistanceToNow(notification.createdAt)}
          </time>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" aria-label="Notification actions">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.isRead && (
                <DropdownMenuItem onClick={() => markNotificationAsRead(notification.id)}>
                  <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                  Mark as Read
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteNotification(notification.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
