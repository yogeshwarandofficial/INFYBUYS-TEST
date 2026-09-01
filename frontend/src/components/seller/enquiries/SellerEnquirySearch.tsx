import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerEnquirySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SellerEnquirySearch({ value, onChange }: SellerEnquirySearchProps) {
  return (
    <div className="relative flex-1 min-w-48">
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="enquiry-search"
        type="search"
        placeholder="Search by buyer, company, listing, subject..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search enquiries"
      />
    </div>
  );
}
