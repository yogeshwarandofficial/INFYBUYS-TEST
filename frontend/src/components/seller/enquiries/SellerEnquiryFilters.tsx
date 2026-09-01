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
  type SellerEnquiryFilters,
  type SellerEnquiryStatusFilter,
} from '@/hooks/useSellerEnquirySearch';

const STATUS_OPTIONS: { value: SellerEnquiryStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'unread', label: 'Unread' },
];

interface SellerEnquiryFiltersProps {
  filters: SellerEnquiryFilters;
  updateFilter: <K extends keyof SellerEnquiryFilters>(key: K, value: SellerEnquiryFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function SellerEnquiryFilters({
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
}: SellerEnquiryFiltersProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="enquiry-status-filter">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as SellerEnquiryStatusFilter)}
        >
          <SelectTrigger id="enquiry-status-filter" aria-label="Filter by status">
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

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            <X className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}
