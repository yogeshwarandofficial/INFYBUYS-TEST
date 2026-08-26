import { type SellerProfile } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Building } from 'lucide-react';

interface SellerContactInformationCardProps {
  profile: SellerProfile;
}

export function SellerContactInformationCard({ profile }: SellerContactInformationCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">{profile.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{profile.location || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Company</p>
            <p className="text-sm text-muted-foreground">{profile.companyName || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
