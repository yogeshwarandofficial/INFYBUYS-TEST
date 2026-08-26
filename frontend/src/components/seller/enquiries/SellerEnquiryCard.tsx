import { useNavigate } from 'react-router';
import type { Enquiry } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface SellerEnquiryCardProps {
  enquiry: Enquiry;
}

export function SellerEnquiryCard({ enquiry }: SellerEnquiryCardProps) {
  const navigate = useNavigate();
  const isUnread = (enquiry.unreadCount || 0) > 0;

  const handleClick = () => {
    navigate(`/seller/enquiries/${enquiry.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Enquiry from ${enquiry.buyer?.name}: ${enquiry.listing?.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'overflow-hidden transition-all cursor-pointer hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isUnread && 'border-primary/60 bg-primary/[0.02] dark:bg-primary/[0.04]'
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top row: unread indicator + buyer */}
        <div className="flex items-start gap-3">
          {/* Unread indicator */}
          <div className="flex items-center pt-1 shrink-0">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors',
                isUnread ? 'bg-primary' : 'bg-transparent'
              )}
              aria-label={isUnread ? 'Unread enquiry' : undefined}
              role={isUnread ? 'img' : undefined}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Buyer name */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <p className={cn('text-sm font-semibold leading-tight truncate', isUnread && 'text-foreground')}>
                {enquiry.buyer?.name}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {isUnread && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  <span aria-hidden="true">●</span>
                  {enquiry.unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Listing */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{enquiry.listing?.title}</span>
        </div>

        {/* Message preview */}
        {enquiry.lastMessage && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            "{enquiry.lastMessage.messageText}"
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 mt-2 border-t border-border/40">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={enquiry.updatedAt}>
              {formatDistanceToNow(enquiry.updatedAt)}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
