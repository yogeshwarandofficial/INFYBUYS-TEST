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
  const getIconStyle = () => {
    const t = title.toLowerCase();
    if (t.includes('active')) return 'bg-blue-50/80 text-blue-600 border-blue-100/50';
    if (t.includes('view')) return 'bg-purple-50/80 text-purple-600 border-purple-100/50';
    if (t.includes('enquir')) return 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50';
    if (t.includes('conversation')) return 'bg-orange-50/80 text-orange-600 border-orange-100/50';
    return 'bg-blue-50/80 text-blue-600 border-blue-100/50';
  };
  return (
    <Card className={cn("bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden", className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
            {title}
          </p>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border shrink-0", getIconStyle())}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-3xl font-bold text-[#111827]">
            {value}
          </div>
          {trend ? (
            <p className="flex items-center text-[13px] text-[#64748B]">
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
            <p className="text-[13px] text-[#64748B]">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
