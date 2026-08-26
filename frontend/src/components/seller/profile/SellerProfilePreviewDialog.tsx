import { type SellerProfile } from '@/store/useSellerStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Link as LinkIcon, Briefcase } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SellerProfilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SellerProfile;
}

export function SellerProfilePreviewDialog({ open, onOpenChange, profile }: SellerProfilePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Profile Preview</DialogTitle>
          <DialogDescription>
            This is how your profile appears to buyers on the platform.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-6 pt-4">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar className="w-24 h-24 border-2 shadow-sm">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {profile.jobTitle} {profile.companyName && `at ${profile.companyName}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {profile.location || 'Location not specified'}
                  </span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {profile.sellerType}
                </Badge>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.bio || 'No bio provided.'}
              </p>
            </div>

            {/* Expertise Section */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Expertise</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredCategories.length > 0 ? (
                        profile.preferredCategories.map(c => <Badge key={c} variant="outline">{c}</Badge>)
                      ) : (
                        <span className="text-sm text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Experience</p>
                    <p className="text-sm font-medium">{profile.yearsOfExperience || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Links</h3>
                <div className="space-y-3">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Globe className="w-4 h-4" />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4" /> Not provided
                    </div>
                  )}
                  {profile.linkedin ? (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#0077b5] hover:underline">
                      <LinkIcon className="w-4 h-4" />
                      LinkedIn Profile
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon className="w-4 h-4" /> Not provided
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
