import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

interface SellerAnalyticsStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function SellerAnalyticsStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: SellerAnalyticsStatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">
            {title}
          </p>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          {trend ? (
            <p className="flex items-center text-xs text-muted-foreground">
              <span
                className={cn(
                  'flex items-center font-medium mr-1.5',
                  trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 shrink-0" aria-hidden="true" />
                )}
                {trend.value}%
              </span>
              {description}
            </p>
          ) : description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
