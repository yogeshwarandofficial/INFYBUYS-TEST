import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Building } from 'lucide-react';

interface SellerContactInformationCardProps {
  profile: SellerProfile;
}

export function SellerContactInformationCard({ profile }: SellerContactInformationCardProps) {
  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-[#94A3B8]" aria-hidden="true" /></div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B]">Email</p>
            <p className="text-[15px] font-medium text-[#111827] mt-0.5">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-[#94A3B8]" aria-hidden="true" /></div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B]">Phone</p>
            <p className="text-[15px] font-medium text-[#111827] mt-0.5">{profile.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-[#94A3B8]" aria-hidden="true" /></div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B]">Location</p>
            <p className="text-[15px] font-medium text-[#111827] mt-0.5">{profile.location || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Building className="w-5 h-5 text-[#94A3B8]" aria-hidden="true" /></div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B]">Company</p>
            <p className="text-[15px] font-medium text-[#111827] mt-0.5">{profile.companyName || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
