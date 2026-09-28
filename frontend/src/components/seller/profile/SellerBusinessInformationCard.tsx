import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus } from 'lucide-react';

interface SellerBusinessInformationCardProps {
  profile: SellerProfile;
}

export function SellerBusinessInformationCard({ profile }: SellerBusinessInformationCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
          Business Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        {/* Group 1 */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Seller Type</p>
          <p className="text-[15px] font-bold text-slate-900 capitalize">{profile.sellerType}</p>
        </div>
        
        {/* Group 2 */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Experience</p>
          {profile.yearsOfExperience ? (
            <p className="text-[15px] font-bold text-slate-900">{profile.yearsOfExperience}</p>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-xs font-medium text-slate-500 border-dashed">
              <Plus className="w-3 h-3" /> Not specified
            </div>
          )}
        </div>
        
        {/* Group 3 */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Job Title</p>
          {profile.jobTitle ? (
            <p className="text-[15px] font-bold text-slate-900">{profile.jobTitle}</p>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-xs font-medium text-slate-500 border-dashed">
              <Plus className="w-3 h-3" /> Not specified
            </div>
          )}
        </div>
        
        {/* Group 4 */}
        <div className="md:col-span-2 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-3">Preferred Categories</p>
          <div className="flex flex-wrap items-center gap-2">
            {profile.preferredCategories.length > 0 ? (
              profile.preferredCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700">{cat}</Badge>
              ))
            ) : (
              <button className="px-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Categories
              </button>
            )}
          </div>
        </div>
        
        {/* Group 5 */}
        <div className="md:col-span-2 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-3">Preferred Locations</p>
          <div className="flex flex-wrap items-center gap-2">
            {profile.preferredLocations.length > 0 ? (
              profile.preferredLocations.map((loc) => (
                <Badge key={loc} variant="outline" className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700">{loc}</Badge>
              ))
            ) : (
              <button className="px-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Locations
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
