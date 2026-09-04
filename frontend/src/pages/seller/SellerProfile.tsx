import { Seo } from '@/components/shared/Seo';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { SellerProfileHeader } from '@/components/seller/profile/SellerProfileHeader';
import { SellerProfileCompletion } from '@/components/seller/profile/SellerProfileCompletion';
import { SellerContactInformationCard } from '@/components/seller/profile/SellerContactInformationCard';
import { SellerBusinessInformationCard } from '@/components/seller/profile/SellerBusinessInformationCard';
import { SellerSocialLinksCard } from '@/components/seller/profile/SellerSocialLinksCard';

export default function SellerProfile() {
  const { data: profile, isLoading, error } = useSellerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-xl font-semibold mb-2">Failed to load profile</h2>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="My Profile - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <SellerProfileHeader profile={profile} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <SellerBusinessInformationCard profile={profile} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SellerProfileCompletion profile={profile} />
            <SellerContactInformationCard profile={profile} />
            <SellerSocialLinksCard profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
