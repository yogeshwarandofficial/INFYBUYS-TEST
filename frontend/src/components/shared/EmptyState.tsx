import { FolderSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No results found",
  description = "We couldn't find anything matching your criteria. Try adjusting your filters or search term.",
  actionLabel = "Clear Filters",
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-[#E5E9F2] rounded-2xl bg-white/85 backdrop-blur-md shadow-sm shadow-blue-900/5">
      <div className="w-16 h-16 bg-[#F6F8FC] rounded-2xl flex items-center justify-center mb-6 text-[#94A3B8]">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#111827]">{title}</h3>
      <p className="text-[#64748B] max-w-md mb-6">{description}</p>

      {onAction && actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
