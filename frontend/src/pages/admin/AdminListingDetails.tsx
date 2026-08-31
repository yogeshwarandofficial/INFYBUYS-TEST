import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminListingStatusBadge, AdminListingVerificationBadge } from '../../components/admin/listings/AdminListingStatusBadge';
import { AdminListingActions } from '../../components/admin/listings/AdminListingActions';
import { ArrowLeft, MapPin, Building2, History, Tag, DollarSign, Image as ImageIcon, Video } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { apiClient } from '../../services/apiClient';

export default function AdminListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [revision, setRevision] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const data: any = await apiClient.get(`/admin/listings/${id}`);
        setListing(data);
        if (data.status === 'CHANGES_PENDING_REVIEW' || data.status === 'REJECTED_CHANGES') {
          try {
            const revData: any = await apiClient.get(`/admin/listings/${id}/revision`);
            setRevision(revData.revision);
          } catch (e) {
            console.error("Failed to fetch revision", e);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch listing');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Loading Listing..." breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Listings', href: '/admin/listings' }, { label: 'Loading' }]} />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Listing Not Found" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Listings', href: '/admin/listings' }, { label: 'Not Found' }]} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title="Listing not found"
            description={error || "The listing you're looking for doesn't exist or has been deleted."}
            actionLabel="Back to Listings"
            onAction={() => navigate('/admin/listings')}
          />
        </div>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (price === undefined) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(price);
    } catch {
      return `$${price}`;
    }
  };

  // Sort media based on order
  const sortedMedia = [...(listing.media || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const coverMedia = sortedMedia.find(m => m.id === listing.coverMediaId) || sortedMedia[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-muted/10 pb-12">
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/listings')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to listings</span>
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{listing.title}</h1>
                <AdminListingStatusBadge status={listing.status} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">{formatPrice(listing.priceOrRent, listing.currency)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminListingActions listing={listing} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Details & Seller */}
          <div className="lg:col-span-2 space-y-6">

            {revision && (
              <Card className={listing.status === 'REJECTED_CHANGES' ? "border-red-200 bg-red-50/50" : "border-orange-200 bg-orange-50/50"}>
                <CardHeader>
                  <CardTitle className={`text-lg ${listing.status === 'REJECTED_CHANGES' ? 'text-red-700' : 'text-orange-700'}`}>
                    {listing.status === 'REJECTED_CHANGES' ? 'Rejected Changes' : 'Pending Changes Review'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-sm ${listing.status === 'REJECTED_CHANGES' ? 'text-red-800' : 'text-orange-800'}`}>
                    {listing.status === 'REJECTED_CHANGES' 
                      ? 'The seller\'s proposed changes were rejected.'
                      : 'The seller has proposed changes to this listing.'}
                  </p>
                  <div className="bg-white p-4 rounded border text-sm">
                    <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(revision.proposedData, null, 2)}</pre>
                  </div>
                  {listing.status === 'CHANGES_PENDING_REVIEW' && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          apiClient.post(`/admin/listings/${id}/revision/approve`, {}).then(() => window.location.reload());
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white">Approve Changes</Button>
                      <Button 
                        onClick={() => {
                          apiClient.post(`/admin/listings/${id}/revision/reject`, { rejectionReasonCode: 'Rejected by admin' }).then(() => window.location.reload());
                        }}
                        variant="destructive">Reject Changes</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mt-4">
                  <AdminListingVerificationBadge isVerified={listing.isVerified} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Category</p>
                      <p className="text-muted-foreground">{listing.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{listing.locationArea}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Asking Price</p>
                      <p className="text-muted-foreground">{formatPrice(listing.priceOrRent, listing.currency)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Turnover</p>
                      <p className="text-muted-foreground">{formatPrice(listing.turnover, listing.currency)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t mt-4">
                  <p className="font-medium text-sm mb-1">Description</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listing Media</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedMedia.length === 0 ? (
                  <div className="aspect-video w-full rounded-md bg-muted border flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-50 mb-2" />
                    <span>No media uploaded</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cover Media */}
                    {coverMedia && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Cover Media</span>
                        <div className="aspect-video w-full rounded-md overflow-hidden bg-muted border">
                          {coverMedia.type === 'VIDEO' ? (
                            <video src={coverMedia.url} controls className="w-full h-full object-contain bg-black" />
                          ) : (
                            <img src={coverMedia.url} alt="Cover" className="w-full h-full object-contain" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Media Gallery */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">All Media Gallery</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {sortedMedia.map((m, idx) => (
                          <div key={m.id} className="relative aspect-square rounded-md overflow-hidden bg-muted border">
                            {m.type === 'VIDEO' ? (
                              <div className="w-full h-full relative group bg-black">
                                <video src={m.url} className="w-full h-full object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <Video className="w-8 h-8 text-white opacity-80" />
                                </div>
                              </div>
                            ) : (
                              <img src={m.url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                            )}
                            {m.id === listing.coverMediaId && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Fallback to checking nested seller object if available, otherwise root fields */}
                <Link to={`/admin/sellers/${listing.sellerId}`} className="group flex flex-col gap-1 hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                  <span className="font-medium group-hover:underline text-primary">{listing.seller?.name || listing.sellerName || 'Unknown Seller'}</span>
                  {(listing.seller?.companyName || listing.sellerCompany) && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {listing.seller?.companyName || listing.sellerCompany}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground mt-1">ID: {listing.sellerId}</span>
                </Link>
                <div className="text-sm border-t pt-2 mt-2 space-y-1">
                  <p><span className="text-muted-foreground">Contact:</span> {listing.contactName || 'N/A'}</p>
                  <p><span className="text-muted-foreground">Email:</span> {listing.contactEmail || 'N/A'}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {listing.contactPhone || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Listing Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-right">{formatDate(listing.createdAt)}</span>
                </div>
                {listing.publishedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium text-right">{formatDate(listing.publishedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-right">{formatDate(listing.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
