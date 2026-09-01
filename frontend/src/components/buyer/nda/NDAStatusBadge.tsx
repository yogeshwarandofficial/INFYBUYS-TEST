import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NDAStatus } from '@/store/useBuyerStore';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Ban } from 'lucide-react';

interface NDAStatusBadgeProps {
  status: NDAStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<NDAStatus, { label: string; className: string; icon: React.ElementType }> = {
  'draft': {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground hover:bg-muted',
    icon: FileText
  },
  'pending': {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 hover:bg-yellow-100/80',
    icon: Clock
  },
  'under-review': {
    label: 'Under Review',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 hover:bg-blue-100/80',
    icon: AlertCircle
  },
  'approved': {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 hover:bg-green-100/80',
    icon: CheckCircle2
  },
  'rejected': {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 hover:bg-red-100/80',
    icon: XCircle
  },
  'expired': {
    label: 'Expired',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
    icon: Clock
  },
  'cancelled': {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
    icon: Ban
  },
};

export function NDAStatusBadge({ status, className, showIcon = true }: NDAStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium gap-1 flex items-center border-0 w-fit", config.className, className)}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}
