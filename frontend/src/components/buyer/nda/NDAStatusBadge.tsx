import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2 } from 'lucide-react';

interface NDAStatusBadgeProps {
  status: 'REQUESTED' | 'SIGNED';
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  'REQUESTED': {
    label: 'Requested',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 hover:bg-yellow-100/80',
    icon: Clock
  },
  'SIGNED': {
    label: 'Signed',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 hover:bg-green-100/80',
    icon: CheckCircle2
  },
};

export function NDAStatusBadge({ status, className, showIcon = true }: NDAStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;
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
