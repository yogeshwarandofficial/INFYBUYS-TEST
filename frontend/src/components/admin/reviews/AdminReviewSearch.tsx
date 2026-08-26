import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminReviewSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdminReviewSearch({ value, onChange }: AdminReviewSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search reviews by user, listing, or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
