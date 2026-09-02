import type {
  AdminConversationFiltersState,
  AdminConversationSortOption
} from '../../../hooks/useAdminConversationSearch';
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

interface AdminConversationFiltersProps {
  filters: AdminConversationFiltersState;
  onFilterChange: (filters: Partial<AdminConversationFiltersState>) => void;
  sorting: AdminConversationSortOption;
  onSortChange: (sort: AdminConversationSortOption) => void;
  onReset: () => void;
  className?: string;
}

export function AdminConversationFilters({
  filters,
  onFilterChange,
  sorting,
  onSortChange,
  onReset,
  className
}: AdminConversationFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className={`flex flex-col gap-6 bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-6 ${className}`}>
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
          disabled={activeFiltersCount === 0 && sorting === 'newestUpdated'}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Sort */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sorting} onValueChange={(v) => onSortChange(v as AdminConversationSortOption)}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newestUpdated">Recently Updated</SelectItem>
              <SelectItem value="oldestUpdated">Oldest Updated</SelectItem>
              <SelectItem value="mostMessages">Most Messages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange({ status: v as any })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
