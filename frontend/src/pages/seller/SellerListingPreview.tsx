import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { SellerListingStatusBadge } from '@/components/seller/listings/SellerListingStatusBadge';
import { DeleteListingDialog } from '@/components/seller/listings/DeleteListingDialog';
import { ArchiveListingDialog } from '@/components/seller/listings/ArchiveListingDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Users,
  Eye,
  MessageSquare,
  Pencil,
  CheckCircle,
  RotateCcw,
  Archive,
  Trash2,
  Send,
  Copy,
} from 'lucide-react';

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
};

export default function SellerListingPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, submitListing, markListingAsSold, restoreListing, duplicateListing } =
    useSellerStore();

  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Listing not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/seller/listings">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  const handleDuplicate = () => {
    const newId = duplicateListing(listing.id);
    if (newId) navigate(`/seller/listings/${newId}/edit`);
  };

  const handleSubmit = async (listingId: string) => {
    try {
      await submitListing(listingId);
    } catch (error: any) {
      if (error?.response?.data?.code === 'KYC_REQUIRED' || error?.message?.includes('KYC')) {
        alert('KYC verification required\n\nYou need to complete business verification before submitting this listing.');
        navigate('/seller/kyc');
      } else {
        alert(`Failed to submit: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <>
      <Seo title={listing.title} description={listing.description.slice(0, 160)} />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-12 space-y-6">
        {/* Back nav */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back to listings">
            <Link to="/seller/listings">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight truncate">{listing.title}</h1>
              <SellerListingStatusBadge status={listing.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(listing.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2 bg-card p-3 rounded-lg border">
          {(listing.status !== 'sold' && listing.status !== 'archived') && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/seller/listings/${listing.id}/edit`}>
                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Link>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleDuplicate}>
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Duplicate
          </Button>
          {listing.status === 'draft' && (
            <Button size="sm" onClick={() => handleSubmit(listing.id)}>
              <Send className="w-3.5 h-3.5 mr-1.5" /> Submit for Review
            </Button>
          )}
          {listing.status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={() => markListingAsSold(listing.id)}>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Mark as Sold
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowArchive(true)}>
                <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive
              </Button>
            </>
          )}
          {listing.status === 'pending' && (
            <Button size="sm" variant="outline" onClick={() => setShowArchive(true)}>
              <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive
            </Button>
          )}
          {(listing.status === 'sold' || listing.status === 'archived') && (
            <Button size="sm" variant="outline" onClick={() => restoreListing(listing.id)}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Restore as Draft
            </Button>
          )}
          {(listing.status === 'draft' || listing.status === 'archived') && (
            <Button size="sm" variant="destructive" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image */}
            {listing.image && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Key stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Asking Price</span>
                  <span className="font-bold text-primary text-lg">
                    {formatPrice(listing.askingPrice)}
                  </span>
                </div>
                {listing.revenue && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Revenue</span>
                    <span className="font-semibold">{formatPrice(listing.revenue)}</span>
                  </div>
                )}
                {listing.profit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Profit</span>
                    <span className="font-semibold text-emerald-600">{formatPrice(listing.profit)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{listing.category}</Badge>
                </div>
                {listing.subCategory && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sub-Category</span>
                    <span>{listing.subCategory}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {listing.location}
                  </span>
                </div>
                {listing.establishedYear && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Established</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {listing.establishedYear}
                    </span>
                  </div>
                )}
                {listing.employees !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {listing.employees}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Total Views
                  </span>
                  <span className="font-semibold">{listing.views}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Enquiries
                  </span>
                  <span className="font-semibold">{listing.enquiries}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Created</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last Updated</span>
                  <span>{new Date(listing.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
      <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
    </>
  );
}
