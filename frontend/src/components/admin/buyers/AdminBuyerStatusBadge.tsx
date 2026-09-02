import { Badge } from '../../ui/badge';
import type { AdminBuyerStatus } from '../../../store/useAdminStore';
import { CheckCircle2, XCircle, AlertCircle, Clock, Ban } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminBuyerStatusBadgeProps {
  status: AdminBuyerStatus;
  className?: string;
}

export function AdminBuyerStatusBadge({ status, className }: AdminBuyerStatusBadgeProps) {
  const config: Record<AdminBuyerStatus, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
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
    blocked: {
      label: 'Blocked',
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
    deleted: {
      label: 'Deleted',
      icon: Ban,
      className: 'bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 rounded-full',
      variant: 'outline'
    }
  };

  const { label, icon: Icon, className: variantClassName, variant } = config[status];

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
