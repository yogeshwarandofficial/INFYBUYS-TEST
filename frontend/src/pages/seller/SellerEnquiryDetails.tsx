import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useEnquiry, useMarkEnquiryRead, useSendMessage } from '@/hooks/useEnquiries';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, ExternalLink, Calendar, Send } from 'lucide-react';
import { formatShortDate, formatDistanceToNow } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

export default function SellerEnquiryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: enquiry, isLoading, error } = useEnquiry(id || '');
  const { mutate: markRead } = useMarkEnquiryRead(id || '');
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage(id || '');

  const [replyText, setReplyText] = useState('');

  // Auto mark as read when detail page opens and data is loaded
  useEffect(() => {
    if (enquiry) {
      const hasUnread = enquiry.messages?.some(m => !m.readAt && m.senderId !== user?.id);
      if (hasUnread) {
        markRead();
      }
    }
  }, [enquiry, markRead, user?.id]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading enquiry...</div>;
  }

  if (error || !enquiry) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Enquiry Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This enquiry may have been deleted or you do not have permission to view it.
          </p>
          <Button onClick={() => navigate('/seller/enquiries')}>
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Enquiries
          </Button>
        </div>
      </div>
    );
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await sendMessage({ messageText: replyText });
      setReplyText('');
    } catch (e: any) {
      alert(e.message || 'Failed to send message');
    }
  };

  return (
    <>
      <Seo
        title={`Enquiry â€” ${enquiry.buyer?.name || 'Buyer'}`}
        description={`Enquiry from ${enquiry.buyer?.name || 'Buyer'} regarding ${enquiry.listing?.title}.`}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-12 space-y-6">
        {/* Back navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/seller/enquiries')}
          className="-ml-2 gap-2"
          aria-label="Back to enquiries"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Enquiries
        </Button>

        {/* Header Card */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {enquiry.buyer?.name}
                </h1>

                <p className="flex items-center gap-1.5 text-sm">
                  <Building2 className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="text-muted-foreground">For:</span>
                  <Link
                    to={`/seller/listings/${enquiry.listing?.id}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                  >
                    {enquiry.listing?.title}
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </Link>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Received {formatShortDate(enquiry.createdAt)} &middot; {formatDistanceToNow(enquiry.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Conversation */}
            <Card className="flex flex-col min-h-[400px]">
              <div className="p-4 border-b font-semibold flex items-center justify-between">
                <span>Conversation</span>
              </div>

              <div className="flex-1 p-4 space-y-4">
                {enquiry.messages?.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[80%] rounded-lg px-4 py-3",
                        isMe
                          ? "bg-primary text-primary-foreground self-end ml-auto rounded-br-sm"
                          : "bg-muted self-start mr-auto rounded-bl-sm"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.messageText}</div>
                      <div className={cn(
                        "text-[10px] mt-1.5 opacity-70",
                        isMe ? "text-right" : "text-left"
                      )}>
                        {formatShortDate(msg.sentAt)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t bg-muted/20">
                <div className="relative">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px] pr-12 pb-12 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground hidden sm:inline-block">Press Enter to send</span>
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSending}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

          </div>

          {/* Sidebar column */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer Name</span>
                    <span className="font-medium">{enquiry.buyer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing</span>
                    <span className="font-medium truncate max-w-[120px]" title={enquiry.listing?.title}>{enquiry.listing?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Messages</span>
                    <span className="font-medium">{enquiry.messages?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
