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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="link" size="sm" onClick={clearFilters} className="h-auto p-0">
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(val) => updateFilter('category', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="e-commerce">E-Commerce</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Min Price ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Price ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 1000000"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Min Monthly Revenue ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={filters.minRevenue || ''}
              onChange={(e) => updateFilter('minRevenue', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={filters.location}
              onValueChange={(val) => updateFilter('location', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Location" />
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
