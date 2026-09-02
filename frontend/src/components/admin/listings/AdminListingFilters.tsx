import type {
  AdminListingFiltersState,
  AdminListingSortOption
} from '../../../hooks/useAdminListingSearch';
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

interface AdminListingFiltersProps {
  filters: AdminListingFiltersState;
  onFilterChange: (filters: Partial<AdminListingFiltersState>) => void;
  sorting: AdminListingSortOption;
  onSortChange: (sort: AdminListingSortOption) => void;
  onReset: () => void;
  categories: string[];
  className?: string;
}

export function AdminListingFilters({
  filters,
  onFilterChange,
  sorting,
  onSortChange,
  onReset,
  categories,
  className
}: AdminListingFiltersProps) {
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
          <Label htmlFor="sort" className="text-[#334155] font-medium">Sort By</Label>
          <Select value={sorting} onValueChange={(v) => onSortChange(v as AdminListingSortOption)}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
              <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="mostViews">Most Views</SelectItem>
              <SelectItem value="mostEnquiries">Most Enquiries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-[#334155] font-medium">Status</Label>
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-[#334155] font-medium">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(v) => onFilterChange({ category: v })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verification */}
        <div className="space-y-2">
          <Label htmlFor="verification" className="text-[#334155] font-medium">Verification</Label>
          <Select
            value={filters.verification}
            onValueChange={(v) => onFilterChange({ verification: v as any })}
          >
            <SelectTrigger id="verification">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
