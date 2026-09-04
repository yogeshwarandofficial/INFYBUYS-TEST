import { useBuyerProfile } from '@/hooks/useBuyerProfile';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, MapPin, Globe, Link, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfilePreviewDialog({ open, onOpenChange }: ProfilePreviewDialogProps) {
  const { data: profile } = useBuyerProfile();

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Profile Preview</DialogTitle>
          <DialogDescription>
            This is how your profile appears to sellers when you send an enquiry or request an NDA.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">{profile.fullName.charAt(0)}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{profile.fullName}</h3>
                  <ShieldCheck className="w-4 h-4 text-primary" aria-label="Verified Buyer" />
                </div>
                <p className="text-sm font-medium">{profile.jobTitle} at {profile.company}</p>
                <Badge variant="outline" className="mt-1">{profile.buyerType}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Overview</h4>

              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">Company</span>
                    <span className="text-muted-foreground">{profile.company}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">Location</span>
                    <span className="text-muted-foreground">{profile.location || 'Not provided'}</span>
                  </div>
                </div>

                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium block">Website</span>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {profile.linkedin && (
                  <div className="flex items-start gap-3">
                    <Link className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium block">LinkedIn</span>
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Bio & Investment Criteria</h4>
              <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                {profile.bio || <span className="italic">No bio provided.</span>}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground text-center">
              Your email and phone number are only shared when you explicitly request an NDA or send an enquiry.
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
