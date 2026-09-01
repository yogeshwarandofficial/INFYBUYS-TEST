import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="bg-white border-slate-200 shadow-sm text-[#0F172A] hover:bg-white hover:border-[#0B4C8C]/40 hover:text-[#0B4C8C] hover:shadow-md disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400 disabled:opacity-60 transition-all h-10 w-10 rounded-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <span className="text-[15px] font-semibold text-[#0B4C8C] min-w-[100px] text-center tracking-wide">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="bg-white border-slate-200 shadow-sm text-[#0F172A] hover:bg-white hover:border-[#0B4C8C]/40 hover:text-[#0B4C8C] hover:shadow-md disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400 disabled:opacity-60 transition-all h-10 w-10 rounded-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
