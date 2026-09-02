import type { AdminConversation } from '../../../store/useAdminStore';
import { AdminConversationStatusBadge } from './AdminConversationStatusBadge';
import { AdminConversationActions } from './AdminConversationActions';
import { User, Store, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

interface AdminConversationsTableProps {
  conversations: AdminConversation[];
}

export function AdminConversationsTable({ conversations }: AdminConversationsTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full overflow-auto bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Listing</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Parties</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Last Message</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Updated</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            return (
              <tr key={conversation.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 max-w-[200px]">
                    <Link to={`/admin/messages/${conversation.id}`} className="font-semibold hover:underline truncate text-primary">
                      {conversation.listingTitle}
                    </Link>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 shrink-0" /> {conversation.messages.length} messages
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2 max-w-[150px]">
                    <div className="flex items-center gap-1.5 text-xs">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <Link to={`/admin/buyers/${conversation.buyerId}`} className="truncate hover:underline">
                        <span className="font-medium text-foreground">{conversation.buyerName}</span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Store className="h-3.5 w-3.5 shrink-0" />
                      <Link to={`/admin/sellers/${conversation.sellerId}`} className="truncate hover:underline">
                        <span className="truncate">{conversation.sellerName}</span>
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {lastMessage ? (
                    <div className="flex flex-col gap-1 max-w-[250px]">
                      <span className="text-xs font-medium">{lastMessage.senderName}</span>
                      <span className="text-xs text-muted-foreground truncate" title={lastMessage.content}>{lastMessage.content}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No messages</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminConversationStatusBadge status={conversation.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(conversation.updatedAt)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminConversationActions conversation={conversation} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
