import type { AdminBuyer } from '../../../store/useAdminStore';
import { AdminBuyerStatusBadge } from './AdminBuyerStatusBadge';
import { AdminBuyerVerificationBadge } from './AdminBuyerVerificationBadge';
import { AdminBuyerActions } from './AdminBuyerActions';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Building2, Eye, MessageSquare, MapPin } from 'lucide-react';

interface AdminBuyersTableProps {
  buyers: AdminBuyer[];
}

export function AdminBuyersTable({ buyers }: AdminBuyersTableProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full overflow-auto rounded-2xl border border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm shadow-blue-900/5">
      <table className="w-full text-sm text-left">
        <thead className="text-[12px] font-semibold text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#E5E9F2]">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Buyer</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Company & Location</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Verification</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-center">Activity</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Joined / Active</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9F2]">
          {buyers.map((buyer) => (
            <tr key={buyer.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={buyer.avatar} alt={buyer.name} />
                    <AvatarFallback>{getInitials(buyer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{buyer.name}</span>
                    <span className="text-xs text-[#64748B]">{buyer.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  {buyer.company ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Building2 className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>{buyer.company}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#64748B] italic">None specified</span>
                  )}
                  {buyer.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{buyer.location}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <AdminBuyerStatusBadge status={buyer.status} />
              </td>
              <td className="px-4 py-3">
                <AdminBuyerVerificationBadge status={buyer.verificationStatus} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs">{buyer.totalEnquiries}</span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> Enq</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs">{buyer.totalMessages}</span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5" /> Msg</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 text-xs">
                  <span>{formatDate(buyer.joinedAt)}</span>
                  {buyer.lastActiveAt && (
                    <span className="text-[#64748B]">Active: {formatDate(buyer.lastActiveAt)}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <AdminBuyerActions buyer={buyer} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
