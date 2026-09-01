import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerNotificationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SellerNotificationSearch({ value, onChange }: SellerNotificationSearchProps) {
  return (
    <div className="relative flex-1 min-w-48">
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="notification-search"
        type="search"
        placeholder="Search notifications..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search notifications"
      />
    </div>
  );
}
