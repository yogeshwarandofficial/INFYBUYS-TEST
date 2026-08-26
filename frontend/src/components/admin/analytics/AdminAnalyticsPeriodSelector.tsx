import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { AdminAnalyticsPeriod } from '../../../hooks/useAdminAnalytics';

interface AdminAnalyticsPeriodSelectorProps {
  period: AdminAnalyticsPeriod;
  onPeriodChange: (period: AdminAnalyticsPeriod) => void;
}

export function AdminAnalyticsPeriodSelector({ period, onPeriodChange }: AdminAnalyticsPeriodSelectorProps) {
  return (
    <Select value={period} onValueChange={(v) => onPeriodChange(v as AdminAnalyticsPeriod)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 Days</SelectItem>
        <SelectItem value="30d">Last 30 Days</SelectItem>
        <SelectItem value="90d">Last 90 Days</SelectItem>
        <SelectItem value="6m">Last 6 Months</SelectItem>
        <SelectItem value="1y">Last Year</SelectItem>
        <SelectItem value="all">All Time</SelectItem>
      </SelectContent>
    </Select>
  );
}
