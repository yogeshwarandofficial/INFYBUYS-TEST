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
      className: 'bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20 rounded-full',
      variant: 'outline'
    },
    suspended: {
      label: 'Suspended',
      icon: AlertCircle,
      className: 'bg-[#FFFBEB] text-[#F59E0B] border border-[#F59E0B]/20 rounded-full',
      variant: 'outline'
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/20 rounded-full',
      variant: 'outline'
    },
    blocked: {
      label: 'Blocked',
      icon: XCircle,
      className: 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/20 rounded-full',
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
