import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function NDAEmptyState() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-blue-100/40 blur-3xl rounded-full -z-10" />
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-[#E2E8F0] rounded-2xl bg-white/85 backdrop-blur-md shadow-sm">
        <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
          <FileText className="w-8 h-8 text-[#2563EB]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">No NDAs Yet</h3>
        <p className="text-[#64748B] max-w-sm mb-8 text-[15px] leading-relaxed">
          You haven't requested any Non-Disclosure Agreements yet. Request an NDA to view confidential business details.
        </p>
        <Button asChild size="lg" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-12 px-8 font-medium transition-all hover:shadow-lg">
          <Link to="/buyer/browse">
            Browse Businesses <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
