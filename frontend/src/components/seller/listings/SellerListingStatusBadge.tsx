import { type SellerListingStatus } from '@/store/useSellerStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  SellerListingStatus,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-[#111827] dark:bg-slate-800 dark:text-slate-300',
  },
  pending: {
    label: 'Pending Review',
    className: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  sold: {
    label: 'Sold',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  archived: {
    label: 'Archived',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  CHANGES_PENDING_REVIEW: {
    label: 'Changes Pending Review',
    className: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

interface SellerListingStatusBadgeProps {
  status: SellerListingStatus;
  className?: string;
}

export function SellerListingStatusBadge({ status, className }: SellerListingStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, 'font-medium border-0', className)}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}
