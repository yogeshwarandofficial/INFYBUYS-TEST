import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function RecentlyViewed() {
  return (
    <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-[#111827]">Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No recently viewed listings.</p>
      </CardContent>
    </Card>
  );
}
