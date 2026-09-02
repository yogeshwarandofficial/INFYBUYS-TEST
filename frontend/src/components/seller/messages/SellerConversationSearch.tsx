import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerConversationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SellerConversationSearch({ value, onChange }: SellerConversationSearchProps) {
  return (
    <div className="relative flex-1 min-w-[280px]">
      <Search
        className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8] pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="conversation-search"
        type="search"
        placeholder="Search by buyer, company, listing, message…"
        className="pl-10 bg-white/60 border-[#E5E9F2] rounded-xl focus-visible:ring-blue-500 shadow-sm h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search conversations"
      />
    </div>
  );
}
