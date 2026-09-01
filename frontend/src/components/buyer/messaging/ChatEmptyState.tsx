import { MessageSquare } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 h-full p-8 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <MessageSquare className="h-16 w-16 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
      <p className="text-muted-foreground max-w-md">
        Select a conversation from the list to view your messages, or contact a seller from a listing to start a new conversation.
      </p>
    </div>
  );
}
