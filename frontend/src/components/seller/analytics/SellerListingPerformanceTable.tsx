import { type SellerListingPerformance } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SellerListingPerformanceTableProps {
  performance: SellerListingPerformance[];
}

export function SellerListingPerformanceTable({ performance }: SellerListingPerformanceTableProps) {
  if (performance.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Listing Performance</CardTitle>
        <CardDescription>Detailed metrics for all your listings in the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium rounded-tl-md rounded-bl-md">Listing</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Views</th>
                <th className="px-4 py-3 font-medium text-right">Enquiries</th>
                <th className="px-4 py-3 font-medium text-right">Conversion</th>
                <th className="px-4 py-3 font-medium text-center rounded-tr-md rounded-br-md">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {performance.map((listing) => (
                <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/seller/listings/${listing.id}`}
                      className="font-medium text-primary hover:underline flex items-center gap-1.5 w-max max-w-[200px] sm:max-w-[300px] truncate"
                    >
                      {listing.title}
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {listing.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {listing.enquiries.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {listing.conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
                        listing.performanceIndicator === 'excellent' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                        listing.performanceIndicator === 'good' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                        listing.performanceIndicator === 'average' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        listing.performanceIndicator === 'poor' && 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      )}
                    >
                      {listing.performanceIndicator}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
