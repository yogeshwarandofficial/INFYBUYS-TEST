import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import {
  type SellerNotificationFilters,
  type SellerNotificationStatusFilter,
  type SellerNotificationTypeFilter,
  type SellerNotificationPriorityFilter,
  type SellerNotificationSort,
} from '@/hooks/useSellerNotificationSearch';

const STATUS_OPTIONS: { value: SellerNotificationStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

const TYPE_OPTIONS: { value: SellerNotificationTypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'listing', label: 'Listing' },
  { value: 'enquiry', label: 'Enquiry' },
  { value: 'message', label: 'Message' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'approval', label: 'Approval' },
  { value: 'payment', label: 'Payment' },
  { value: 'nda', label: 'NDA' },
  { value: 'system', label: 'System' },
];

const PRIORITY_OPTIONS: { value: SellerNotificationPriorityFilter; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS: { value: SellerNotificationSort; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest-priority', label: 'Highest Priority' },
];

interface SellerNotificationFiltersProps {
  filters: SellerNotificationFilters;
  updateFilter: <K extends keyof SellerNotificationFilters>(key: K, value: SellerNotificationFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function SellerNotificationFilters({
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
}: SellerNotificationFiltersProps) {
  return (
    <div className="flex flex-row flex-nowrap items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as SellerNotificationStatusFilter)}
        >
          <SelectTrigger id="notif-status-filter" aria-label="Filter by status" className="w-[140px] bg-white border-[#E5E9F2] rounded-lg focus:ring-blue-500 shadow-sm h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={filters.type}
          onValueChange={(v) => updateFilter('type', v as SellerNotificationTypeFilter)}
        >
          <SelectTrigger id="notif-type-filter" aria-label="Filter by type" className="w-[140px] bg-white border-[#E5E9F2] rounded-lg focus:ring-blue-500 shadow-sm h-9 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={filters.priority}
          onValueChange={(v) => updateFilter('priority', v as SellerNotificationPriorityFilter)}
        >
          <SelectTrigger id="notif-priority-filter" aria-label="Filter by priority" className="w-[140px] bg-white border-[#E5E9F2] rounded-lg focus:ring-blue-500 shadow-sm h-9 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={filters.sort}
          onValueChange={(v) => updateFilter('sort', v as SellerNotificationSort)}
        >
          <SelectTrigger id="notif-sort" aria-label="Sort notifications" className="w-[150px] bg-white border-[#E5E9F2] rounded-lg focus:ring-blue-500 shadow-sm h-9 text-sm">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center shrink-0 pl-1">
          <Button variant="ghost" size="sm" className="h-9 text-slate-500 hover:text-slate-900" onClick={resetFilters}>
            <X className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
