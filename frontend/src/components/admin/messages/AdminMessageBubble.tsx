import type { AdminMessage } from '../../../store/useAdminStore';
import { cn } from '../../../lib/utils';
import { ShieldCheck, User, Store } from 'lucide-react';

interface AdminMessageBubbleProps {
  message: AdminMessage;
}

export function AdminMessageBubble({ message }: AdminMessageBubbleProps) {
  const isBuyer = message.senderRole === 'buyer';
  const isAdmin = message.senderRole === 'admin';

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={cn(
      "flex w-full mb-6",
      isAdmin ? "justify-center" : isBuyer ? "justify-start" : "justify-end"
    )}>
      {isAdmin ? (
        <div className="bg-primary/10 border border-primary/20 text-primary-foreground max-w-[85%] rounded-lg p-3 mx-auto shadow-sm flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-primary font-semibold mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>{message.senderName}</span>
          </div>
          <p className="text-sm text-foreground/90">{message.content}</p>
          <span className="text-[10px] text-muted-foreground mt-2">{formatDate(message.timestamp)} at {formatTime(message.timestamp)}</span>
        </div>
      ) : (
        <div className={cn(
          "max-w-[75%] rounded-2xl p-4 shadow-sm relative flex flex-col",
          isBuyer
            ? "bg-card border rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-semibold mb-1",
            isBuyer ? "text-primary" : "text-primary-foreground/90"
          )}>
            {isBuyer ? <User className="h-3 w-3" /> : <Store className="h-3 w-3" />}
            <span>{message.senderName}</span>
          </div>

          <p className={cn(
            "text-sm whitespace-pre-wrap",
            isBuyer ? "text-foreground" : "text-primary-foreground"
          )}>
            {message.content}
          </p>

          <div className={cn(
            "flex justify-end items-center gap-2 mt-2 pt-1 border-t",
            isBuyer ? "border-border/50" : "border-primary-foreground/20"
          )}>
            <span className={cn(
              "text-[10px]",
              isBuyer ? "text-muted-foreground" : "text-primary-foreground/70"
            )}>
              {formatDate(message.timestamp)} at {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
