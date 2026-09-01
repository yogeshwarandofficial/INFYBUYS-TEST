import { FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/store/useBuyerStore';
import { MessageStatus } from './MessageStatus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  sellerAvatar?: string;
}

export function MessageBubble({ message, showAvatar, sellerAvatar }: MessageBubbleProps) {
  const isBuyer = message.senderRole === 'buyer';

  return (
    <div className={cn("flex flex-col gap-1 w-full max-w-[85%]", isBuyer ? "ml-auto items-end" : "mr-auto items-start")}>

      <div className={cn("flex gap-2 w-full", isBuyer ? "flex-row-reverse" : "flex-row")}>

        {/* Avatar for seller */}
        {!isBuyer && (
          <div className="w-8 flex-shrink-0 flex flex-col justify-end pb-1">
            {showAvatar && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={sellerAvatar} alt={message.senderName} />
                <AvatarFallback>{message.senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={cn(
          "flex flex-col gap-1 w-full",
          isBuyer ? "items-end" : "items-start"
        )}>

          {/* Text Bubble */}
          {message.content && (
            <div
              className={cn(
                "px-4 py-2 rounded-2xl relative",
                isBuyer
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={cn("flex flex-col gap-2 mt-1", isBuyer ? "items-end" : "items-start")}>
              {message.attachments.map((att) => {
                const isImage = att.type.startsWith('image/');

                return (
                  <div
                    key={att.id}
                    className="border bg-background rounded-lg overflow-hidden flex flex-col max-w-[240px]"
                  >
                    {isImage ? (
                      <div className="aspect-video w-full bg-muted">
                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-muted/30">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{att.name}</p>
                          <p className="text-xs text-muted-foreground">{(att.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-1.5 px-1 mt-0.5">
            <span className="text-[10px] text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
            {isBuyer && <MessageStatus status={message.status} />}
          </div>

        </div>
      </div>
    </div>
  );
}
