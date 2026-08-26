import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MessageSquareOff } from 'lucide-react';
import { useBuyerStore } from '@/store/useBuyerStore';
import { ConversationSearch } from './ConversationSearch';
import { ConversationFilters } from './ConversationFilters';
import type { ConversationFilter } from './ConversationFilters';
import { ConversationListItem } from './ConversationListItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationListProps {
  onSelect?: (id: string) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { conversations } = useBuyerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>('all');

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            conv.businessName.toLowerCase().includes(query) ||
            conv.sellerName.toLowerCase().includes(query) ||
            conv.listingTitle.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }

        // Apply filter
        switch (filter) {
          case 'unread':
            return conv.unreadCount > 0;
          case 'active':
            return conv.status === 'active';
          case 'archived':
            return conv.status === 'archived';
          case 'closed':
            return conv.status === 'closed';
          case 'all':
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations, searchQuery, filter]);

  const handleSelect = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      navigate(`/buyer/messages/${id}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-xl font-bold">Messages</h2>
        <ConversationSearch value={searchQuery} onChange={setSearchQuery} />
        <ConversationFilters currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length > 0 ? (
          <div className="flex flex-col">
            {filteredConversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={conversationId === conv.id}
                onClick={() => handleSelect(conv.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
            <MessageSquareOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No conversations found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || filter !== 'all'
                ? "Try adjusting your search or filters."
                : "You don't have any messages yet."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
