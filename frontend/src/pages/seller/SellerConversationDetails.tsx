import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { SellerConversationHeader } from '@/components/seller/messages/SellerConversationHeader';
import { SellerMessageBubble } from '@/components/seller/messages/SellerMessageBubble';
import { SellerMessageComposer } from '@/components/seller/messages/SellerMessageComposer';
import { SellerConversationActions } from '@/components/seller/messages/SellerConversationActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Trash2,
  ExternalLink,
  MessageSquare,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { formatShortDate, formatDistanceToNow } from '@/utils/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEnquiry, useMarkEnquiryRead } from '@/hooks/useEnquiries';

export default function SellerConversationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteConversation } = useSellerStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: enquiry, isLoading } = useEnquiry(id || '');
  const { mutate: markRead } = useMarkEnquiryRead(id || '');

  // Auto mark as read on open
  useEffect(() => {
    if (enquiry && enquiry.unreadCount && enquiry.unreadCount > 0) {
      markRead();
    }
  }, [enquiry, markRead]);

  // Scroll to latest message on mount and when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [enquiry?.messages?.length]);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    navigate('/seller/messages');
    deleteConversation(id!);
  };

  if (!isLoading && !enquiry) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-2">Conversation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This conversation may have been deleted or does not exist.
          </p>
          <Button onClick={() => navigate('/seller/messages')}>
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  if (!enquiry) return null;

  const conversation = {
    id: enquiry.id,
    listingId: enquiry.listingId,
    listingTitle: enquiry.listing?.title,
    buyerName: enquiry.buyer?.name,
    buyerEmail: '',
    buyerPhone: '',
    status: 'active' as any,
    messages: (enquiry.messages || []).map(msg => ({
      id: msg.id,
      content: msg.messageText,
      senderRole: msg.senderId === enquiry.sellerId ? 'seller' : 'buyer',
      createdAt: msg.sentAt,
      status: 'read' as any,
    })),
  };

  const isComposerDisabled = conversation.status === 'archived' || conversation.status === 'closed';

  return (
    <>
      <Seo
        title={`Chat with ${conversation.buyerName}`}
        description={`Conversation with ${conversation.buyerName} regarding ${conversation.listingTitle}.`}
      />

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation?</DialogTitle>
            <DialogDescription>
              Permanently delete your conversation with{' '}
              <strong>{conversation.buyerName}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-12 space-y-5">
        {/* Header */}
        <Card>
          <CardContent className="p-4 sm:p-5">
            <SellerConversationHeader
              conversation={conversation as any}
              onDeleteRequest={() => setShowDeleteDialog(true)}
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main Column: Timeline + Composer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Message Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Conversation ({conversation.messages.length} messages)
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-4">
                <section
                  aria-label="Message timeline"
                  aria-live="polite"
                  aria-relevant="additions"
                >
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin">
                    {conversation.messages.map((msg) => (
                      <SellerMessageBubble key={msg.id} message={msg as any} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* Composer */}
            <Card>
              <CardContent className="p-4 sm:p-5">
                {isComposerDisabled ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    This conversation is{' '}
                    <strong className="capitalize">{conversation.status}</strong>. Restore it to
                    send messages.
                  </div>
                ) : (
                  <SellerMessageComposer
                    conversationId={conversation.id}
                    disabled={isComposerDisabled}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Buyer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Buyer Information</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={
                    <a
                      href={`mailto:${conversation.buyerEmail}`}
                      className="text-primary hover:underline break-all"
                    >
                      {conversation.buyerEmail}
                    </a>
                  }
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={
                    <a
                      href={`tel:${conversation.buyerPhone}`}
                      className="text-primary hover:underline"
                    >
                      {conversation.buyerPhone}
                    </a>
                  }
                />
              </CardContent>
            </Card>

            {/* Listing Context */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Listing Context</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <InfoRow
                  icon={Building2}
                  label="Enquiry For"
                  value={
                    <Link
                      to={`/seller/listings/${conversation.listingId}`}
                      className="text-primary font-medium hover:underline flex items-center gap-1 group"
                    >
                      <span className="truncate max-w-[200px]">{conversation.listingTitle}</span>
                      <ExternalLink
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </Link>
                  }
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Actions</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <SellerConversationActions
                  conversation={conversation as any}
                  inline
                />
              </CardContent>
            </Card>

            {/* Conversation Meta */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Details</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="font-mono text-foreground">{conversation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Started</span>
                  <span>{formatShortDate(enquiry.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Message</span>
                  <span>{enquiry.messages && enquiry.messages.length > 0 ? formatDistanceToNow(enquiry.messages[enquiry.messages.length - 1].sentAt) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Messages</span>
                  <span>{conversation.messages.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
          {label}
        </p>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}
