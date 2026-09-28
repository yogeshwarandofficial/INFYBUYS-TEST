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
    <div className="w-full overflow-auto rounded-2xl border border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm">
      <table className="w-full text-sm text-left table-fixed">
        <thead className="text-[12px] font-semibold text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#E5E9F2]">
          <tr>
            <th className="px-4 py-3 font-medium w-[35%]">Listing</th>
            <th className="px-4 py-3 font-medium w-[20%]">Seller</th>
            <th className="px-4 py-3 font-medium w-[12%]">Status</th>
            <th className="px-4 py-3 font-medium w-[13%]">Verification</th>
            <th className="px-4 py-3 font-medium w-[15%] text-center">Performance</th>
            <th className="px-4 py-3 font-medium w-[60px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9F2]">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-[#F8FAFC]/50 transition-colors h-[72px]">
              <td className="px-4 py-2 align-middle">
                <div className="flex flex-col gap-1 pr-4">
                  <Link to={`/admin/listings/${listing.id}`} className="font-semibold text-[14px] text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                    {listing.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
                    <span className="font-semibold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> <span className="line-clamp-1">{listing.category}</span></span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> <span className="line-clamp-1">{listing.location}</span></span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex flex-col gap-0.5 pr-2">
                  <Link to={`/admin/sellers/${listing.sellerId}`} className="font-medium text-[13px] text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
                    {listing.sellerName}
                  </Link>
                  {listing.sellerCompany && (
                    <div className="flex items-center gap-1 text-[12px] text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{listing.sellerCompany}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 align-middle">
                <AdminListingStatusBadge status={listing.status} />
              </td>
              <td className="px-4 py-2 align-middle">
                <AdminListingVerificationBadge isVerified={listing.isVerified} />
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-semibold text-gray-900">{(listing.views || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Eye className="h-3 w-3" /> Views</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-semibold text-gray-900">{(listing.enquiries || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Enqs</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 align-middle text-center">
                <AdminListingActions listing={listing} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
