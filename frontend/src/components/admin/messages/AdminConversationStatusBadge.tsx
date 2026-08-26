import { Badge } from '../../ui/badge';
import type { AdminConversationStatus } from '../../../store/useAdminStore';
import { MessageSquare, Archive, Ban } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminConversationStatusBadgeProps {
  status: AdminConversationStatus;
  className?: string;
}

export function AdminConversationStatusBadge({ status, className }: AdminConversationStatusBadgeProps) {
  const config: Record<AdminConversationStatus, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: {
      label: 'Active',
      icon: MessageSquare,
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      variant: 'secondary'
    },
    archived: {
      label: 'Archived',
      icon: Archive,
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      variant: 'outline'
    },
    closed: {
      label: 'Closed',
      icon: Ban,
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
