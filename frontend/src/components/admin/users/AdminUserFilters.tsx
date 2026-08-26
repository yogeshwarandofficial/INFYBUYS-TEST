import type {
  AdminUserFiltersState,
  AdminUserSortOption
} from '../../../hooks/useAdminUserSearch';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { useState, useEffect } from 'react';

interface AdminUserFiltersProps {
  filters: AdminUserFiltersState;
  onFilterChange: (filters: Partial<AdminUserFiltersState>) => void;
  sorting: AdminUserSortOption;
  onSortingChange: (sorting: AdminUserSortOption) => void;
  onReset: () => void;
}

function FilterContent({ filters, onFilterChange, sorting, onSortingChange, onReset }: AdminUserFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Filters</h4>

        <div className="space-y-2">
          <Label htmlFor="role-filter">Role</Label>
          <Select
            value={filters.role || 'all'}
            onValueChange={(val) => onFilterChange({ role: val as any })}
          >
            <SelectTrigger id="role-filter" aria-label="Filter by role">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(val) => onFilterChange({ status: val as any })}
          >
            <SelectTrigger id="status-filter" aria-label="Filter by status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-verified-filter" className="cursor-pointer">Email Verified</Label>
            <Switch
              id="email-verified-filter"
              checked={filters.emailVerified === true}
              onCheckedChange={(checked) => onFilterChange({ emailVerified: checked ? true : 'all' })}
              aria-label="Filter by email verified"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="phone-verified-filter" className="cursor-pointer">Phone Verified</Label>
            <Switch
              id="phone-verified-filter"
              checked={filters.phoneVerified === true}
              onCheckedChange={(checked) => onFilterChange({ phoneVerified: checked ? true : 'all' })}
              aria-label="Filter by phone verified"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Sort By</h4>

        <div className="space-y-2">
          <Select
            value={sorting}
            onValueChange={(val) => onSortingChange(val as AdminUserSortOption)}
          >
            <SelectTrigger aria-label="Sort users">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              <SelectItem value="lastLogin">Recent Login</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={onReset}
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

export function AdminUserFilters(props: AdminUserFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters & Sort
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[350px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Filters & Sort</SheetTitle>
          </SheetHeader>
          <FilterContent {...props} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-[280px] shrink-0">
      <FilterContent {...props} />
    </div>
  );
}
