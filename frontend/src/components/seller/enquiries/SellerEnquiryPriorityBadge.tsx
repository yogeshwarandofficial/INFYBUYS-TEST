import { type SellerEnquiryPriority } from '@/store/useSellerStore';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG: Record<
  SellerEnquiryPriority,
  { label: string; icon: React.ElementType; className: string }
> = {
  low: {
    label: 'Low',
    icon: ArrowDown,
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  medium: {
    label: 'Medium',
    icon: ArrowRight,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
};

interface SellerEnquiryPriorityBadgeProps {
  priority: SellerEnquiryPriority;
  className?: string;
}

export function SellerEnquiryPriorityBadge({ priority, className }: SellerEnquiryPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, 'font-medium border-0 gap-1', className)}
      aria-label={`Priority: ${config.label}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
