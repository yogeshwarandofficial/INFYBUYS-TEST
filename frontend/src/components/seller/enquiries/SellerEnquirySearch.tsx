import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SellerEnquirySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SellerEnquirySearch({ value, onChange }: SellerEnquirySearchProps) {
  return (
    <div className="relative flex-1 min-w-[280px]">
      <Search
        className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8] pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="enquiry-search"
        type="search"
        placeholder="Search by buyer, company, listing, subject..."
        className="pl-10 bg-white/60 border-[#E5E9F2] rounded-xl focus-visible:ring-blue-500 shadow-sm h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search enquiries"
      />
    </div>
  );
}
