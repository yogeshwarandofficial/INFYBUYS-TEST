import { Badge } from '../../ui/badge';
import type { AdminListingStatus } from '../../../store/useAdminStore';
import { CheckCircle2, XCircle, AlertCircle, Clock, Ban, Edit, Check, Shield } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminListingStatusBadgeProps {
  status: AdminListingStatus;
  className?: string;
}

export function AdminListingStatusBadge({ status, className }: AdminListingStatusBadgeProps) {
  const config: Record<string, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: {
      label: 'Active',
      icon: CheckCircle2,
      className: 'bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20 rounded-full',
      variant: 'outline'
    },
    PUBLISHED: {
      label: 'Active',
      icon: CheckCircle2,
      className: 'bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20 rounded-full',
      variant: 'outline'
    },
    suspended: {
      label: 'Suspended',
      icon: AlertCircle,
      className: 'bg-[#FFFBEB] text-[#F59E0B] border border-[#F59E0B]/20 rounded-full',
      variant: 'outline'
    },
    PAUSED: {
      label: 'Paused',
      icon: AlertCircle,
      className: 'bg-[#FFFBEB] text-[#F59E0B] border border-[#F59E0B]/20 rounded-full',
      variant: 'outline'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/20 rounded-full',
      variant: 'destructive'
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/20 rounded-full',
      variant: 'destructive'
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/20 rounded-full',
      variant: 'secondary'
    },
    SUBMITTED_FOR_REVIEW: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/20 rounded-full',
      variant: 'secondary'
    },
    draft: {
      label: 'Draft',
      icon: Edit,
      className: 'bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 rounded-full',
      variant: 'outline'
    },
    DRAFT: {
      label: 'Draft',
      icon: Edit,
      className: 'bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 rounded-full',
      variant: 'outline'
    },
    sold: {
      label: 'Sold',
      icon: Check,
      className: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/20 rounded-full',
      variant: 'outline'
    },
    SOLD_LET: {
      label: 'Sold',
      icon: Check,
      className: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/20 rounded-full',
      variant: 'outline'
    },
    closed: {
      label: 'Closed',
      icon: Ban,
      className: 'bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 rounded-full',
      variant: 'outline'
    },
    EXPIRED: {
      label: 'Expired',
      icon: Ban,
      className: 'bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 rounded-full',
      variant: 'outline'
    }
  };

  const { label, icon: Icon, className: variantClassName, variant } = config[status] || config['pending'];

  return (
    <Badge
      variant={variant}
      className={cn('capitalize flex w-fit items-center gap-1 font-medium', variantClassName, className)}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}

interface AdminListingVerificationBadgeProps {
  isVerified: boolean;
  className?: string;
}

export function AdminListingVerificationBadge({ isVerified, className }: AdminListingVerificationBadgeProps) {
  if (isVerified) {
    return (
      <Badge
        className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#ECFDF5]/80 shadow-none', className)}
      >
        <Shield className="h-3 w-3 text-[#059669]" aria-hidden="true" />
        <span>Verified</span>
      </Badge>
    );
  }

  return (
    <Badge
      className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-[#FFF7E6] text-[#D97706] border border-[#FCD34D] hover:bg-[#FFF7E6]/80 shadow-none', className)}
    >
      <Shield className="h-3 w-3 text-[#D97706]" aria-hidden="true" />
      <span>Unverified</span>
    </Badge>
  );
}
