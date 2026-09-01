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
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      variant: 'outline'
    },
    PUBLISHED: {
      label: 'Active',
      icon: CheckCircle2,
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      variant: 'outline'
    },
    suspended: {
      label: 'Suspended',
      icon: AlertCircle,
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      variant: 'outline'
    },
    PAUSED: {
      label: 'Paused',
      icon: AlertCircle,
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      variant: 'outline'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      variant: 'destructive'
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      variant: 'destructive'
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      variant: 'secondary'
    },
    SUBMITTED_FOR_REVIEW: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      variant: 'secondary'
    },
    draft: {
      label: 'Draft',
      icon: Edit,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      variant: 'outline'
    },
    DRAFT: {
      label: 'Draft',
      icon: Edit,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      variant: 'outline'
    },
    sold: {
      label: 'Sold',
      icon: Check,
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      variant: 'outline'
    },
    SOLD_LET: {
      label: 'Sold',
      icon: Check,
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      variant: 'outline'
    },
    closed: {
      label: 'Closed',
      icon: Ban,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      variant: 'outline'
    },
    EXPIRED: {
      label: 'Expired',
      icon: Ban,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700',
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
        variant="outline"
        className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', className)}
      >
        <Shield className="h-3 w-3" aria-hidden="true" />
        <span>Verified</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700', className)}
    >
      <Shield className="h-3 w-3 text-slate-400" aria-hidden="true" />
      <span>Unverified</span>
    </Badge>
  );
}
