import { MessageSquare } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-transparent h-full p-8 text-center">
      <div className="w-24 h-24 bg-[#EFF6FF] p-6 rounded-full mb-8 flex items-center justify-center shadow-inner ring-4 ring-[#EFF6FF]/50">
        <MessageSquare className="h-10 w-10 text-[#2563EB]" />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-[#111827]">Your Messages</h2>
      <p className="text-[15px] text-[#64748B] max-w-sm leading-relaxed">
        Select a conversation from the list to view your messages, or contact a seller from a listing to start a new conversation.
      </p>
    </div>
  );
}
