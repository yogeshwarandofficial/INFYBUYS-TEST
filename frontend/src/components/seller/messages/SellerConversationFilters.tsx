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
  type SellerConversationFilters,
  type SellerConversationStatusFilter,
  type SellerConversationSort,
} from '@/hooks/useSellerConversationSearch';

const STATUS_OPTIONS: { value: SellerConversationStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Conversations' },
  { value: 'unread', label: 'Unread' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'closed', label: 'Closed' },
];

const SORT_OPTIONS: { value: SellerConversationSort; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'recently-updated', label: 'Recently Updated' },
  { value: 'most-unread', label: 'Most Unread' },
];

interface SellerConversationFiltersProps {
  filters: SellerConversationFilters;
  updateFilter: <K extends keyof SellerConversationFilters>(key: K, value: SellerConversationFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function SellerConversationFilters({
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
}: SellerConversationFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[#111827] font-semibold">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as SellerConversationStatusFilter)}
        >
          <SelectTrigger id="conv-status-filter" aria-label="Filter by status" className="bg-white border-[#E5E9F2] rounded-xl focus:ring-blue-500 shadow-sm">
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
        <Label className="text-[#111827] font-semibold">Sort By</Label>
        <Select
          value={filters.sort}
          onValueChange={(v) => updateFilter('sort', v as SellerConversationSort)}
        >
          <SelectTrigger id="conv-sort" aria-label="Sort conversations">
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
          <Separator className="bg-[#E5E9F2]" />
          <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-[#E5E9F2] rounded-xl shadow-sm text-[#111827]" onClick={resetFilters}>
            <X className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear Filters
          </Button>
        </>
      )}
    </div>
  );
}
