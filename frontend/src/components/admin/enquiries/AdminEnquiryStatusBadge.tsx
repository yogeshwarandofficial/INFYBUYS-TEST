import { Badge } from '../../ui/badge';
import type { AdminEnquiryStatus } from '../../../store/useAdminStore';
import { Mail, CheckCircle2, UserCheck, Handshake, Ban, XCircle, FileText, AlertCircle, FileX } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminEnquiryStatusBadgeProps {
  status: AdminEnquiryStatus;
  className?: string;
}

export function AdminEnquiryStatusBadge({ status, className }: AdminEnquiryStatusBadgeProps) {
  const config: Record<AdminEnquiryStatus, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    new: {
      label: 'New',
      icon: Mail,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      variant: 'secondary'
    },
    contacted: {
      label: 'Contacted',
      icon: CheckCircle2,
      className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
      variant: 'outline'
    },
    qualified: {
      label: 'Qualified',
      icon: UserCheck,
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      variant: 'outline'
    },
    negotiating: {
      label: 'Negotiating',
      icon: Handshake,
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      variant: 'outline'
    },
    closed: {
      label: 'Closed',
      icon: Ban,
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      variant: 'outline'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700',
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

interface AdminEnquiryNdaBadgeProps {
  hasNda: boolean;
  status?: 'pending' | 'signed' | 'rejected';
  className?: string;
}

export function AdminEnquiryNdaBadge({ hasNda, status, className }: AdminEnquiryNdaBadgeProps) {
  if (!hasNda) {
    return (
      <Badge
        variant="outline"
        className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700', className)}
      >
        <FileX className="h-3 w-3 text-slate-400" aria-hidden="true" />
        <span>No NDA</span>
      </Badge>
    );
  }

  if (status === 'signed') {
    return (
      <Badge
        variant="outline"
        className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', className)}
      >
        <FileText className="h-3 w-3" aria-hidden="true" />
        <span>NDA Signed</span>
      </Badge>
    );
  }

  if (status === 'rejected') {
    return (
      <Badge
        variant="outline"
        className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800', className)}
      >
        <FileX className="h-3 w-3" aria-hidden="true" />
        <span>NDA Rejected</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn('capitalize flex w-fit items-center gap-1 font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800', className)}
    >
      <AlertCircle className="h-3 w-3" aria-hidden="true" />
      <span>NDA Pending</span>
    </Badge>
  );
}
