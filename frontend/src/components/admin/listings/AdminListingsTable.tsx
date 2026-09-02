import type { AdminListing } from '../../../store/useAdminStore';
import { AdminListingStatusBadge, AdminListingVerificationBadge } from './AdminListingStatusBadge';
import { AdminListingActions } from './AdminListingActions';
import { Building2, Eye, MessageSquare, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router';

interface AdminListingsTableProps {
  listings: AdminListing[];
}

export function AdminListingsTable({ listings }: AdminListingsTableProps) {
  const formatPrice = (price?: number, currency?: string) => {
    if (price === undefined) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(price);
    } catch {
      return `$${price}`;
    }
  };

  return (
    <div className="w-full overflow-auto rounded-2xl border border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm shadow-blue-900/5">
      <table className="w-full text-sm text-left">
        <thead className="text-[12px] font-semibold text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#E5E9F2]">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[250px]">Listing</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Seller</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Verification</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-center">Performance</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9F2]">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 max-w-[300px]">
                  <Link to={`/admin/listings/${listing.id}`} className="font-semibold hover:underline truncate">
                    {listing.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] truncate">
                    <span className="font-medium text-[#111827]">{formatPrice(listing.price, listing.currency)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate"><Tag className="h-3 w-3 shrink-0" /> {listing.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 max-w-[200px]">
                  <Link to={`/admin/sellers/${listing.sellerId}`} className="font-medium hover:underline truncate">
                    {listing.sellerName}
                  </Link>
                  {listing.sellerCompany && (
                    <div className="flex items-center gap-1 text-xs text-[#64748B] truncate">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{listing.sellerCompany}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <AdminListingStatusBadge status={listing.status} />
              </td>
              <td className="px-4 py-3">
                <AdminListingVerificationBadge isVerified={listing.isVerified} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs">{(listing.views || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> Views</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs">{(listing.enquiries || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5" /> Enq</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <AdminListingActions listing={listing} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
