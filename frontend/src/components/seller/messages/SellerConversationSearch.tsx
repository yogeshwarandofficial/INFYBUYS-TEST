import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerConversationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SellerConversationSearch({ value, onChange }: SellerConversationSearchProps) {
  return (
    <div className="relative flex-1 min-w-48">
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="conversation-search"
        type="search"
        placeholder="Search by buyer, company, listing, message…"
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search conversations"
      />
    </div>
  );
}
