import { Seo } from '@/components/shared/Seo';
import { ConversationList } from '@/components/buyer/messaging/ConversationList';
import { ChatEmptyState } from '@/components/buyer/messaging/ChatEmptyState';

export default function BuyerMessages() {
  return (
    <>
      <Seo title="Messages" />
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden max-w-7xl mx-auto px-4 xl:px-0 py-6 gap-6">
        {/* Left Sidebar - Always visible on desktop, hidden on mobile if a chat is active */}
        <div className="w-full md:w-[350px] lg:w-[380px] flex-shrink-0 h-full bg-white/80 backdrop-blur-md border border-[#E5E9F2] shadow-sm rounded-2xl overflow-hidden">
          <ConversationList />
        </div>

        {/* Right Content Area - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex flex-1 flex-col h-full bg-white/90 backdrop-blur-md border border-[#E5E9F2] shadow-sm rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[#EFF6FF]/30 pointer-events-none z-0" />
          <div className="relative z-10 h-full flex flex-col">
            <ChatEmptyState />
          </div>
        </div>
      </div>
    </>
  );
}
