import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { SellerListingForm, type ListingFormValues } from '@/components/seller/listings/SellerListingForm';
import { useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

export default function SellerEditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, updateListing, submitListing } = useSellerStore();

  const listing = listings.find((l) => l.id === id);
  const [revisionData, setRevisionData] = useState<any>(null);
  const [isLoadingRevision, setIsLoadingRevision] = useState(false);

  useEffect(() => {
    if (listing && ['changes_pending_review', 'rejected_changes'].includes(listing.status)) {
      setIsLoadingRevision(true);
      apiClient.get(`/listings/${listing.id}/revision`)
        .then((data: any) => {
          setRevisionData(data);
        })
        .catch(console.error)
        .finally(() => setIsLoadingRevision(false));
    }
  }, [listing]);

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

  const toNum = (v?: string) => (v ? parseFloat(v) || undefined : undefined);
  const toInt = (v?: string) => (v ? parseInt(v) || undefined : undefined);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async (values: ListingFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateListing(listing.id, {
        title: values.title,
        category: values.category,
        subCategory: values.subCategory || undefined,
        location: values.location,
        description: values.description,
        askingPrice: toNum(values.askingPrice) || 0,
        revenue: toNum(values.revenue),
        profit: toNum(values.profit),
        establishedYear: toInt(values.establishedYear),
        employees: toInt(values.employees),
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        ndaRequired: values.ndaRequired,
        image: typeof values.image === 'string' ? values.image : undefined,
        status: listing.status === 'active' ? 'active' : 'draft',
      });

      if (values.image instanceof File) {
        const type = values.image.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        await useSellerStore.getState().uploadListingMedia(listing.id, values.image, type);
      }

      navigate('/seller/listings');
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      alert(`Failed to save: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (values: ListingFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateListing(listing.id, {
        title: values.title,
        category: values.category,
        subCategory: values.subCategory || undefined,
        location: values.location,
        description: values.description,
        askingPrice: toNum(values.askingPrice) || 0,
        revenue: toNum(values.revenue),
        profit: toNum(values.profit),
        establishedYear: toInt(values.establishedYear),
        employees: toInt(values.employees),
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        ndaRequired: values.ndaRequired,
        image: typeof values.image === 'string' ? values.image : undefined,
      });

      if (values.image instanceof File) {
        const type = values.image.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        await useSellerStore.getState().uploadListingMedia(listing.id, values.image, type);
      }

      if (listing.status === 'draft') {
        await submitListing(listing.id);
      }
      navigate(`/seller/listings/${listing.id}`);
    } catch (error: any) {
      console.error('Failed to submit listing:', error);
      alert(`Failed to save: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Seo title={`Edit: ${listing.title}`} description="Edit your business listing." />

      <div className="p-4 sm:p-6 max-w-3xl mx-auto pb-12 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back to listings">
            <Link to="/seller/listings">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Listing</h1>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{listing.title}</p>
            {listing.status === 'changes_pending_review' && <p className="text-xs text-orange-500 font-medium">Changes pending admin review</p>}
            {listing.status === 'rejected_changes' && <p className="text-xs text-red-500 font-medium">Your proposed changes were rejected</p>}
          </div>
        </div>

        {isLoadingRevision ? (
          <div className="p-8 text-center text-muted-foreground">Loading pending changes...</div>
        ) : (
          <SellerListingForm
            defaultValues={{
              title: revisionData?.proposedData?.title ?? listing.title,
              category: revisionData?.proposedData?.category ?? listing.category,
              subCategory: revisionData?.proposedData?.subCategory ?? listing.subCategory,
              location: revisionData?.proposedData?.locationArea ?? listing.location,
              description: revisionData?.proposedData?.description ?? listing.description,
              askingPrice: (revisionData?.proposedData?.priceOrRent ?? listing.askingPrice).toString(),
              revenue: (revisionData?.proposedData?.turnover ?? listing.revenue)?.toString(),
              profit: (revisionData?.proposedData?.netProfit ?? listing.profit)?.toString(),
              establishedYear: (revisionData?.proposedData?.establishedYear ?? listing.establishedYear)?.toString(),
              employees: (revisionData?.proposedData?.employees ?? listing.employees)?.toString(),
              contactName: revisionData?.proposedData?.contactName ?? listing.contactName,
              contactEmail: revisionData?.proposedData?.contactEmail ?? listing.contactEmail,
              contactPhone: revisionData?.proposedData?.contactPhone ?? listing.contactPhone,
              ndaRequired: revisionData?.proposedData?.ndaRequired ?? listing.ndaRequired,
              image: '', 
            }}
            listingId={listing.id}
            media={revisionData?.media ? [...(listing.media||[]).filter((m:any) => !(revisionData.proposedData?.proposedMediaDeletions||[]).includes(m.id)), ...revisionData.media] : listing.media}
            coverMediaId={listing.coverMediaId}
          isLoading={isSaving}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          submitLabel={['draft', 'rejected', 'changes_pending_review', 'rejected_changes'].includes(listing.status) ? 'Submit for Review' : 'Save Changes'}
        />
        )}
      </div>
    </>
  );
}
