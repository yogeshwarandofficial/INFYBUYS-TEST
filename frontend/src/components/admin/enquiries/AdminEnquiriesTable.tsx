import type { AdminEnquiry } from '../../../store/useAdminStore';
import { AdminEnquiryStatusBadge, AdminEnquiryNdaBadge } from './AdminEnquiryStatusBadge';
import { AdminEnquiryActions } from './AdminEnquiryActions';
import { User, Store, Calendar } from 'lucide-react';
import { Link } from 'react-router';

interface AdminEnquiriesTableProps {
  enquiries: AdminEnquiry[];
}

export function AdminEnquiriesTable({ enquiries }: AdminEnquiriesTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="w-full overflow-auto border rounded-md bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Listing</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Parties</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">NDA</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Dates</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 max-w-[250px]">
                  <Link to={`/admin/enquiries/${enquiry.id}`} className="font-semibold hover:underline truncate text-primary">
                    {enquiry.listingTitle}
                  </Link>
                  <span className="text-xs font-medium text-foreground">{formatPrice(enquiry.listingValue, enquiry.currency)}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-2 max-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <Link to={`/admin/buyers/${enquiry.buyerId}`} className="truncate hover:underline">
                      <span className="font-medium text-foreground">{enquiry.buyerName}</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Store className="h-3.5 w-3.5 shrink-0" />
                    <Link to={`/admin/sellers/${enquiry.sellerId}`} className="truncate hover:underline">
                      <span className="truncate">{enquiry.sellerName}</span>
                    </Link>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <AdminEnquiryStatusBadge status={enquiry.status} />
              </td>
              <td className="px-4 py-3">
                <AdminEnquiryNdaBadge hasNda={enquiry.hasNda} status={enquiry.ndaStatus} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {formatDate(enquiry.createdAt)}
                  </span>
                  {enquiry.lastMessageAt && (
                    <span className="text-muted-foreground">Upd: {formatDate(enquiry.lastMessageAt)}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <AdminEnquiryActions enquiry={enquiry} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
