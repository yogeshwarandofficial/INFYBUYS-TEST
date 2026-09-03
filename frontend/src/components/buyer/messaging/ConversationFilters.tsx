import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConversationFilter = 'all' | 'unread' | 'active' | 'archived' | 'closed';

interface ConversationFiltersProps {
  currentFilter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
}

const filters: { label: string; value: ConversationFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
  { label: 'Closed', value: 'closed' },
];

export function ConversationFilters({ currentFilter, onFilterChange }: ConversationFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "h-8 px-4 text-[13px] font-medium rounded-full transition-colors",
              currentFilter === filter.value
                ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white shadow-sm"
                : "bg-white/50 text-[#64748B] hover:bg-white/80 hover:text-[#111827] border border-[#E5E9F2]"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
}
