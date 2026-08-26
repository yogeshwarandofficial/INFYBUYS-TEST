import { useParams, useNavigate, Link } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminEnquiryStatusBadge, AdminEnquiryNdaBadge } from '../../components/admin/enquiries/AdminEnquiryStatusBadge';
import { AdminEnquiryActions } from '../../components/admin/enquiries/AdminEnquiryActions';
import { ArrowLeft, User, Store, History, DollarSign, MessageSquare } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';

export default function AdminEnquiryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const enquiry = useAdminStore((state) => state.enquiries.find(e => e.id === id));

  if (!enquiry) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Enquiry Not Found" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Enquiries', href: '/admin/enquiries' }, { label: 'Not Found' }]} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title="Enquiry not found"
            description="The enquiry you're looking for doesn't exist or has been deleted."
            actionLabel="Back to Enquiries"
            onAction={() => navigate('/admin/enquiries')}
          />
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-muted/10 pb-12">
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/enquiries')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to enquiries</span>
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Enquiry Details</h1>
                <AdminEnquiryStatusBadge status={enquiry.status} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">ID: {enquiry.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminEnquiryActions enquiry={enquiry} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parties Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="h-4 w-4" /> Buyer</h4>
                  <Link to={`/admin/buyers/${enquiry.buyerId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                    <span className="font-medium group-hover:underline text-primary">{enquiry.buyerName}</span>
                    {enquiry.buyerCompany && <span className="text-sm text-muted-foreground">{enquiry.buyerCompany}</span>}
                    <span className="text-xs text-muted-foreground mt-1">ID: {enquiry.buyerId}</span>
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Store className="h-4 w-4" /> Seller</h4>
                  <Link to={`/admin/sellers/${enquiry.sellerId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                    <span className="font-medium group-hover:underline text-primary">{enquiry.sellerName}</span>
                    <span className="text-xs text-muted-foreground mt-1">ID: {enquiry.sellerId}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-right">{formatDate(enquiry.createdAt)}</span>
                </div>
                {enquiry.lastMessageAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Message</span>
                    <span className="font-medium text-right">{formatDate(enquiry.lastMessageAt)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-right">{formatDate(enquiry.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Listing & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Listing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <Link to={`/admin/listings/${enquiry.listingId}`} className="text-lg font-semibold hover:underline text-primary">
                      {enquiry.listingTitle}
                    </Link>
                    <span className="text-sm text-muted-foreground">ID: {enquiry.listingId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {formatPrice(enquiry.listingValue, enquiry.currency)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <AdminEnquiryNdaBadge hasNda={enquiry.hasNda} status={enquiry.ndaStatus} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Initial Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap text-foreground/90 italic">
                  "{enquiry.message}"
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {enquiry.activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p>No admin activity recorded for this enquiry.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enquiry.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        {index !== enquiry.activities.length - 1 && (
                          <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-border" />
                        )}
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col pb-6">
                          <span className="font-medium text-sm capitalize">{activity.type.replace('_', ' ')}</span>
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
