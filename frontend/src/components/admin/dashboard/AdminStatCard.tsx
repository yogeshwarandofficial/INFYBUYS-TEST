import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function AdminStatCard({ title, value, description, icon: Icon, trend, className }: AdminStatCardProps) {
  const getIconStyle = () => {
    const t = title.toLowerCase();
    if (t.includes('user') || t.includes('buyer')) return 'bg-blue-50/80 text-blue-600 border-blue-100/50';
    if (t.includes('revenue') || t.includes('active')) return 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50';
    if (t.includes('seller') || t.includes('approval')) return 'bg-purple-50/80 text-purple-600 border-purple-100/50';
    if (t.includes('listing') || t.includes('enquir')) return 'bg-orange-50/80 text-orange-600 border-orange-100/50';
    return 'bg-slate-50/80 text-slate-600 border-slate-100/50';
  };
  return (
    <Card className={cn("bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border shrink-0", getIconStyle())}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#111827] mt-1">{value}</div>

        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-destructive"
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
            <p className="text-[13px] text-[#64748B]">
              {trend?.label || description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
