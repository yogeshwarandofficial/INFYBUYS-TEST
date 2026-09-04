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
    <Card className="h-full flex flex-col overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <CardTitle className="text-lg text-[#111827]">Top Performing Listings</CardTitle>
        </div>
        <CardDescription className="text-[#64748B]">Your best listings by views and enquiries.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="flex items-center justify-between p-3 rounded-xl border border-[#E5E9F2] bg-white/60 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                <div className="w-8 h-8 rounded-full bg-[#F6F8FC] text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <Link
                    to={`/seller/listings/${listing.id}`}
                    className="font-medium text-[15px] text-[#111827] hover:text-[#2563EB] hover:underline flex items-center gap-1.5 truncate"
                  >
                    {listing.title}
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </Link>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    {listing.views.toLocaleString()} views &middot; {listing.enquiries.toLocaleString()} enquiries
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm justify-end">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  Top
                </div>
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-medium">
                  Performing
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
