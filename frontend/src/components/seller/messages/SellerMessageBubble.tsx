import { type SellerMessage } from '@/store/useSellerStore';
import { cn } from '@/lib/utils';
import { User, Building2, Paperclip, CheckCheck, Check } from 'lucide-react';
import { formatDateTime } from '@/utils/dateUtils';

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface SellerMessageBubbleProps {
  message: SellerMessage;
}

export function SellerMessageBubble({ message }: SellerMessageBubbleProps) {
  const isSeller = message.senderType === 'seller';

  return (
    <div className={cn('flex gap-3 group', isSeller && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 mt-1',
          isSeller
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-muted border-border text-muted-foreground'
        )}
        aria-hidden="true"
      >
        {isSeller ? (
          <Building2 className="w-3.5 h-3.5" />
        ) : (
          <User className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col max-w-[78%] min-w-0', isSeller && 'items-end')}>
        {/* Sender + time */}
        <div className={cn('flex items-baseline gap-2 mb-1 flex-wrap', isSeller && 'flex-row-reverse')}>
          <span className="text-xs font-semibold">
            {isSeller ? 'You' : message.senderName}
          </span>
          <time
            dateTime={message.createdAt}
            className="text-[10px] text-muted-foreground"
          >
            {formatDateTime(message.createdAt)}
          </time>
          {isSeller && (
            <span className="text-[10px] text-muted-foreground" aria-label={message.isRead ? 'Read' : 'Sent'}>
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-primary" aria-hidden="true" />
              ) : (
                <Check className="w-3 h-3" aria-hidden="true" />
              )}
            </span>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isSeller
              ? 'bg-primary/10 border border-primary/20 text-foreground rounded-tr-sm'
              : 'bg-muted border border-border text-foreground rounded-tl-sm'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        </div>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className={cn('mt-2 space-y-1.5 w-full', isSeller && 'items-end flex flex-col')}>
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 border text-xs',
                  'bg-muted/50 border-border hover:bg-muted transition-colors',
                  isSeller ? 'flex-row-reverse' : 'flex-row'
                )}
                role="img"
                aria-label={`Attachment: ${att.name} (${formatFileSize(att.size)})`}
              >
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                <div className={cn('min-w-0', isSeller && 'text-right')}>
                  <p className="font-medium truncate max-w-[200px]">{att.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(att.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
