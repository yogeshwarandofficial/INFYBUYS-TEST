import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminUserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdminUserSearch({ value, onChange }: AdminUserSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Input
        placeholder="Search users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 w-full sm:w-[300px]"
        aria-label="Search users by name, email, company, or location"
      />
    </div>
  );
}
