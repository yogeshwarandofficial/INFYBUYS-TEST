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
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center w-full">
      <div className="w-12 h-12 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-400">
        <FolderSearch className="w-5 h-5" />
      </div>
      <h3 className="text-[15px] font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-[14px] text-slate-500 max-w-xs mb-5">{description}</p>

      {onAction && actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
