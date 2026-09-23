import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useEnquiry, useMarkEnquiryRead, useSendMessage } from '@/hooks/useEnquiries';
import { useUserStore } from '@/store/useUserStore';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Calendar, Send } from 'lucide-react';
import { formatShortDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

export default function BuyerEnquiryDetails() {
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
      <div className="w-full space-y-8">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Enquiry Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This enquiry may have been deleted or you do not have permission to view it.
          </p>
          <Button onClick={() => navigate('/buyer/enquiries')}>
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
        title={`Enquiry â€” ${enquiry.listing?.title}`}
        description={`Your enquiry regarding ${enquiry.listing?.title}.`}
      />

      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'My Enquiries', href: '/buyer/enquiries' },
              { label: 'Enquiry Details' }
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Enquiry Details</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Started {formatShortDate(enquiry.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="flex flex-col min-h-[400px]">
              <div className="p-4 border-b font-semibold flex items-center justify-between">
                <span>Conversation with {enquiry.seller?.name || 'Seller'}</span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Business Details</h3>

                <div className="mb-6">
                  <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {enquiry.listing?.coverMediaId ? (
                      <Building2 className="w-8 h-8 text-muted-foreground/30" />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <h4 className="font-bold">{enquiry.listing?.title}</h4>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <Link to={`/buyer/listing/${enquiry.listing?.id}`}>View Listing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
