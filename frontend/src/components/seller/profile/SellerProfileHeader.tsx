import { useState } from 'react';
import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { SellerProfilePreviewDialog } from './SellerProfilePreviewDialog';
import { SellerEditProfileDialog } from './SellerEditProfileDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Eye, Pencil, BadgeCheck } from 'lucide-react';

interface SellerProfileHeaderProps {
  profile: SellerProfile;
}

export function SellerProfileHeader({ profile }: SellerProfileHeaderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Animated Cover Banner */}
      <div 
        className="h-32 md:h-40 w-full relative bg-pan" 
        style={{ 
          background: 'linear-gradient(-45deg, #eff6ff, #e0e7ff, #f3e8ff, #f8fafc)',
          backgroundSize: '400% 400%'
        }}
      >
        {/* Abstract overlay patterns for texture */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-6 md:px-8 pb-8 relative">
        {/* Avatar & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 mb-6">
          {/* Avatar */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] bg-white p-1.5 shadow-lg flex-shrink-0 group">
            <div className="w-full h-full rounded-[1.2rem] overflow-hidden bg-slate-100 relative">
              <Avatar className="w-full h-full rounded-[1.2rem] border-0 rounded-none shadow-none">
                <AvatarFallback className="text-4xl bg-slate-100 text-brand-blue font-bold rounded-none">
                  {profile.fullName?.charAt(0) || 'S'}
                </AvatarFallback>
                {profile.avatarUrl && <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
              </Avatar>
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4 text-slate-500" />
              Preview
            </Button>
            <Button 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:shadow-md transition-all shadow-sm"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="w-4 h-4 text-white/90" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Name & Badges */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {profile.fullName}
            <BadgeCheck className="text-blue-500 w-6 h-6 fill-blue-100" />
          </h1>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            {profile.companyName && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" />
                {profile.companyName}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              {profile.location || 'Location not specified'}
            </div>
            {profile.sellerType && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-sm font-bold text-blue-700 uppercase tracking-wider">
                {profile.sellerType}
              </div>
            )}
          </div>

          <p className="mt-4 text-[15px] font-medium text-slate-600 max-w-2xl leading-relaxed">
            {profile.bio && profile.bio.trim() !== '' && !profile.bio.startsWith('Lorem ipsum') && !profile.bio.includes('gibberish') 
              ? profile.bio 
              : 'Add a bio to tell buyers more about yourself, your expertise, and the types of businesses you represent.'}
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
