import { Badge } from '../../ui/badge';
import type { AdminUserStatus } from '../../../store/useAdminStore';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminUserStatusBadgeProps {
  status: AdminUserStatus;
  className?: string;
}

export function AdminUserStatusBadge({ status, className }: AdminUserStatusBadgeProps) {
  const config: Record<AdminUserStatus, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: {
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
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      variant: 'outline'
    },
    blocked: {
      label: 'Blocked',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      variant: 'outline'
    }
  };

  const { label, icon: Icon, className: statusClass, variant } = config[status] || config.active;

  return (
    <Badge
      variant={variant}
      className={cn("gap-1 font-medium px-2.5 py-0.5", statusClass, className)}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
