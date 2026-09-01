import { type SellerProfile } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SellerBusinessInformationCardProps {
  profile: SellerProfile;
}

export function SellerBusinessInformationCard({ profile }: SellerBusinessInformationCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Business Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Seller Type</p>
            <p className="text-sm font-medium capitalize mt-1">{profile.sellerType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Experience</p>
            <p className="text-sm font-medium mt-1">{profile.yearsOfExperience || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Job Title</p>
            <p className="text-sm font-medium mt-1">{profile.jobTitle || 'Not specified'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Preferred Categories</p>
          <div className="flex flex-wrap gap-2">
            {profile.preferredCategories.length > 0 ? (
              profile.preferredCategories.map((cat) => (
                <Badge key={cat} variant="secondary">{cat}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Preferred Locations</p>
          <div className="flex flex-wrap gap-2">
            {profile.preferredLocations.length > 0 ? (
              profile.preferredLocations.map((loc) => (
                <Badge key={loc} variant="outline">{loc}</Badge>
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
