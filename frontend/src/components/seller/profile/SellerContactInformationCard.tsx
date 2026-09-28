import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

interface SellerContactInformationCardProps {
  profile: SellerProfile;
}

export function SellerContactInformationCard({ profile }: SellerContactInformationCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
      <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Contact Info</h3>
      <ul className="space-y-5">
        <li className="flex items-start gap-4 group">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
            <Mail className="w-4 h-4" />
          </div>
          <div className="overflow-hidden pt-0.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">Email</p>
            <p className="text-[15px] font-bold text-slate-900 break-words">{profile.email}</p>
          </div>
        </li>
        <li className="flex items-start gap-4 group">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all">
            <Phone className="w-4 h-4" />
          </div>
          <div className="pt-0.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">Phone</p>
            {profile.phone ? (
              <p className="text-[15px] font-bold text-slate-900">{profile.phone}</p>
            ) : (
              <p className="text-[15px] font-medium text-slate-400 italic">Not provided</p>
            )}
          </div>
        </li>
        <li className="flex items-start gap-4 group">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500 group-hover:border-purple-100 transition-all">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="pt-0.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">Location</p>
            {profile.location ? (
              <p className="text-[15px] font-bold text-slate-900 break-words">{profile.location}</p>
            ) : (
              <p className="text-[15px] font-medium text-slate-400 italic">Not provided</p>
            )}
          </div>
        </li>
        <li className="flex items-start gap-4 group">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="pt-0.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">Company</p>
            {profile.companyName ? (
              <p className="text-[15px] font-bold text-slate-900 break-words">{profile.companyName}</p>
            ) : (
              <p className="text-[15px] font-medium text-slate-400 italic">Not provided</p>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
