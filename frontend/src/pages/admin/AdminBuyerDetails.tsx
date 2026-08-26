import { useParams, useNavigate } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { AdminBuyerStatusBadge } from '../../components/admin/buyers/AdminBuyerStatusBadge';
import { AdminBuyerVerificationBadge } from '../../components/admin/buyers/AdminBuyerVerificationBadge';
import { AdminBuyerActions } from '../../components/admin/buyers/AdminBuyerActions';
import { ArrowLeft, Mail, MapPin, Building2, Eye, MessageSquare, History, FileText, ShoppingCart } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';

export default function AdminBuyerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buyer = useAdminStore((state) => state.buyers.find(b => b.id === id));

  if (!buyer) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Buyer Not Found" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Buyers', href: '/admin/buyers' }, { label: 'Not Found' }]} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title="Buyer not found"
            description="The buyer you're looking for doesn't exist or has been deleted."
            actionLabel="Back to Buyers"
            onAction={() => navigate('/admin/buyers')}
          />
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-muted/10 pb-12">
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/buyers')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to buyers</span>
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{buyer.name}</h1>
                <AdminBuyerStatusBadge status={buyer.status} />
              </div>
              <span className="text-sm text-muted-foreground">{buyer.company || 'No Company'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminBuyerActions buyer={buyer} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Profile & Contact */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <AvatarImage src={buyer.avatar} alt={buyer.name} />
                    <AvatarFallback className="text-2xl">{getInitials(buyer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{buyer.name}</h2>
                    <p className="text-muted-foreground">{buyer.company}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <AdminBuyerVerificationBadge status={buyer.verificationStatus} />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{buyer.email}</span>
                  </div>
                  {buyer.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{buyer.phone}</span>
                    </div>
                  )}
                  {buyer.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{buyer.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium text-right">{formatDate(buyer.joinedAt)}</span>
                </div>
                {buyer.lastActiveAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium text-right">{formatDate(buyer.lastActiveAt)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-right">{formatDate(buyer.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{buyer.totalEnquiries}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Total Enquiries</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{buyer.totalMessages}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Total Messages</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{buyer.totalNdaRequests}</h4>
                    <p className="text-xs text-muted-foreground font-medium">NDA Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold text-primary">{buyer.totalPurchases}</h4>
                    <p className="text-xs text-primary/80 font-medium">Purchases</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {buyer.activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p>No admin activity recorded for this buyer.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {buyer.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        {index !== buyer.activities.length - 1 && (
                          <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-border" />
                        )}
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col pb-6">
                          <span className="font-medium text-sm capitalize">{activity.type}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
                          {activity.description && (
                            <p className="text-sm mt-1 text-muted-foreground">{activity.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
