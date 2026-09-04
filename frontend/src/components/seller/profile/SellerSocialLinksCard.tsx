import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerSocialLinksCardProps {
  profile: SellerProfile;
}

export function SellerSocialLinksCard({ profile }: SellerSocialLinksCardProps) {
  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Online Presence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.website ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F6F8FC] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate block max-w-[200px]"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={profile.website} target="_blank" rel="noopener noreferrer">Visit</a>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[#64748B]">
            <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-sm">No website provided</span>
          </div>
        )}

        {profile.linkedin ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0077b5]/10 flex items-center justify-center shrink-0">
                <LinkIcon className="w-4 h-4 text-[#0077b5]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate block max-w-[200px]"
                >
                  {profile.linkedin.split('/').pop() || 'Profile'}
                </a>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">View</a>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[#64748B]">
            <LinkIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-sm">No LinkedIn provided</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
