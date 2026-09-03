import { useNavigate } from 'react-router';
import { type SellerConversation } from '@/store/useSellerStore';
import { useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Building, Clock, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface SellerConversationCardProps {
  conversation: SellerConversation;
}

// Generate a deterministic color for a buyer's avatar initial
const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const STATUS_BADGE: Record<SellerConversation['status'], { label: string; className: string } | null> = {
  active: null,
  archived: { label: 'Archived', className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  closed: { label: 'Closed', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { formatFileSize };

export function SellerConversationCard({ conversation }: SellerConversationCardProps) {
  const navigate = useNavigate();
  const { markConversationAsRead } = useSellerStore();
  const isUnread = conversation.unreadCount > 0;
  const statusBadge = STATUS_BADGE[conversation.status];
  const avatarColor = getAvatarColor(conversation.buyerId);
  const initial = conversation.buyerName.charAt(0).toUpperCase();
  const hasAttachments = conversation.messages.some((m) => m.attachments.length > 0);

  const handleClick = () => {
    if (isUnread) markConversationAsRead(conversation.id);
    navigate(`/seller/messages/${conversation.id}`);
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
      aria-label={`Conversation with ${conversation.buyerName}: ${conversation.lastMessage}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'overflow-hidden transition-all cursor-pointer hover:shadow-md hover:border-primary/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isUnread && 'border-primary/60 bg-primary/[0.02] dark:bg-primary/[0.04]'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar with unread dot */}
          <div className="relative shrink-0">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                avatarColor
              )}
              aria-hidden="true"
            >
              {initial}
            </div>
            {isUnread && (
              <span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background"
                aria-label={`${conversation.unreadCount} unread messages`}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Row 1: Name + badges + time */}
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="flex items-center flex-wrap gap-1.5 min-w-0">
                <span className={cn('text-[15px] font-semibold text-[#111827] truncate', isUnread && 'text-foreground')}>
                  {conversation.buyerName}
                </span>
                {isUnread && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
                    {conversation.unreadCount} new
                  </span>
                )}
                {statusBadge && (
                  <Badge
                    variant="secondary"
                    className={cn(statusBadge.className, 'font-medium border-0 text-[10px] shrink-0')}
                    aria-label={`Status: ${statusBadge.label}`}
                  >
                    {statusBadge.label}
                  </Badge>
                )}
              </div>
              <time
                dateTime={conversation.lastMessageAt}
                className="text-xs text-[#64748B] shrink-0"
              >
                {formatDistanceToNow(conversation.lastMessageAt)}
              </time>
            </div>

            {/* Row 2: Company + listing */}
            <div className="flex items-center gap-3 text-xs text-[#64748B] mb-1.5 flex-wrap">
              {conversation.buyerCompany && (
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{conversation.buyerCompany}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{conversation.listingTitle}</span>
              </span>
            </div>

            {/* Row 3: Last message + attachment indicator */}
            <div className="flex items-center gap-2">
              <p className={cn(
                'text-xs line-clamp-1 flex-1',
                isUnread ? 'text-foreground font-medium' : 'text-[#64748B]'
              )}>
                {conversation.lastMessage}
              </p>
              {hasAttachments && (
                <Paperclip
                  className="w-3 h-3 text-[#64748B] shrink-0"
                  aria-label="Has attachments"
                />
              )}
              <span className="flex items-center gap-0.5 text-xs text-[#64748B] shrink-0">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {conversation.messages.length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
