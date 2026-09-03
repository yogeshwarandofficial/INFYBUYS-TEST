import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { SellerListingForm, type ListingFormValues } from '@/components/seller/listings/SellerListingForm';
import { useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function SellerEditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, updateListing, submitListing } = useSellerStore();

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
          </div>
        </div>

        <SellerListingForm
          defaultValues={{
            title: listing.title,
            category: listing.category,
            subCategory: listing.subCategory,
            location: listing.location,
            description: listing.description,
            askingPrice: listing.askingPrice.toString(),
            revenue: listing.revenue?.toString(),
            profit: listing.profit?.toString(),
            establishedYear: listing.establishedYear?.toString(),
            employees: listing.employees?.toString(),
            contactName: listing.contactName,
            contactEmail: listing.contactEmail,
            contactPhone: listing.contactPhone,
            ndaRequired: listing.ndaRequired,
            image: '', // Reset image field as we now show uploaded media separately
          }}
          listingId={listing.id}
          media={listing.media}
          coverMediaId={listing.coverMediaId}
          isLoading={isSaving}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          submitLabel={listing.status === 'draft' ? 'Submit for Review' : 'Save Changes'}
        />
      </div>
    </>
  );
}
