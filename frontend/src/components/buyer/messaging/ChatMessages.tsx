import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyConversation } from './EmptyConversation';
import type { Message, Conversation } from '@/store/useBuyerStore';

interface ChatMessagesProps {
  conversation: Conversation;
  messages: Message[];
  isTyping?: boolean;
}

export function ChatMessages({ conversation, messages, isTyping }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing status changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return <EmptyConversation />;
  }

  // Add date separators (simplified for now)
  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10"
      ref={scrollRef}
    >
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            showAvatar={showAvatar}
            sellerAvatar={conversation.sellerAvatar}
          />
        );
      })}

      {isTyping && (
        <div className="flex gap-2 w-full">
          <div className="w-8 flex-shrink-0 flex flex-col justify-end pb-1">
            <img
              src={conversation.sellerAvatar}
              alt="Seller"
              className="h-8 w-8 rounded-full border bg-background object-cover"
            />
          </div>
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}
