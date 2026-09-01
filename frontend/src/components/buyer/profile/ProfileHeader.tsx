import { Building2, MapPin, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuyerStore } from '@/store/useBuyerStore';

interface ProfileHeaderProps {
  onEdit: () => void;
  onPreview: () => void;
}

export function ProfileHeader({ onEdit, onPreview }: ProfileHeaderProps) {
  const { profile } = useBuyerStore();

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {/* Cover Image Placeholder */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 w-full"></div>

      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-12 sm:-mt-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">{profile.fullName.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                <Badge variant="secondary">{profile.buyerType}</Badge>
              </div>
              <p className="text-muted-foreground font-medium">{profile.jobTitle}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {profile.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-4">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
