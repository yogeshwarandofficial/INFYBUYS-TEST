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
    <div className="space-y-8 p-6 lg:p-6 bg-white/50 backdrop-blur-xl h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100/60">
        <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters} 
          className="h-8 px-3 py-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-bold text-[13px] transition-colors"
        >
          Reset All
        </Button>
      </div>

      <div className="space-y-7">
        <div className="space-y-3">
          <Label className="text-slate-900 font-bold text-[13px] uppercase tracking-wider">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(val) => updateFilter('category', val)}
          >
            <SelectTrigger className="w-full h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 transition-all">
              <SelectValue placeholder={<span className="text-slate-400 font-medium">All Categories</span>} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
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

        <div className="space-y-4">
          <Label className="text-slate-900 font-bold text-[13px] uppercase tracking-wider">Price Range ($)</Label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <Input
                type="number"
                placeholder="Min"
                className="pl-7 h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 focus-visible:ring-0 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 placeholder:text-slate-400 transition-all"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
              />
            </div>
            <div className="w-3 h-[2px] bg-slate-300 rounded-full shrink-0" />
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <Input
                type="number"
                placeholder="Max"
                className="pl-7 h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 focus-visible:ring-0 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 placeholder:text-slate-400 transition-all"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-900 font-bold text-[13px] uppercase tracking-wider">Min Monthly Revenue</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
            <Input
              type="number"
              placeholder="e.g. 5000"
              className="pl-7 h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 focus-visible:ring-0 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 placeholder:text-slate-400 transition-all"
              value={filters.minRevenue || ''}
              onChange={(e) => updateFilter('minRevenue', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-900 font-bold text-[13px] uppercase tracking-wider">Location</Label>
          <Select
            value={filters.location}
            onValueChange={(val) => updateFilter('location', val)}
          >
            <SelectTrigger className="w-full h-11 bg-slate-50 hover:bg-slate-100 border-transparent hover:border-slate-200 focus:border-blue-500 rounded-xl shadow-none text-[14px] font-semibold text-slate-700 transition-all">
              <SelectValue placeholder={<span className="text-slate-400 font-medium">Any Location</span>} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
              <SelectItem value="all">Any Location</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="united states">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
