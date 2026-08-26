import type { AdminBuyer } from '../../../store/useAdminStore';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AdminBuyerStatusBadge } from './AdminBuyerStatusBadge';
import { AdminBuyerVerificationBadge } from './AdminBuyerVerificationBadge';
import { AdminBuyerActions } from './AdminBuyerActions';
import { Mail, MapPin, Building2, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminBuyerCardProps {
  buyer: AdminBuyer;
}

export function AdminBuyerCard({ buyer }: AdminBuyerCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/admin/buyers/${buyer.id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${buyer.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/admin/buyers/${buyer.id}`);
        }
      }}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={buyer.avatar} alt={buyer.name} />
              <AvatarFallback>{getInitials(buyer.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm line-clamp-1">{buyer.name}</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{buyer.email}</span>
              </div>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AdminBuyerActions buyer={buyer} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {buyer.company && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{buyer.company}</span>
            </div>
          )}
          {buyer.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{buyer.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <AdminBuyerStatusBadge status={buyer.status} />
          <AdminBuyerVerificationBadge status={buyer.verificationStatus} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Enquiries
            </div>
            <span className="font-medium">{buyer.totalEnquiries}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> Messages
            </div>
            <span className="font-medium">{buyer.totalMessages}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
          <span>Joined {formatDate(buyer.joinedAt)}</span>
          {buyer.lastActiveAt && <span>Active {formatDate(buyer.lastActiveAt)}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
