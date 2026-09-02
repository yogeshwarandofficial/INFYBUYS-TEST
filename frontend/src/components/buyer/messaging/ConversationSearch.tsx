import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConversationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConversationSearch({ value, onChange }: ConversationSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
      <Input
        type="text"
        placeholder="Search messages..."
        className="pl-9 pr-9 h-9 bg-white/50 border-[#E5E9F2] text-[#334155] rounded-lg focus-visible:ring-[#2563EB] placeholder:text-[#64748B]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search conversations"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
