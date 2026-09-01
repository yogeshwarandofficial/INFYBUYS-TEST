import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { AdminConversationStatusBadge } from '../../components/admin/messages/AdminConversationStatusBadge';
import { AdminConversationActions } from '../../components/admin/messages/AdminConversationActions';
import { AdminMessageBubble } from '../../components/admin/messages/AdminMessageBubble';
import { ArrowLeft, User, Store, Package, Send, ShieldAlert } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';

export default function AdminConversationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, addAdminMessage } = useAdminStore();
  const conversation = conversations.find(c => c.id === id);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Conversation Not Found" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Messages', href: '/admin/messages' }, { label: 'Not Found' }]} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title="Conversation not found"
            description="The conversation you're looking for doesn't exist or has been deleted."
            actionLabel="Back to Messages"
            onAction={() => navigate('/admin/messages')}
          />
        </div>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || conversation.status === 'closed') return;

    addAdminMessage(conversation.id, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-muted/10 pb-12">
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/messages')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to messages</span>
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Conversation Details</h1>
                <AdminConversationStatusBadge status={conversation.status} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">ID: {conversation.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminConversationActions conversation={conversation} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Metadata */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Package className="h-4 w-4" /> Listing</h4>
                  <Link to={`/admin/listings/${conversation.listingId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                    <span className="font-medium group-hover:underline text-primary">{conversation.listingTitle}</span>
                    <span className="text-xs text-muted-foreground mt-1">ID: {conversation.listingId}</span>
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="h-4 w-4" /> Buyer</h4>
                  <Link to={`/admin/buyers/${conversation.buyerId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                    <span className="font-medium group-hover:underline text-primary">{conversation.buyerName}</span>
                    <span className="text-xs text-muted-foreground mt-1">ID: {conversation.buyerId}</span>
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Store className="h-4 w-4" /> Seller</h4>
                  <Link to={`/admin/sellers/${conversation.sellerId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                    <span className="font-medium group-hover:underline text-primary">{conversation.sellerName}</span>
                    <span className="text-xs text-muted-foreground mt-1">ID: {conversation.sellerId}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Messages */}
          <div className="lg:col-span-2">
            <Card className="flex flex-col h-[600px]">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex justify-between items-center text-lg">
                  Message Thread
                  <span className="text-sm font-normal text-muted-foreground">{conversation.messages.length} messages</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
                {conversation.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No messages in this conversation yet.
                  </div>
                ) : (
                  <>
                    {conversation.messages.map((message) => (
                      <AdminMessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              <CardFooter className="border-t p-4 bg-muted/10">
                {conversation.status === 'closed' ? (
                  <div className="w-full text-center text-sm text-muted-foreground italic flex items-center justify-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    This conversation is closed. No further messages can be sent.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                    <Input
                      placeholder="Type a message as Admin to inject into this thread..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" /> Send
                    </Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
