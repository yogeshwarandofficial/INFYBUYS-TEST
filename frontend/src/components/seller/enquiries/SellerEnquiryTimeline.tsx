import { type SellerEnquiry } from '@/store/useSellerStore';
import { cn } from '@/lib/utils';
import { User, Building2 } from 'lucide-react';
import { formatDateTime } from '@/utils/dateUtils';

interface SellerEnquiryTimelineProps {
  enquiry: SellerEnquiry;
}

export function SellerEnquiryTimeline({ enquiry }: SellerEnquiryTimelineProps) {
  const allMessages = [
    {
      id: `original-${enquiry.id}`,
      senderType: 'buyer' as const,
      senderName: enquiry.buyerName,
      message: enquiry.message,
      createdAt: enquiry.createdAt,
      isOriginal: true,
    },
    ...enquiry.responses.map((r) => ({
      id: r.id,
      senderType: r.senderType,
      senderName: r.senderName,
      message: r.message,
      createdAt: r.createdAt,
      isOriginal: false,
    })),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <section aria-label="Enquiry conversation timeline">
      <ol className="space-y-4 list-none">
        {allMessages.map((msg, index) => {
          const isSeller = msg.senderType === 'seller';
          return (
            <li key={msg.id} className="relative">
              {/* Connector line */}
              {index < allMessages.length - 1 && (
                <div
                  className="absolute left-5 top-12 bottom-0 w-px bg-border"
                  aria-hidden="true"
                />
              )}

              <div className={cn('flex gap-3', isSeller && 'flex-row-reverse')}>
                {/* Avatar */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2',
                    isSeller
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  {isSeller ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div className={cn('flex-1 min-w-0', isSeller && 'flex flex-col items-end')}>
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold">
                      {isSeller ? 'You (Seller)' : msg.senderName}
                    </span>
                    {msg.isOriginal && (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                        Original Enquiry
                      </span>
                    )}
                    <time
                      dateTime={msg.createdAt}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDateTime(msg.createdAt)}
                    </time>
                  </div>

                  <div
                    className={cn(
                      'rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[85%]',
                      isSeller
                        ? 'bg-primary/10 text-foreground border border-primary/20'
                        : 'bg-muted text-foreground border border-border'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
