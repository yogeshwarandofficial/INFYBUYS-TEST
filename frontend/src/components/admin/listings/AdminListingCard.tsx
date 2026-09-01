import type { AdminListing } from '../../../store/useAdminStore';
import { Card, CardContent } from '../../ui/card';
import { AdminListingStatusBadge, AdminListingVerificationBadge } from './AdminListingStatusBadge';
import { AdminListingActions } from './AdminListingActions';
import { MapPin, Eye, MessageSquare, Calendar, Building2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminListingCardProps {
  listing: AdminListing;
}

export function AdminListingCard({ listing }: AdminListingCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (price === undefined) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(price);
    } catch {
      return `$${price}`;
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/admin/listings/${listing.id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${listing.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/admin/listings/${listing.id}`);
        }
      }}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-sm line-clamp-2">{listing.title}</span>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{formatPrice(listing.price, listing.currency)}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {listing.category}</span>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminListingActions listing={listing} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground border-y py-2 border-border">
          <div className="flex flex-col flex-1">
            <span className="font-medium text-foreground">{listing.sellerName}</span>
            {listing.sellerCompany && (
              <span className="flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3" /> {listing.sellerCompany}</span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AdminListingStatusBadge status={listing.status} />
          <AdminListingVerificationBadge isVerified={listing.isVerified} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Views
            </div>
            <span className="font-medium">{(listing.views || 0).toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> Enquiries
            </div>
            <span className="font-medium">{(listing.enquiries || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(listing.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
