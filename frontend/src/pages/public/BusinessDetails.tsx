import { useEffect, useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { ListingCard } from '@/components/shared/ListingCard';
import { ContactSellerAction } from '@/components/buyer/ContactSellerAction';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/services/apiClient';
import type { Listing } from '@/types/api';
import { useParams, Link, useNavigate } from 'react-router';
import { MapPin, Building2, FileText, CheckCircle2, ShieldCheck, Share2, Lock, Calendar, Briefcase, Flag, ArrowRight, User } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useBuyerStore } from '@/store/useBuyerStore';
import { NDARequestDialog } from '@/components/buyer/nda/NDARequestDialog';
import { SubmitReviewDialog } from '@/components/buyer/reviews/SubmitReviewDialog';


export default function BusinessDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  const { user } = useUserStore();
  const { conversations, createConversation } = useBuyerStore();
  const [ndaDialogOpen, setNdaDialogOpen] = useState(false);
  const [ndaStatus, setNdaStatus] = useState<{ndaRequired: boolean, accepted: boolean} | null>(null);
  const [sellerContact, setSellerContact] = useState<{contactName: string | null, contactEmail: string | null, contactPhone: string | null} | null>(null);
  const [fetchingContact, setFetchingContact] = useState(false);
  const [hasTriedFetchingContact, setHasTriedFetchingContact] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        if (!id) throw new Error('Listing ID is missing');
        const data = await apiClient.get<any>(`/listings/${id}`);
        if (data.media && Array.isArray(data.media)) {
          // Sort by order if available
          data.media.sort((a: any, b: any) => {
            if (data.coverMediaId) {
              if (a.id === data.coverMediaId) return -1;
              if (b.id === data.coverMediaId) return 1;
            }
            return (a.order || 0) - (b.order || 0);
          });

          // For backwards compatibility in other places, map photos to images
          data.images = data.media.filter((m: any) => m.type === 'PHOTO').map((m: any) => m.url);
        }
        setListing(data as Listing);

        // Fetch similar listings
        const similarData = await apiClient.get<{ data: Listing[] }>(`/listings?category=${encodeURIComponent(data.category)}`);
        if (similarData.data) {
          setSimilarListings(similarData.data.filter(l => l.id !== data.id).slice(0, 3));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load listing details');
      } finally {
        setIsLoading(false);
      }
    };
    const checkSubAndNda = async () => {
      if (user) {
        try {
          const subRes = await apiClient.get<any>('/subscriptions/me');
          setHasActiveSub(subRes.hasActiveSubscription);
        } catch (e) {
          // ignore
        }

        if (id) {
          try {
            const ndaRes = await apiClient.get<{ndaRequired: boolean, agreement: any}>(`/listings/${id}/nda/status`);
            setNdaStatus({
              ndaRequired: ndaRes.ndaRequired,
              accepted: ndaRes.agreement?.status === 'SIGNED'
            });
          } catch (e) {
            // ignore
          }
        }
      }
    };
    fetchListing();
    checkSubAndNda();
  }, [id, user]);



  const hasAccess = Boolean(
    user &&
    (user.roles?.includes('admin') || user.id === listing?.sellerId ||
      (hasActiveSub && (!listing?.ndaRequired || ndaStatus?.accepted)))
  );

  const fetchContactDetails = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setFetchingContact(true);
      setHasTriedFetchingContact(true);
      const res = await apiClient.get<any>(`/listings/${id}/seller-contact`);
      setSellerContact(res.data?.seller || res.seller || res);
    } catch (e: any) {
      const status = e.status;
      const message = e.message;
      const code = e.code;
      if (code === 'NDA_REQUIRED' || message?.toLowerCase().includes('nda acceptance is required')) {
        setNdaDialogOpen(true);
      } else if (status === 401 || message?.toLowerCase().includes('unauthorized')) {
        navigate('/login');
      } else if (status === 403 || message?.toLowerCase().includes('forbidden')) {
        if (message.toLowerCase().includes('subscription')) {
          navigate(`/buyer/subscription?returnTo=/listing/${id}`);
        } else {
          // If we are auto-fetching for the seller, don't alert to avoid spam
          if (listing && user.id === listing.sellerId) return;
          alert('Access denied: ' + message);
        }
      } else {
        if (listing && user.id === listing.sellerId) return;
        alert(message || 'Failed to fetch contact details');
      }
    } finally {
      setFetchingContact(false);
    }
  };

  useEffect(() => {
    if (listing && user && user.id === listing.sellerId && !sellerContact && !fetchingContact && !hasTriedFetchingContact) {
      fetchContactDetails();
    }
  }, [listing, user, sellerContact, fetchingContact, hasTriedFetchingContact]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (error || !listing) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">{error || 'Listing not found'}</div>;
  }

  const displayContact = (user?.id === listing?.sellerId)
    ? { contactName: (listing as any).contactName, contactEmail: (listing as any).contactEmail, contactPhone: (listing as any).contactPhone }
    : sellerContact;

  return (
    <>
      <Seo
        title={`${listing.title} for sale`}
        description={listing.description}
      />

      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb
            items={[
              { label: 'Browse', href: '/search' },
              { label: listing.category, href: `/category/${listing.category.toLowerCase()}` },
              { label: listing.title }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {listing.category}
              </Badge>
              {listing.isFeatured && (
                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                  Featured
                </Badge>
              )}
              {listing.status === 'SOLD_LET' && (
                <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 tracking-widest px-3 py-1 font-black">
                  SOLD
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.locationArea || 'UK'}</div>
              <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {listing.category}</div>
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Founded {listing.establishedYear || 'N/A'}</div>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
            <div className="text-4xl font-black text-primary mb-4">
              ${(Number(listing.priceOrRent) || 0).toLocaleString()}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <ContactSellerAction
                listingId={listing.id}
                listingTitle={listing.title}
                sellerName={listing.seller?.name || 'Seller'}
              />
              <FavoriteButton 
                listingId={listing.id} 
                className="w-10 h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap"
              />
              <Button variant="outline" size="icon" aria-label="Share this listing"><Share2 className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          {hasAccess && listing.media && listing.media.length > 0 ? (
            <ImageGallery media={listing.media} />
          ) : (
            <div className="bg-muted flex items-center justify-center rounded-xl overflow-hidden aspect-[2/1] border relative">
              {!hasAccess ? (
                 <div className="absolute inset-0 backdrop-blur-md bg-background/30 flex flex-col items-center justify-center text-center p-6">
                    <Lock className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-bold text-lg">Photos Locked</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">Complete NDA requirements or subscribe to view listing photos.</p>
                 </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center">
                  <span className="mb-2 text-lg">No Images Available</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            <section>
              <h2 className="text-2xl font-bold mb-6">Business Overview</h2>
              <div className="prose prose-muted dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{listing.description}</p>
              </div>
              <div className="flex gap-2 mt-6">
                {(listing.tags || []).map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </section>

            {/* Financial Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Financial Highlights</h2>
              <Card className={`bg-muted/30 ${!hasAccess ? 'border-dashed relative overflow-hidden' : ''}`}>

                {!hasAccess && (
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Unlock Detailed Financials</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {listing.ndaRequired ?
                        "Sign a non-disclosure agreement (NDA) and verify your identity to view P&L statements, customer metrics, and traffic data."
                        : "Subscribe to view detailed financial information."}
                    </p>

                    {!user ? (
                      <Button size="lg" asChild>
                        <Link to="/login">Login to Unlock <ArrowRight className="ml-2 w-4 h-4" /></Link>
                      </Button>
                    ) : !user.hasActiveSubscription ? (
                      <Button size="lg" asChild>
                        <Link to={`/buyer/subscription?returnTo=/listing/${id}`}>Subscribe to Unlock <ArrowRight className="ml-2 w-4 h-4" /></Link>
                      </Button>
                    ) : listing.ndaRequired && ndaStatus?.accepted ? (
                      <Button size="lg" variant="secondary" className="group" onClick={fetchContactDetails}>
                        <CheckCircle2 className="mr-2 text-success w-4 h-4" />
                        NDA Accepted (Reveal) <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : listing.ndaRequired ? (
                      <Button size="lg" onClick={() => setNdaDialogOpen(true)}>
                        <FileText className="mr-2 w-4 h-4" /> Sign NDA to Unlock
                      </Button>
                    ) : null}
                  </div>
                )}

                <CardContent className={`p-8 ${!hasAccess ? 'opacity-40 blur-sm pointer-events-none' : ''}`}>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">TTM Revenue (Turnover)</div>
                      <div className="text-3xl font-bold">
                        {hasAccess 
                          ? (listing.turnover != null ? `$${Number(listing.turnover).toLocaleString()}` : 'Not Disclosed')
                          : '$XXX,XXX'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">TTM Profit</div>
                      <div className="text-3xl font-bold text-success">
                        {hasAccess 
                          ? (listing.netProfit != null ? `$${Number(listing.netProfit).toLocaleString()}` : 'Not Disclosed')
                          : '$XXX,XXX'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Key Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                  <span className="text-muted-foreground">Business Model</span>
                  <span className="font-semibold">{listing.category}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                  <span className="text-muted-foreground">Pricing Model</span>
                  <span className="font-semibold">Subscription</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                  <span className="text-muted-foreground">Operations</span>
                  <span className="font-semibold">{'Not available'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                  <span className="text-muted-foreground">Support Required</span>
                  <span className="font-semibold">{'Not available'}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {listing.seller?.name || 'Seller'}
                      {listing.seller?.verified && <CheckCircle2 className="w-4 h-4 text-info" />}
                    </div>

                  </div>
                </div>

                {user?.id === listing.sellerId ? (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm space-y-2 mb-6 border border-primary/20">
                    <div className="font-medium text-primary mb-2 flex justify-between items-center border-b pb-1">
                      <span>Your Contact Details</span>
                      <Badge variant="outline" className="text-xs text-primary/70 border-primary/20 bg-primary/5">Seller View</Badge>
                    </div>
                    {displayContact?.contactName && <div className="flex items-center gap-2 break-all"><User className="w-4 h-4 shrink-0" /> {displayContact.contactName}</div>}
                    {displayContact?.contactEmail && <div className="flex items-center gap-2 break-all"><FileText className="w-4 h-4 shrink-0" /> {displayContact.contactEmail}</div>}
                    {displayContact?.contactPhone && <div className="flex items-center gap-2"><Building2 className="w-4 h-4 shrink-0" /> {displayContact.contactPhone}</div>}
                    {!displayContact?.contactName && !displayContact?.contactEmail && !displayContact?.contactPhone && (
                      <div className="text-muted-foreground italic">Contact details are unavailable for this listing.</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-3 pt-2 border-t text-center">
                      This is how buyers see your details after subscribing and signing the NDA.
                    </div>
                  </div>
                ) : displayContact ? (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm space-y-2 mb-6">
                    <div className="font-medium text-primary mb-2 border-b pb-1">Seller Contact Details</div>
                    {displayContact.contactName && <div className="flex items-center gap-2 break-all"><User className="w-4 h-4 shrink-0" /> {displayContact.contactName}</div>}
                    {displayContact.contactEmail && <div className="flex items-center gap-2 break-all"><FileText className="w-4 h-4 shrink-0" /> {displayContact.contactEmail}</div>}
                    {displayContact.contactPhone && <div className="flex items-center gap-2"><Building2 className="w-4 h-4 shrink-0" /> {displayContact.contactPhone}</div>}
                    {!displayContact.contactName && !displayContact.contactEmail && !displayContact.contactPhone && (
                      <div className="text-muted-foreground italic">Contact details are unavailable for this listing.</div>
                    )}
                  </div>
                ) : !hasActiveSub ? (
                  <div className="mt-4 p-5 bg-muted/30 border border-muted rounded-lg text-center space-y-3 mb-6">
                    <div className="flex justify-center"><Lock className="w-6 h-6 text-muted-foreground" /></div>
                    <div className="text-sm font-medium text-muted-foreground">Contact details are hidden</div>
                    <div className="text-xs text-muted-foreground mb-3">Subscribe to unlock seller contact details</div>
                    <Button className="w-full" onClick={() => navigate(`/buyer/subscription?returnTo=/listing/${id}`)}>
                      Subscribe to Unlock
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full mb-6 border-primary/20 hover:bg-primary/5 text-primary" onClick={fetchContactDetails} disabled={fetchingContact}>
                    {fetchingContact ? 'Loading...' : 'Reveal Contact Details'}
                  </Button>
                )}

                <div className="space-y-3 text-sm mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{listing.seller?.rating ? `⭐ ${listing.seller.rating}/5.0` : 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Deals</span>
                    <span className="font-medium">{listing.seller?.completedDeals ?? 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    {listing.seller?.verified ? (
                      <span className="font-medium flex items-center text-success">
                        <ShieldCheck className="w-4 h-4 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="font-medium">Unverified</span>
                    )}
                  </div>
                </div>

                {user?.id !== listing.sellerId && (
                  <>
                    <Button
                      className="w-full mb-3"
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        if (!user.roles?.some(r => r.toLowerCase() === 'buyer')) {
                          navigate('/unauthorized');
                          return;
                        }

                        const existingConversation = conversations.find(c => c.listingId === listing.id);

                        if (existingConversation) {
                          navigate(`/buyer/messages/${existingConversation.id}`);
                        } else {
                          const newId = createConversation({
                            listingId: listing.id,
                            listingTitle: listing.title,
                            businessName: listing.title,
                            businessImage: listing.images?.[0] || '',
                            sellerName: listing.seller?.name || 'Seller',
                            sellerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller?.name || 'Seller')}`,
                          });
                          navigate(`/buyer/messages/${newId}`);
                        }
                      }}
                    >
                      Message Seller
                    </Button>
                    {user?.roles?.some(r => r.toLowerCase() === 'buyer') && (
                      <SubmitReviewDialog
                        listingId={listing.id}
                        listingTitle={listing.title}
                        sellerId={listing.seller?.name?.toLowerCase().replace(/\s+/g, '-') || 'seller'}
                        sellerName={listing.seller?.name || 'Seller'}
                        trigger={<Button variant="outline" className="w-full mb-3">Leave a Review</Button>}
                      />
                    )}
                  </>
                )}
                <div className="text-center text-xs text-muted-foreground">
                  Response time: Usually within 24 hours
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive">
              <Flag className="w-4 h-4 mr-2" /> Report this listing
            </Button>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-24 border-t pt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Businesses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {similarListings.map(l => (
              <ListingCard key={l.id} listing={l} variant="similar" />
            ))}
          </div>
        </div>
      </div>

      <NDARequestDialog
        open={ndaDialogOpen}
        onOpenChange={setNdaDialogOpen}
        listingId={listing.id}
        onAccepted={() => {
          setNdaStatus({ ndaRequired: true, accepted: true });
          fetchContactDetails();
        }}
      />
    </>
  );
}
