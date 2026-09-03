import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuyerStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconBgClass?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function BuyerStatCard({ title, value, icon: Icon, description, className, iconBgClass, trend }: BuyerStatCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[15px] font-semibold text-[#111827]">{title}</CardTitle>
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", iconBgClass || "bg-primary/10 text-primary")}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#111827] tracking-tight">{value}</div>
        {(description || trend) && (
          <p className="text-[13px] text-[#64748B] mt-2 flex items-center gap-1.5 font-medium">
            {trend && (
              <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold", trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
