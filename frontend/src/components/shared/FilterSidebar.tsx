import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/constants/marketing';

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  return (
    <aside className={`w-full space-y-8 ${className}`}>
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category.id}`} />
              <Label htmlFor={`cat-${category.id}`} className="font-normal text-muted-foreground cursor-pointer flex-1">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-3">
          {['Under $100k', '$100k - $500k', '$500k - $1M', 'Over $1M'].map((range, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Checkbox id={`price-${idx}`} />
              <Label htmlFor={`price-${idx}`} className="font-normal text-muted-foreground cursor-pointer">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Monthly Revenue</h3>
        <div className="space-y-3">
          {['Under $5k', '$5k - $20k', '$20k - $50k', 'Over $50k'].map((range, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Checkbox id={`rev-${idx}`} />
              <Label htmlFor={`rev-${idx}`} className="font-normal text-muted-foreground cursor-pointer">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Other Filters</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="filter-verified" />
            <Label htmlFor="filter-verified" className="font-normal text-muted-foreground cursor-pointer">
              Verified Seller Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="filter-premium" />
            <Label htmlFor="filter-premium" className="font-normal text-muted-foreground cursor-pointer">
              Premium Listings
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
