import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { SellerProfileHeader } from '@/components/seller/profile/SellerProfileHeader';
import { SellerProfileCompletion } from '@/components/seller/profile/SellerProfileCompletion';
import { SellerContactInformationCard } from '@/components/seller/profile/SellerContactInformationCard';
import { SellerBusinessInformationCard } from '@/components/seller/profile/SellerBusinessInformationCard';
import { SellerSocialLinksCard } from '@/components/seller/profile/SellerSocialLinksCard';

export default function SellerProfile() {
  const { profile } = useSellerStore();

  return (
    <>
      <Seo title="My Profile - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-12">
        <SellerProfileHeader profile={profile} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SellerBusinessInformationCard profile={profile} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <SellerProfileCompletion profile={profile} />
            <SellerContactInformationCard profile={profile} />
            <SellerSocialLinksCard profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
