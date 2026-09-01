import type {
  AdminSellerFiltersState,
  AdminSellerSortOption
} from '../../../hooks/useAdminSellerSearch';
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

interface AdminSellerFiltersProps {
  filters: AdminSellerFiltersState;
  onFilterChange: (filters: Partial<AdminSellerFiltersState>) => void;
  sorting: AdminSellerSortOption;
  onSortChange: (sort: AdminSellerSortOption) => void;
  onReset: () => void;
  className?: string;
}

export function AdminSellerFilters({
  filters,
  onFilterChange,
  sorting,
  onSortChange,
  onReset,
  className
}: AdminSellerFiltersProps) {
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
          <Select value={sorting} onValueChange={(v) => onSortChange(v as AdminSellerSortOption)}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              <SelectItem value="mostListings">Most Listings</SelectItem>
              <SelectItem value="mostViews">Most Views</SelectItem>
              <SelectItem value="mostEnquiries">Most Enquiries</SelectItem>
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seller Type */}
        <div className="space-y-2">
          <Label htmlFor="sellerType">Seller Type</Label>
          <Select
            value={filters.sellerType}
            onValueChange={(v) => onFilterChange({ sellerType: v })}
          >
            <SelectTrigger id="sellerType">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Broker">Broker</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verifications */}
        <div className="space-y-2">
          <Label htmlFor="emailVerified">Email Verification</Label>
          <Select
            value={filters.emailVerified?.toString() || 'all'}
            onValueChange={(v) => onFilterChange({ emailVerified: v === 'all' ? 'all' : v === 'true' })}
          >
            <SelectTrigger id="emailVerified">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
