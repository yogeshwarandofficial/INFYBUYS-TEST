import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/store/useBuyerStore';

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, isActive, onClick }: ConversationListItemProps) {
  // Format the date nicely
  const date = new Date(conversation.lastMessageAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const timeString = isToday
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex gap-3 p-4 cursor-pointer transition-colors border-b",
        isActive ? "bg-primary/5" : "hover:bg-muted/50"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={conversation.sellerAvatar} alt={conversation.sellerName} />
          <AvatarFallback>{conversation.sellerName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className="text-sm font-semibold truncate pr-2">{conversation.businessName}</h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{timeString}</span>
        </div>

        <div className="text-xs text-muted-foreground truncate mb-1">
          {conversation.sellerName}
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className={cn(
            "text-sm truncate",
            conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {conversation.lastMessage || 'No messages yet'}
          </p>

          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 min-w-[20px] justify-center text-[10px]">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
