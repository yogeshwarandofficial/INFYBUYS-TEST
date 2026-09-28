import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { SellerListingForm, type ListingFormValues } from '@/components/seller/listings/SellerListingForm';
import { useSellerStore } from '@/store/useSellerStore';
import { ChevronLeft } from 'lucide-react';

export default function SellerCreateListing() {
  const navigate = useNavigate();
  const { createListing, uploadListingMedia, submitListing } = useSellerStore();

  const toNum = (v?: string) => (v && !isNaN(parseFloat(v)) ? parseFloat(v) : undefined);
  const toInt = (v?: string) => (v && !isNaN(parseInt(v, 10)) ? parseInt(v, 10) : undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveDraft = async (values: ListingFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      let id = createdId;
      if (!id) {
        id = await createListing({
          title: values.title.trim(),
          category: values.category === 'Other' && values.customCategory ? values.customCategory.trim() : values.category,
          subCategory: values.subCategory?.trim() || undefined,
          location: values.location.trim(),
          description: values.description.trim(),
          askingPrice: toNum(values.askingPrice) || 0,
          revenue: toNum(values.revenue),
          profit: toNum(values.profit),
          establishedYear: toInt(values.establishedYear),
          employees: toInt(values.employees),
          contactName: values.contactName.trim(),
          contactEmail: values.contactEmail.trim(),
          contactPhone: values.contactPhone?.trim() || undefined,
          ndaRequired: values.ndaRequired || false,
          image: undefined,
          status: 'draft',
        });
        setCreatedId(id);
      }

      // Handle media uploads if staged
      if (Array.isArray(values.image)) {
        for (const file of values.image) {
          if (file instanceof File) {
            const type = file.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
            await uploadListingMedia(id, file, type);
          }
        }
      } else if (values.image instanceof File) {
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
          title: values.title.trim(),
          category: values.category === 'Other' && values.customCategory ? values.customCategory.trim() : values.category,
          subCategory: values.subCategory?.trim() || undefined,
          location: values.location.trim(),
          description: values.description.trim(),
          askingPrice: toNum(values.askingPrice) || 0,
          revenue: toNum(values.revenue),
          profit: toNum(values.profit),
          establishedYear: toInt(values.establishedYear),
          employees: toInt(values.employees),
          contactName: values.contactName.trim(),
          contactEmail: values.contactEmail.trim(),
          contactPhone: values.contactPhone?.trim() || undefined,
          ndaRequired: values.ndaRequired || false,
          image: undefined,
          status: 'pending',
        });
        setCreatedId(id);
      }

      // Upload media
      if (Array.isArray(values.image)) {
        for (const file of values.image) {
          if (file instanceof File) {
            const type = file.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
            await uploadListingMedia(id, file, type);
          }
        }
      } else if (values.image instanceof File) {
        const type = values.image.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        await uploadListingMedia(id, values.image, type);
      }

      // Submit listing for approval
      await submitListing(id);

      // Show Cinematic Success Modal
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Failed to submit listing:', error);
      alert(`Failed to submit listing: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/seller/listings');
  };

  return (
    <>
      <Seo title="Create Listing | InfyBuys Seller" description="Create a new business listing on InfyBuys." />

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-4 pb-20 space-y-6">
        {/* Page Title Header */}
        <div className="flex items-start gap-4 mb-2 animate-slide-up">
          <Link
            to="/seller/listings"
            className="mt-1 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm shrink-0"
            aria-label="Back to listings"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Create New Listing
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the details below to list your business for sale.
            </p>
          </div>
        </div>

        {/* The Listing Form */}
        <div className="animate-slide-up delay-100">
          <SellerListingForm
            isLoading={isSaving}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            submitLabel="Submit for Review"
          />
        </div>
      </div>

      {/* Cinematic Fullscreen Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl z-10 flex flex-col items-center text-center animate-pop-in border border-slate-100">
            {/* Animated Checkmark Circle */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="checkmark-path animate-draw-check" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">Listing Submitted</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Your business listing has been successfully submitted and is under review. You will be notified once approved.
            </p>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow active:scale-[0.99] transition-all cursor-pointer"
            >
              View My Listings
            </button>
          </div>
        </div>
      )}
    </>
  );
}
