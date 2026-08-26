import { type SellerNotificationPriority } from '@/store/useSellerStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';

interface SellerNotificationPriorityBadgeProps {
  priority: SellerNotificationPriority;
  className?: string;
}

export function SellerNotificationPriorityBadge({ priority, className }: SellerNotificationPriorityBadgeProps) {
  switch (priority) {
    case 'high':
      return (
        <Badge
          variant="secondary"
          className={cn('bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0 text-[10px] uppercase font-semibold gap-1', className)}
        >
          <ArrowUp className="w-3 h-3" aria-hidden="true" />
          High
        </Badge>
      );
    case 'medium':
      return (
        <Badge
          variant="secondary"
          className={cn('bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px] uppercase font-semibold gap-1', className)}
        >
          <Minus className="w-3 h-3" aria-hidden="true" />
          Medium
        </Badge>
      );
    case 'low':
      return (
        <Badge
          variant="secondary"
          className={cn('bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-0 text-[10px] uppercase font-semibold gap-1', className)}
        >
          <ArrowDown className="w-3 h-3" aria-hidden="true" />
          Low
        </Badge>
      );
    default:
      return null;
  }
}
