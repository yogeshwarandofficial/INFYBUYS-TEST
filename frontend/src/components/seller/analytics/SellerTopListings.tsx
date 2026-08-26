import { type SellerListingPerformance } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router';
import { Trophy, TrendingUp, ExternalLink } from 'lucide-react';

interface SellerTopListingsProps {
  listings: SellerListingPerformance[];
}

export function SellerTopListings({ listings }: SellerTopListingsProps) {
  if (listings.length === 0) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <CardTitle className="text-lg">Top Performing Listings</CardTitle>
        </div>
        <CardDescription>Your best listings by conversion rate.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <Link
                    to={`/seller/listings/${listing.id}`}
                    className="font-medium text-sm text-foreground hover:text-primary hover:underline flex items-center gap-1.5 truncate"
                  >
                    {listing.title}
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {listing.views.toLocaleString()} views &middot; {listing.enquiries.toLocaleString()} enquiries
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  {listing.conversionRate.toFixed(1)}%
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-medium">
                  Conversion
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
