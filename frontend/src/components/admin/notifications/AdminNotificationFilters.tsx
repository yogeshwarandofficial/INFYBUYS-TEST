import type {
  AdminNotificationFiltersState,
  AdminNotificationSortOption
} from '../../../hooks/useAdminNotificationSearch';
import { Button } from '../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Label } from '../../ui/label';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminNotificationFiltersProps {
  filters: AdminNotificationFiltersState;
  onFilterChange: (filters: Partial<AdminNotificationFiltersState>) => void;
  sorting: AdminNotificationSortOption;
  onSortChange: (sort: AdminNotificationSortOption) => void;
  onReset: () => void;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function AdminNotificationFilters({
  filters,
  onFilterChange,
  sorting,
  onSortChange,
  onReset,
  className,
  orientation = 'vertical'
}: AdminNotificationFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className={cn("flex", orientation === 'vertical' ? "flex-col gap-6" : "flex-row flex-wrap items-center gap-4", className)}>
      {orientation === 'vertical' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            disabled={activeFiltersCount === 0 && sorting === 'newest'}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      )}

      <div className={cn("flex", orientation === 'vertical' ? "flex-col space-y-4" : "flex-row flex-wrap items-center gap-3 w-full")}>
        {/* Sort */}
        {/* Sort */}
        <div className={cn(orientation === 'vertical' ? "space-y-2" : "flex items-center gap-2")}>
          {orientation === 'vertical' && <Label htmlFor="sort" className="text-[#334155] font-medium text-xs">Sort</Label>}
          <Select value={sorting} onValueChange={(v) => onSortChange(v as AdminNotificationSortOption)}>
            <SelectTrigger id="sort" className={cn(orientation === 'horizontal' && "w-[160px] h-9 text-xs")}>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className={cn(orientation === 'vertical' ? "space-y-2" : "flex items-center gap-2")}>
          {orientation === 'vertical' && <Label htmlFor="status" className="text-[#334155] font-medium text-xs">Status</Label>}
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange({ status: v as any })}
          >
            <SelectTrigger id="status" className={cn(orientation === 'horizontal' && "w-[140px] h-9 text-xs")}>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className={cn(orientation === 'vertical' ? "space-y-2" : "flex items-center gap-2")}>
          {orientation === 'vertical' && <Label htmlFor="type" className="text-[#334155] font-medium text-xs">Type</Label>}
          <Select
            value={filters.type}
            onValueChange={(v) => onFilterChange({ type: v as any })}
          >
            <SelectTrigger id="type" className={cn(orientation === 'horizontal' && "w-[160px] h-9 text-xs")}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="listing">Listing</SelectItem>
              <SelectItem value="enquiry">Enquiry</SelectItem>
              <SelectItem value="message">Message</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {orientation === 'horizontal' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground ml-auto"
            disabled={activeFiltersCount === 0 && sorting === 'newest'}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
