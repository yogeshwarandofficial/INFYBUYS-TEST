import { type SellerEnquiryStatus } from '@/store/useSellerStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  SellerEnquiryStatus,
  { label: string; className: string }
> = {
  new: {
    label: 'New',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
  qualified: {
    label: 'Qualified',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  negotiating: {
    label: 'Negotiating',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  closed: {
    label: 'Closed',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
};

interface SellerEnquiryStatusBadgeProps {
  status: SellerEnquiryStatus;
  className?: string;
}

export function SellerEnquiryStatusBadge({ status, className }: SellerEnquiryStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
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
