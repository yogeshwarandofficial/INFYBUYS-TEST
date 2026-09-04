import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SellerBusinessInformationCardProps {
  profile: SellerProfile;
}

export function SellerBusinessInformationCard({ profile }: SellerBusinessInformationCardProps) {
  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Business Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-[#64748B]">Seller Type</p>
            <p className="text-[15px] font-medium text-[#111827] capitalize mt-1">{profile.sellerType}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#64748B]">Experience</p>
            <p className="text-[15px] font-medium text-[#111827] mt-1">{profile.yearsOfExperience || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#64748B]">Job Title</p>
            <p className="text-[15px] font-medium text-[#111827] mt-1">{profile.jobTitle || 'Not specified'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#64748B]">Preferred Categories</p>
          <div className="flex flex-wrap gap-2">
            {profile.preferredCategories.length > 0 ? (
              profile.preferredCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100/50">{cat}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#64748B]">Preferred Locations</p>
          <div className="flex flex-wrap gap-2">
            {profile.preferredLocations.length > 0 ? (
              profile.preferredLocations.map((loc) => (
                <Badge key={loc} variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100/50">{loc}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
