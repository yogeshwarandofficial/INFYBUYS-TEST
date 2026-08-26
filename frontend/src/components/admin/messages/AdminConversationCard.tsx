import type { AdminConversation } from '../../../store/useAdminStore';
import { Card, CardContent } from '../../ui/card';
import { AdminConversationStatusBadge } from './AdminConversationStatusBadge';
import { AdminConversationActions } from './AdminConversationActions';
import { User, Store, MessageCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminConversationCardProps {
  conversation: AdminConversation;
}

export function AdminConversationCard({ conversation }: AdminConversationCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/admin/messages/${conversation.id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View details for conversation about ${conversation.listingTitle}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/admin/messages/${conversation.id}`);
        }
      }}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-sm line-clamp-2 text-primary">{conversation.listingTitle}</span>
            <div className="flex items-center gap-2 mt-1">
              <AdminConversationStatusBadge status={conversation.status} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> {conversation.messages.length}
              </span>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminConversationActions conversation={conversation} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y py-2 border-border">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1"><User className="h-3 w-3" /> Buyer</span>
            <span className="font-medium text-foreground truncate">{conversation.buyerName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1"><Store className="h-3 w-3" /> Seller</span>
            <span className="font-medium text-foreground truncate">{conversation.sellerName}</span>
          </div>
        </div>

        {lastMessage && (
          <div className="bg-muted/50 p-2 rounded-md text-xs">
            <span className="font-medium">{lastMessage.senderName}: </span>
            <span className="text-muted-foreground line-clamp-1">{lastMessage.content}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Upd: {formatDate(conversation.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
