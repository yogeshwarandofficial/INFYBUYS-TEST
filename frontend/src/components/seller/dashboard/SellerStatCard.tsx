import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SellerStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function SellerStatCard({ title, value, icon: Icon, description, trend, className }: SellerStatCardProps) {
  // Determine icon background based on title to give it a unique SaaS feel
  const getIconStyle = () => {
    const t = title.toLowerCase();
    if (t.includes('active')) return 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50';
    if (t.includes('pending') || t.includes('clock')) return 'bg-orange-50/80 text-orange-600 border-orange-100/50';
    if (t.includes('sold') || t.includes('dollar')) return 'bg-purple-50/80 text-purple-600 border-purple-100/50';
    if (t.includes('message')) return 'bg-pink-50/80 text-pink-600 border-pink-100/50';
    return 'bg-blue-50/80 text-[#2563EB] border-blue-100/50';
  };

  return (
    <Card className={cn("bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
        <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">{title}</CardTitle>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border", getIconStyle())}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-6">
        <div className="text-3xl font-bold text-[#111827]">{value}</div>
        {(description || trend) && (
          <p className="text-[13px] text-[#64748B] mt-2 flex items-center gap-2">
            {trend && (
              <span className={cn(
                "px-2 py-0.5 rounded-md font-medium text-xs",
                trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            <span>{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
