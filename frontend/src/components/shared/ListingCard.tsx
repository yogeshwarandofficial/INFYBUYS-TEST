import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, DollarSign, Eye, MessageSquare } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';

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
  const location = useLocation();

  const priceVal = listing.priceOrRent != null ? listing.priceOrRent : listing.askingPrice;
  const revVal = listing.turnover != null ? listing.turnover : (listing.revenue != null ? listing.revenue : listing.netProfit);
  const statusStr = listing.status;

  const renderStatus = () => {
    const baseClasses = "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center shadow-sm backdrop-blur-md border";
    
    if (statusStr === 'SOLD_LET' || statusStr === 'sold') {
      return (
        <div className={cn(baseClasses, "bg-white/90 text-red-700 border-red-100")}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2 shadow-[0_0_4px_rgba(220,38,38,0.5)]"></span>
          SOLD
        </div>
      );
    }
    if (statusStr === 'PENDING' || statusStr === 'pending' || statusStr === 'PENDING_REVIEW' || statusStr === 'CHANGES_PENDING_REVIEW') {
      return (
        <div className={cn(baseClasses, "bg-white/90 text-amber-700 border-amber-100")}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shadow-[0_0_4px_rgba(245,158,11,0.5)]"></span>
          PENDING
        </div>
      );
    }
    if (statusStr === 'DRAFT' || statusStr === 'draft') {
      return (
        <div className={cn(baseClasses, "bg-white/90 text-gray-700 border-gray-200")}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2"></span>
          DRAFT
        </div>
      );
    }
    // Default Active
    return (
      <div className={cn(baseClasses, "bg-white/90 text-emerald-700 border-emerald-100")}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_4px_rgba(16,185,129,0.5)] animate-pulse"></span>
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
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
          <img src={heroUrl} alt={listing.title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-transparent z-10" />
        <DollarSign className="w-10 h-10 text-slate-300" />
      </div>
    );
  };

  const handleNavigate = () => {
    if (isSeller) {
      navigate(`/seller/listings/${listing.id}`);
    } else if (location.pathname.startsWith('/buyer')) {
      navigate(`/buyer/listing/${listing.id}`);
    } else {
      navigate(`/listing/${listing.id}`);
    }
  };

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-200/75 group flex h-full rounded-[24px]', 
        className,
        isList ? "flex-col sm:flex-row" : "flex-col"
      )}
    >
      <div className={cn(
        "bg-slate-100 relative overflow-hidden shrink-0",
        isList ? "w-full aspect-video sm:aspect-auto sm:w-[35%] lg:w-[38%] sm:min-h-[260px]" : "aspect-[4/3] w-full p-2"
      )}>
        <div className={cn("w-full h-full overflow-hidden relative", (isList ? "" : "rounded-[18px]"))}>
          {renderImage()}
        </div>
        
        {/* Top Left: Status */}
        <div className={cn("absolute z-20", isList ? "top-3 left-3" : "top-5 left-5")}>
          {renderStatus()}
        </div>

        {/* Top Right: Actions */}
        <div className={cn("absolute z-20 flex gap-2", isList ? "top-3 right-3" : "top-5 right-5")}>
          {showFavoriteButton && !isSeller && (
            <FavoriteButton 
              listingId={listing.id} 
              className="bg-white/90 backdrop-blur border-none shadow-sm hover:bg-white text-slate-400 hover:text-red-500 rounded-full w-9 h-9 flex items-center justify-center transition-all"
            />
          )}
          {topRightAction}
        </div>
      </div>

      <CardContent className={cn("flex-1 flex flex-col", isList ? "p-5 sm:p-7" : "p-6 pt-5")}>
        <h3 className="font-extrabold text-[20px] leading-tight text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1" title={listing.title}>
          {listing.title}
        </h3>
        <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5 mb-5 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {listing.locationArea || listing.location || 'Location upon request'}
        </p>

        <div className={cn("mb-5", isList ? "flex flex-wrap gap-3" : "grid grid-cols-2 gap-3")}>
          <div className="flex-1 min-w-[120px] bg-slate-50/80 rounded-2xl p-3 border border-slate-100/50">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Asking Price</p>
            <p className="font-extrabold text-[16px] text-slate-900 truncate">{formatPrice(priceVal)}</p>
          </div>
          <div className="flex-1 min-w-[120px] bg-slate-50/80 rounded-2xl p-3 border border-slate-100/50">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Revenue</p>
            <p className="font-extrabold text-[16px] text-slate-900 truncate">{formatPrice(revVal)}</p>
          </div>
        </div>

        {listing.description && (
          <p className={cn("text-[13px] font-medium text-slate-500 leading-relaxed mb-6", isList ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-2")}>
            {listing.description}
          </p>
        )}

        <div className={cn("mt-auto flex items-center justify-end", isList && "border-t border-slate-100/80 pt-5")}>
          {bottomAction ? bottomAction : (
            <Button
              variant={isList ? "default" : "outline"}
              className={cn(
                "h-11 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 group/btn",
                isList 
                  ? "w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              )}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate();
              }}
            >
              View Details 
              <span className="transition-transform group-hover/btn:translate-x-1">&rarr;</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
