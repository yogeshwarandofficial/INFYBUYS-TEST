import { type SellerProfile } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ShieldCheck, Clock } from 'lucide-react';

interface SellerAccountStatusCardProps {
  profile: SellerProfile;
}

export function SellerAccountStatusCard({ profile }: SellerAccountStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Status</CardTitle>
        <CardDescription>Your current seller account information and status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm text-muted-foreground capitalize">{profile.sellerType}</p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">Standard</Badge>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-medium">Verification Status</p>
              <p className="text-sm text-muted-foreground">Identity verified</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Verified</Badge>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
