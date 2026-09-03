import { type SellerProfile } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ShieldCheck, Clock } from 'lucide-react';

interface SellerAccountStatusCardProps {
  profile: SellerProfile;
}

export function SellerAccountStatusCard({ profile }: SellerAccountStatusCardProps) {
  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Account Status</CardTitle>
        <CardDescription className="text-[#64748B]">Your current seller account information and status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between p-4 bg-white/60 border border-[#E5E9F2] shadow-sm rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><User className="w-5 h-5 text-[#94A3B8]" /></div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">Account Type</p>
              <p className="text-[13px] text-[#64748B] capitalize mt-0.5">{profile.sellerType}</p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]">Standard</Badge>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/60 border border-[#E5E9F2] shadow-sm rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">Verification Status</p>
              <p className="text-[13px] text-[#64748B] mt-0.5">Identity verified</p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100/50 rounded-full px-3">Verified</Badge>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/60 border border-[#E5E9F2] shadow-sm rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-[#94A3B8]" /></div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">Member Since</p>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
