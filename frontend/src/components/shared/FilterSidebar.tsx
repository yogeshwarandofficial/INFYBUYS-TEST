import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/constants/marketing';

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  return (
    <aside className={`w-full space-y-10 ${className}`}>
      <div>
        <h3 className="font-bold text-[#0B152A] text-lg mb-5 pb-2 border-b border-slate-100">Categories</h3>
        <div className="space-y-4">
          {CATEGORIES.map(category => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox id={`cat-${category.id}`} className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#0B4C8C] data-[state=checked]:border-[#0B4C8C]" />
              <Label htmlFor={`cat-${category.id}`} className="font-medium text-slate-700 text-base cursor-pointer flex-1 select-none">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[#0B152A] text-lg mb-5 pb-2 border-b border-slate-100">Price Range</h3>
        <div className="space-y-4">
          {['Under $100k', '$100k - $500k', '$500k - $1M', 'Over $1M'].map((range, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <Checkbox id={`price-${idx}`} className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#0B4C8C] data-[state=checked]:border-[#0B4C8C]" />
              <Label htmlFor={`price-${idx}`} className="font-medium text-slate-700 text-base cursor-pointer select-none">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[#0B152A] text-lg mb-5 pb-2 border-b border-slate-100">Monthly Revenue</h3>
        <div className="space-y-4">
          {['Under $5k', '$5k - $20k', '$20k - $50k', 'Over $50k'].map((range, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <Checkbox id={`rev-${idx}`} className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#0B4C8C] data-[state=checked]:border-[#0B4C8C]" />
              <Label htmlFor={`rev-${idx}`} className="font-medium text-slate-700 text-base cursor-pointer select-none">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[#0B152A] text-lg mb-5 pb-2 border-b border-slate-100">Listing Type</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="filter-verified" className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#0B4C8C] data-[state=checked]:border-[#0B4C8C]" />
            <Label htmlFor="filter-verified" className="font-medium text-slate-700 text-base cursor-pointer select-none">
              Verified Seller Only
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="filter-premium" className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#0B4C8C] data-[state=checked]:border-[#0B4C8C]" />
            <Label htmlFor="filter-premium" className="font-medium text-slate-700 text-base cursor-pointer select-none">
              Premium Listings
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
