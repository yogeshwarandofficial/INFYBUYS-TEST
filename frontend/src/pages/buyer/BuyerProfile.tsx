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
import { useBuyerStore } from '@/store/useBuyerStore';

export default function BuyerProfile() {
  const { profile } = useBuyerStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  return (
    <>
      <Seo title="Buyer Profile" description="Manage your public buyer profile." />

      <div className="w-full space-y-8">
        <BuyerPageHeader
          title="My Profile"
          description="Manage your professional information, contact details, and investment criteria."
          breadcrumbs={[{ label: 'Profile' }]}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileHeader
              onEdit={() => setIsEditDialogOpen(true)}
              onPreview={() => setIsPreviewDialogOpen(true)}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bio & Investment Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {profile.bio || 'No bio provided. Update your profile to add investment criteria.'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
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
