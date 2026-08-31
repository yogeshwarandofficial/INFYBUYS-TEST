import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { SellerListingForm, type ListingFormValues } from '@/components/seller/listings/SellerListingForm';
import { useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function SellerCreateListing() {
  const navigate = useNavigate();
  const { createListing, uploadListingMedia } = useSellerStore();

  const toNum = (v?: string) => (v ? parseFloat(v) || undefined : undefined);
  const toInt = (v?: string) => (v ? parseInt(v) || undefined : undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const handleSaveDraft = async (values: ListingFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Use stored ID if it was already created but didn't navigate yet
      let id = createdId;
      if (!id) {
        id = await createListing({
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
        image: undefined, // Handled separately
        status: 'draft',
      });
      setCreatedId(id);
    }

    if (values.image instanceof File) {
        const type = values.image.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        await uploadListingMedia(id, values.image, type);
      }

      navigate(`/seller/listings/${id}/edit`);
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      alert(`Failed to save draft: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (values: ListingFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      let id = createdId;
      if (!id) {
        id = await createListing({
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
        image: undefined, // Handled separately
        status: 'pending',
      });
      setCreatedId(id);
    }

    if (values.image instanceof File) {
        const type = values.image.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        await uploadListingMedia(id, values.image, type);
      }

      await useSellerStore.getState().submitListing(id);

      navigate(`/seller/listings/${id}`);
    } catch (error: any) {
      console.error('Failed to submit listing:', error);
      if (error?.response?.data?.code === 'KYC_REQUIRED' || error?.message?.includes('KYC')) {
        alert('KYC verification required\n\nYou need to complete business verification before submitting this listing.');
        navigate('/seller/kyc');
        return;
      }
      alert(`Failed to submit: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Seo title="Create Listing" description="Create a new business listing on InfyBuys." />

      <div className="p-4 sm:p-6 max-w-3xl mx-auto pb-12 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back to listings">
            <Link to="/seller/listings">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Listing</h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details below to list your business for sale.
            </p>
          </div>
        </div>

        <SellerListingForm
          isLoading={isSaving}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          submitLabel="Submit for Review"
        />
      </div>
    </>
  );
}
