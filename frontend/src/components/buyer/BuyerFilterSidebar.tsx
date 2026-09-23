import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SearchFilters } from '@/hooks/useListingSearch';

interface BuyerFilterSidebarProps {
  filters: SearchFilters;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
}

export function BuyerFilterSidebar({ filters, updateFilter, clearFilters }: BuyerFilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#111827] text-lg">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto px-2 py-1 text-[#2563EB] hover:bg-blue-50/50 hover:text-[#1D4ED8] rounded-md font-medium">
            Reset
          </Button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[#111827] font-semibold text-sm">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(val) => updateFilter('category', val)}
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-[#E5E9F2] text-[#334155] rounded-lg shadow-sm focus:ring-[#2563EB] focus:border-[#2563EB]">
                <SelectValue placeholder={<span className="text-[#64748B]">All Categories</span>} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                <SelectItem value="Professional Services">Professional Services</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Media & Entertainment">Media & Entertainment</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827] font-semibold text-sm">Min Price ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              className="bg-white/80 backdrop-blur-sm border-[#E5E9F2] text-[#334155] rounded-lg shadow-sm focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] placeholder:text-[#64748B]"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827] font-semibold text-sm">Max Price ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 1000000"
              className="bg-white/80 backdrop-blur-sm border-[#E5E9F2] text-[#334155] rounded-lg shadow-sm focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] placeholder:text-[#64748B]"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827] font-semibold text-sm">Min Monthly Revenue ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              className="bg-white/80 backdrop-blur-sm border-[#E5E9F2] text-[#334155] rounded-lg shadow-sm focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] placeholder:text-[#64748B]"
              value={filters.minRevenue || ''}
              onChange={(e) => updateFilter('minRevenue', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827] font-semibold text-sm">Location</Label>
            <Select
              value={filters.location}
              onValueChange={(val) => updateFilter('location', val)}
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-[#E5E9F2] text-[#334155] rounded-lg shadow-sm focus:ring-[#2563EB] focus:border-[#2563EB]">
                <SelectValue placeholder={<span className="text-[#64748B]">Any Location</span>} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Location</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="united states">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
