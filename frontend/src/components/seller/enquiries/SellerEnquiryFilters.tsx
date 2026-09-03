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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as SellerEnquiryStatusFilter)}
        >
          <SelectTrigger id="enquiry-status-filter" aria-label="Filter by status" className="bg-white border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm">
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
          <Separator className="bg-[#E5E9F2]" />
          <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-[#E5E9F2] rounded-xl shadow-sm text-[#111827]" onClick={resetFilters}>
            <X className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}
