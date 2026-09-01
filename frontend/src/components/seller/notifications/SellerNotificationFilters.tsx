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
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="notif-status-filter">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as SellerNotificationStatusFilter)}
        >
          <SelectTrigger id="notif-status-filter" aria-label="Filter by status">
            <SelectValue />
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

      <div className="space-y-2">
        <Label htmlFor="notif-type-filter">Type</Label>
        <Select
          value={filters.type}
          onValueChange={(v) => updateFilter('type', v as SellerNotificationTypeFilter)}
        >
          <SelectTrigger id="notif-type-filter" aria-label="Filter by type">
            <SelectValue />
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

      <div className="space-y-2">
        <Label htmlFor="notif-priority-filter">Priority</Label>
        <Select
          value={filters.priority}
          onValueChange={(v) => updateFilter('priority', v as SellerNotificationPriorityFilter)}
        >
          <SelectTrigger id="notif-priority-filter" aria-label="Filter by priority">
            <SelectValue />
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

      <div className="space-y-2">
        <Label htmlFor="notif-sort">Sort By</Label>
        <Select
          value={filters.sort}
          onValueChange={(v) => updateFilter('sort', v as SellerNotificationSort)}
        >
          <SelectTrigger id="notif-sort" aria-label="Sort notifications">
            <SelectValue />
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
        <>
          <Separator />
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            <X className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear Filters
          </Button>
        </>
      )}
    </div>
  );
}
