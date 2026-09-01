import { Seo } from '@/components/shared/Seo';
import { ConversationList } from '@/components/buyer/messaging/ConversationList';
import { ChatEmptyState } from '@/components/buyer/messaging/ChatEmptyState';

export default function BuyerMessages() {
  return (
    <>
      <Seo title="Messages" />
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
        {/* Left Sidebar - Always visible on desktop, hidden on mobile if a chat is active */}
        <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 h-full">
          <ConversationList />
        </div>

        {/* Right Content Area - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex flex-1 flex-col bg-background h-full">
          <ChatEmptyState />
        </div>
      </div>
    </>
  );
}
