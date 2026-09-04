import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type SellerAnalyticsPeriod } from '@/hooks/useSellerAnalytics';

interface SellerAnalyticsPeriodSelectorProps {
  period: SellerAnalyticsPeriod;
  onPeriodChange: (period: SellerAnalyticsPeriod) => void;
}

export function SellerAnalyticsPeriodSelector({
  period,
  onPeriodChange,
}: SellerAnalyticsPeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
        Time Period:
      </span>
      <Select
        value={period}
        onValueChange={(v) => onPeriodChange(v as SellerAnalyticsPeriod)}
      >
        <SelectTrigger className="w-[140px] h-9" aria-label="Select analytics time period">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="90d">Last 90 Days</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
