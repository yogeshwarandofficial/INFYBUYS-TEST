import { Badge } from '../../ui/badge';
import type { AdminBuyerVerificationStatus } from '../../../store/useAdminStore';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminBuyerVerificationBadgeProps {
  status: AdminBuyerVerificationStatus;
  className?: string;
}

export function AdminBuyerVerificationBadge({ status, className }: AdminBuyerVerificationBadgeProps) {
  const config: Record<AdminBuyerVerificationStatus, { label: string; icon: any; className: string }> = {
    verified: {
      label: 'Verified',
      icon: ShieldCheck,
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    pending: {
      label: 'Verification Pending',
      icon: ShieldAlert,
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    unverified: {
      label: 'Unverified',
      icon: Shield,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    }
  };

  const { label, icon: Icon, className: variantClassName } = config[status];

  return (
    <Badge
      variant="outline"
      className={cn('capitalize flex w-fit items-center gap-1 font-medium', variantClassName, className)}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
