import { useState } from 'react';
import { type SellerProfile } from '@/store/useSellerStore';
import { SellerProfilePreviewDialog } from './SellerProfilePreviewDialog';
import { SellerEditProfileDialog } from './SellerEditProfileDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SellerProfileHeaderProps {
  profile: SellerProfile;
}

export function SellerProfileHeader({ profile }: SellerProfileHeaderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
        {/* Cover Photo Area (Mocked with gradient for aesthetics) */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-[#E0E7FF] via-[#EFF6FF] to-white/50 w-full"></div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-end -mt-12 sm:-mt-16 mb-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-sm shrink-0">
              <AvatarFallback className="text-2xl sm:text-4xl bg-[#EFF6FF] text-[#2563EB] font-medium">
                {profile.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">{profile.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[15px] text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {profile.jobTitle} {profile.companyName && `at ${profile.companyName}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {profile.location || 'Location not specified'}
                </span>
                <Badge variant="secondary" className="capitalize bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]">{profile.sellerType}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:mb-2 shrink-0 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none bg-white/60 hover:bg-white border-[#E5E9F2] rounded-xl text-[#111827] shadow-sm" onClick={() => setIsPreviewOpen(true)}>
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                Preview
              </Button>
              <Button className="flex-1 sm:flex-none bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-sm" onClick={() => setIsEditOpen(true)}>
                <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="max-w-3xl mt-4">
            <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {profile.bio || 'Add a bio to tell buyers more about yourself and your expertise.'}
            </p>
          </div>
        </div>
      </div>

      <SellerProfilePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        profile={profile}
      />

      <SellerEditProfileDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </>
  );
}
