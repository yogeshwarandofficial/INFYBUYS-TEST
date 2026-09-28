import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    if (t.includes('user') || t.includes('buyer')) return 'bg-blue-50 text-blue-600 group-hover:bg-blue-100';
    if (t.includes('revenue')) return 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100';
    if (t.includes('active')) return 'bg-teal-50 text-teal-600 group-hover:bg-teal-100';
    if (t.includes('seller') || t.includes('approval')) return 'bg-purple-50 text-purple-600 group-hover:bg-purple-100';
    if (t.includes('listing')) return 'bg-green-50 text-green-600 group-hover:bg-green-100';
    if (t.includes('enquir')) return 'bg-orange-50 text-orange-600 group-hover:bg-orange-100';
    if (title.toLowerCase() === 'pending approvals') return 'bg-amber-50 text-amber-600 group-hover:bg-amber-100';
    return 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';
  };

  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-5 shadow-subtle hover:shadow-card transition-shadow group relative overflow-hidden", className)}>
      {title.toLowerCase() === 'pending approvals' && (
        <div className="absolute inset-0 bg-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      )}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", getIconStyle())}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center text-sm relative z-10">
          {trend ? (
            <>
              <span className={cn(
                "font-medium flex items-center gap-1",
                trend.positive ? "text-emerald-600" : "text-destructive"
              )}>
                {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-slate-500 ml-2">{trend.label}</span>
            </>
          ) : (
            <span className="text-slate-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
