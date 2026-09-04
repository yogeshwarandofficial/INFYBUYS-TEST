import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Link } from 'lucide-react';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';

export function SocialLinksCard() {
  const { data: profile } = useBuyerProfile();

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Web & Social</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Website</p>
            {profile.website ? (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 flex items-center justify-center shrink-0">
            <Link className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">LinkedIn</p>
            {profile.linkedin ? (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
