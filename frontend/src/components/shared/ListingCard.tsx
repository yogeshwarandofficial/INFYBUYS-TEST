import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, DollarSign, Eye, MessageSquare } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

export type ListingCardVariant = 'featured' | 'latest' | 'premium' | 'similar' | 'compact' | 'list';

interface ListingCardProps {
  listing: any;
  variant?: ListingCardVariant;
  className?: string;
  showFavoriteButton?: boolean;
  topRightAction?: ReactNode; // e.g. for Seller 3-dot menu
  bottomAction?: ReactNode; // to override View Details
  showPerformance?: boolean; // views / enquiries
  isSeller?: boolean; // adjust routing or UI slightly if it's seller portal
}

const formatPrice = (price: any) => {
  if (price == null || price === '') return '-';
  const num = Number(price);
  if (isNaN(num)) return '-';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num}`;
};

export function ListingCard({
  listing,
  variant = 'latest',
  className,
  showFavoriteButton = true,
  topRightAction,
  bottomAction,
  showPerformance = false,
  isSeller = false
}: ListingCardProps) {
  const isList = variant === 'list';
  const navigate = useNavigate();

  const priceVal = listing.priceOrRent != null ? listing.priceOrRent : listing.askingPrice;
  const revVal = listing.turnover != null ? listing.turnover : (listing.revenue != null ? listing.revenue : listing.netProfit);
  const statusStr = listing.status;

  const renderStatus = () => {
    if (statusStr === 'SOLD_LET' || statusStr === 'sold') {
      return (
        <div className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
          SOLD
        </div>
      );
    }
    if (statusStr === 'PENDING' || statusStr === 'pending' || statusStr === 'PENDING_REVIEW' || statusStr === 'CHANGES_PENDING_REVIEW') {
      return (
        <div className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          PENDING
        </div>
      );
    }
    if (statusStr === 'DRAFT' || statusStr === 'draft') {
      return (
        <div className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
          DRAFT
        </div>
      );
    }
    // Default Active
    return (
      <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
        ACTIVE
      </div>
    );
  };

  const renderImage = () => {
    const coverMedia = listing.media?.find((m: any) => m.id === listing.coverMediaId);
    const firstPhoto = listing.media?.find((m: any) => m.type === 'PHOTO');
    const heroUrl = coverMedia?.url || firstPhoto?.url || listing.image;

    if (heroUrl) {
      return (
        <img src={heroUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      );
    }
    return (
      <div className="w-full h-full bg-[#F6F8FC] flex items-center justify-center">
        <DollarSign className="w-8 h-8 text-[#94A3B8]" />
      </div>
    );
  };

  const handleNavigate = () => {
    if (isSeller) {
      navigate(`/seller/listings/${listing.id}`);
    } else {
      navigate(`/listing/${listing.id}`);
    }
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white border border-slate-300 group flex flex-col h-full rounded-xl', className)}>
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {renderImage()}
        
        {/* Top Left: Status */}
        <div className="absolute top-3 left-3 z-10">
          {renderStatus()}
        </div>

        {/* Top Right: Actions */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {showFavoriteButton && !isSeller && (
            <FavoriteButton listingId={listing.id} />
          )}
          {topRightAction}
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-[18px] leading-tight truncate text-[#111827] group-hover:text-[#0B4C8C] transition-colors mb-1.5" title={listing.title}>
          {listing.title}
        </h3>
        <p className="text-[14px] text-[#64748B] flex items-center gap-1.5 mb-5 truncate">
          <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" /> {listing.location || 'Location upon request'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-[#64748B]">Asking Price</p>
            <p className="font-semibold text-base text-[#111827]">{formatPrice(priceVal)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-[#64748B]">Revenue</p>
            <p className="font-semibold text-base text-[#111827]">{formatPrice(revVal)}</p>
          </div>
        </div>

        {!isList && listing.description && (
          <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed mb-4">
            {listing.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-end border-t border-slate-200">
          {bottomAction ? bottomAction : (
            <Button
              size="sm"
              variant="ghost"
              className="text-[14px] font-medium text-[#0B4C8C] hover:text-[#0B152A] hover:bg-transparent h-auto p-0 flex items-center gap-1.5"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate();
              }}
            >
              View <span className="text-lg leading-none">&rarr;</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
