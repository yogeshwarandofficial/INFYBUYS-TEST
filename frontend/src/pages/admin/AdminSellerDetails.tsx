import { useParams, useNavigate } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { AdminSellerStatusBadge } from '../../components/admin/sellers/AdminSellerStatusBadge';
import { AdminSellerActions } from '../../components/admin/sellers/AdminSellerActions';
import { ArrowLeft, Mail, MapPin, Store, Building2, Eye, MessageSquare, Briefcase, Package, History } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';

export default function AdminSellerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const seller = useAdminStore((state) => state.sellers.find(s => s.id === id));

  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Seller Not Found" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Sellers', href: '/admin/sellers' }, { label: 'Not Found' }]} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title="Seller not found"
            description="The seller you're looking for doesn't exist or has been deleted."
            actionLabel="Back to Sellers"
            onAction={() => navigate('/admin/sellers')}
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/sellers')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to sellers</span>
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{seller.companyName}</h1>
                <AdminSellerStatusBadge status={seller.status} />
              </div>
              <span className="text-sm text-muted-foreground">{seller.sellerType}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminSellerActions seller={seller} />
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
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback className="text-2xl">{getInitials(seller.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{seller.name}</h2>
                    <p className="text-muted-foreground">{seller.companyName}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {seller.emailVerified && <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-medium">Email Verified</span>}
                    {seller.phoneVerified && <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-medium">Phone Verified</span>}
                    {seller.businessVerified && <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 font-medium">Business Verified</span>}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{seller.email}</span>
                  </div>
                  {seller.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{seller.phone}</span>
                    </div>
                  )}
                  {seller.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Experience: {seller.experience || 'Not specified'}</span>
                  </div>
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
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-right">{formatDate(seller.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-right">{formatDate(seller.updatedAt)}</span>
                </div>
                {seller.lastActiveAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium text-right">{formatDate(seller.lastActiveAt)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profile Completed</span>
                  <span className="font-medium">{seller.profileCompleted ? 'Yes' : 'No'}</span>
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
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{seller.listingCount}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Total Listings</p>
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">{seller.activeListingCount} Active</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{seller.totalViews > 1000 ? `${(seller.totalViews / 1000).toFixed(1)}k` : seller.totalViews}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Total Views</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold">{seller.enquiryCount}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Total Enquiries</p>
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">{seller.unreadMessageCount} Unread</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold text-primary">
                      ${seller.totalRevenue > 1000 ? `${(seller.totalRevenue / 1000).toFixed(1)}k` : seller.totalRevenue}
                    </h4>
                    <p className="text-xs text-primary/80 font-medium">Total Revenue</p>
                  </div>
                  <div className="text-xs text-primary/70 font-medium mt-1">{seller.soldListingCount} Sold Items</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {seller.activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p>No admin activity recorded for this seller.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {seller.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        {index !== seller.activities.length - 1 && (
                          <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-border" />
                        )}
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col pb-6">
                          <span className="font-medium text-sm">{activity.action}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
                          {activity.details && (
                            <p className="text-sm mt-1 text-muted-foreground">{activity.details}</p>
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
