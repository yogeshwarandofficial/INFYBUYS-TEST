import type { AdminEnquiry } from '../../../store/useAdminStore';
import { Card, CardContent } from '../../ui/card';
import { AdminEnquiryStatusBadge, AdminEnquiryNdaBadge } from './AdminEnquiryStatusBadge';
import { AdminEnquiryActions } from './AdminEnquiryActions';
import { Calendar, User, Store, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminEnquiryCardProps {
  enquiry: AdminEnquiry;
}

export function AdminEnquiryCard({ enquiry }: AdminEnquiryCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/admin/enquiries/${enquiry.id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View details for enquiry about ${enquiry.listingTitle}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/admin/enquiries/${enquiry.id}`);
        }
      }}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-sm line-clamp-2 text-primary">{enquiry.listingTitle}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-medium">
              <DollarSign className="h-3 w-3 shrink-0" />
              <span>{formatPrice(enquiry.listingValue, enquiry.currency)}</span>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminEnquiryActions enquiry={enquiry} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y py-2 border-border">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1"><User className="h-3 w-3" /> Buyer</span>
            <span className="font-medium text-foreground truncate">{enquiry.buyerName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1"><Store className="h-3 w-3" /> Seller</span>
            <span className="font-medium text-foreground truncate">{enquiry.sellerName}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AdminEnquiryStatusBadge status={enquiry.status} />
          <AdminEnquiryNdaBadge hasNda={enquiry.hasNda} status={enquiry.ndaStatus} />
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border mt-2">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(enquiry.createdAt)}</span>
          {enquiry.lastMessageAt && (
            <span>Updated: {formatDate(enquiry.lastMessageAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
