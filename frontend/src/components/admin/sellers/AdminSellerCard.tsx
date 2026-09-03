import type { AdminSeller } from '../../../store/useAdminStore';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AdminSellerStatusBadge } from './AdminSellerStatusBadge';
import { AdminSellerActions } from './AdminSellerActions';
import { Mail, MapPin, Package, Eye, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

interface AdminSellerCardProps {
  seller: AdminSeller;
}

export function AdminSellerCard({ seller }: AdminSellerCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{getInitials(seller.companyName || seller.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-[16px] text-[#111827] leading-tight truncate max-w-[200px]">
              {seller.companyName}
            </h3>
            <span className="text-[13px] text-[#64748B] truncate max-w-[200px]">
              {seller.name}
            </span>
          </div>
        </div>
        <AdminSellerActions seller={seller} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md border text-muted-foreground uppercase tracking-wider">
                {seller.sellerType}
              </span>
              <AdminSellerStatusBadge status={seller.status} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-[13px] text-[#64748B]">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{seller.email}</span>
            </div>
            {seller.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{seller.location}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-3 pt-2 border-t text-sm mt-1">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Verifications</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" title="Email Verification">
                  {seller.emailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className="text-xs">Email</span>
                </div>
                <div className="flex items-center gap-1" title="Business Verification">
                  {seller.businessVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className="text-xs">Biz</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <div className="flex flex-col gap-1 items-center" title="Total Listings">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">{seller.listingCount}</span>
              </div>
              <div className="flex flex-col gap-1 items-center" title="Total Views">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {seller.totalViews > 1000 ? `${(seller.totalViews / 1000).toFixed(1)}k` : seller.totalViews}
                </span>
              </div>
              <div className="flex flex-col gap-1 items-center" title="Total Enquiries">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">{seller.enquiryCount}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
