import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function RecentlyViewed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No recently viewed listings.</p>
      </CardContent>
    </Card>
  );
}
