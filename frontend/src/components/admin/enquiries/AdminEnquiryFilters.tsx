import type {
  AdminEnquiryFiltersState,
  AdminEnquirySortOption
} from '../../../hooks/useAdminEnquirySearch';
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

interface AdminEnquiryFiltersProps {
  filters: AdminEnquiryFiltersState;
  onFilterChange: (filters: Partial<AdminEnquiryFiltersState>) => void;
  sorting: AdminEnquirySortOption;
  onSortChange: (sort: AdminEnquirySortOption) => void;
  onReset: () => void;
  className?: string;
}

export function AdminEnquiryFilters({
  filters,
  onFilterChange,
  sorting,
  onSortChange,
  onReset,
  className
}: AdminEnquiryFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
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

      <div className="space-y-4">
        {/* Sort */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sorting} onValueChange={(v) => onSortChange(v as AdminEnquirySortOption)}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="recentlyUpdated">Recently Updated</SelectItem>
              <SelectItem value="valueHighToLow">Value: High to Low</SelectItem>
              <SelectItem value="valueLowToHigh">Value: Low to High</SelectItem>
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="negotiating">Negotiating</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NDA Status */}
        <div className="space-y-2">
          <Label htmlFor="nda">NDA Status</Label>
          <Select
            value={filters.nda}
            onValueChange={(v) => onFilterChange({ nda: v as any })}
          >
            <SelectTrigger id="nda">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="none">No NDA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
