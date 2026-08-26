import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useBuyerStore } from '@/store/useBuyerStore';

export function ContactInformationCard() {
  const { profile } = useBuyerStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-muted-foreground truncate">{profile.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground truncate">{profile.location || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
