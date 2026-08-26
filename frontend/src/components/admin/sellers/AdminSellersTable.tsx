import type { AdminSeller } from '../../../store/useAdminStore';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AdminSellerStatusBadge } from './AdminSellerStatusBadge';
import { AdminSellerActions } from './AdminSellerActions';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AdminSellersTableProps {
  sellers: AdminSeller[];
}

export function AdminSellersTable({ sellers }: AdminSellersTableProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Seller</th>
              <th scope="col" className="px-6 py-4 font-medium">Type</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
              <th scope="col" className="px-6 py-4 font-medium">Verification</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Listings</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Revenue</th>
              <th scope="col" className="px-6 py-4 font-medium">Joined</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{getInitials(seller.companyName || seller.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground truncate max-w-[150px]">{seller.companyName}</span>
                      <span className="text-muted-foreground text-xs truncate max-w-[150px]">{seller.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md border text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {seller.sellerType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <AdminSellerStatusBadge status={seller.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center" title="Email Verification">
                      {seller.emailVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex items-center" title="Phone Verification">
                      {seller.phoneVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex items-center" title="Business Verification">
                      {seller.businessVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{seller.listingCount}</span>
                    <span className="text-xs text-emerald-600">{seller.activeListingCount} active</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium">
                    {seller.totalRevenue > 0 ? `$${(seller.totalRevenue / 1000).toFixed(1)}k` : '$0'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {formatDate(seller.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <AdminSellerActions seller={seller} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
