import { MessageCircle } from 'lucide-react';

export function EmptyConversation() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="bg-muted p-4 rounded-full mb-4">
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No messages yet</h3>
      <p className="text-muted-foreground">
        Send a message to start the conversation.
      </p>
    </div>
  );
}
