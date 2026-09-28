import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { BuyerPageHeader } from '@/components/buyer/BuyerPageHeader';
import { ProfileHeader } from '@/components/buyer/profile/ProfileHeader';
import { ProfileCompletion } from '@/components/buyer/profile/ProfileCompletion';
import { ContactInformationCard } from '@/components/buyer/profile/ContactInformationCard';
import { SocialLinksCard } from '@/components/buyer/profile/SocialLinksCard';
import { EditProfileDialog } from '@/components/buyer/profile/EditProfileDialog';
import { ProfilePreviewDialog } from '@/components/buyer/profile/ProfilePreviewDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';
import { Loader2 } from 'lucide-react';

export default function BuyerProfile() {
  const { data: profile, isLoading, error } = useBuyerProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-64 text-destructive">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <>
      <Seo title="Buyer Profile" description="Manage your public buyer profile." />

      <div className="w-full space-y-8">
        <BuyerPageHeader
          title="My Profile"
          description="Manage your professional information, contact details, and investment criteria."
          breadcrumbs={[{ label: 'Profile' }]}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1 space-y-8 min-w-0">
            <ProfileHeader
              onEdit={() => setIsEditDialogOpen(true)}
              onPreview={() => setIsPreviewDialogOpen(true)}
            />

            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Bio & Investment Criteria</h2>
              <div className="text-[15px] text-slate-600 leading-relaxed">
                {profile.bio && profile.bio.trim() !== '' && !profile.bio.startsWith('Lorem ipsum') && !profile.bio.includes('gibberish') ? (
                  profile.bio
                ) : (
                  <div className="text-slate-400 italic">No bio provided. Update your profile to add investment criteria and let sellers know what you are looking for.</div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0 space-y-8">
            <ProfileCompletion />
            <ContactInformationCard />
            <SocialLinksCard />
          </div>
        </div>
      </div>

      <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <ProfilePreviewDialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen} />
    </>
  );
}
