import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { ConversationList } from '@/components/buyer/messaging/ConversationList';
import { ChatHeader } from '@/components/buyer/messaging/ChatHeader';
import { ChatMessages } from '@/components/buyer/messaging/ChatMessages';
import { MessageComposer } from '@/components/buyer/messaging/MessageComposer';
import { useEnquiry, useSendMessage, useMarkEnquiryRead } from '@/hooks/useEnquiries';
import { useUserStore } from '@/store/useUserStore';

export default function BuyerConversation() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const { data: enquiry, isLoading } = useEnquiry(conversationId || '');
  const { mutate: sendMessage } = useSendMessage(conversationId || '');
  const { mutate: markRead } = useMarkEnquiryRead(conversationId || '');

  useEffect(() => {
    if (enquiry && enquiry.unreadCount && enquiry.unreadCount > 0) {
      markRead();
    }
  }, [enquiry, markRead]);

  // Handle invalid conversation
  useEffect(() => {
    if (conversationId && !isLoading && !enquiry) {
      navigate('/buyer/messages');
    }
  }, [conversationId, enquiry, isLoading, navigate]);

  const handleSend = (content: string) => {
    if (!conversationId || !content.trim()) return;
    sendMessage({ messageText: content });
  };

  const handleBack = () => {
    navigate('/buyer/messages');
  };

  if (!enquiry) return null;

  // Map API Enquiry to mock Conversation format for the child components
  const mockConversation = {
    id: enquiry.id,
    listingId: enquiry.listingId,
    listingTitle: enquiry.listing?.title,
    businessName: enquiry.listing?.title,
    sellerName: enquiry.seller?.name,
    status: 'active' as const,
  };

  const mockMessages = (enquiry.messages || []).map(msg => ({
    id: msg.id,
    conversationId: msg.enquiryId,
    senderId: msg.senderId,
    senderRole: msg.senderId === user?.id ? 'buyer' : 'seller',
    content: msg.messageText,
    createdAt: msg.sentAt,
    status: 'read' as const,
  }));

  return (
    <>
      <Seo title={`Messages - ${mockConversation.businessName}`} />
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
        {/* Left Sidebar - Hidden on mobile when a chat is open */}
        <div className="hidden md:block md:w-[350px] lg:w-[400px] flex-shrink-0 h-full border-r">
          <ConversationList />
        </div>

        {/* Right Content Area - Chat */}
        <div className="flex-1 flex flex-col bg-background h-full w-full min-w-0">
          <ChatHeader
            conversation={mockConversation as any}
            onBack={handleBack}
          />

          <ChatMessages
            conversation={mockConversation as any}
            messages={mockMessages as any}
          />

          <MessageComposer
            onSend={handleSend}
            disabled={mockConversation.status !== 'active'}
          />
        </div>
      </div>
    </>
  );
}
