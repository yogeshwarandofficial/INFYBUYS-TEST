import { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBuyerStore } from '@/store/useBuyerStore';

interface BuyerSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export function BuyerSearchBar({ value, onChange, onSearch }: BuyerSearchBarProps) {
  const { searchHistory, removeSearchHistory } = useBuyerStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (term: string) => {
    onChange(term);
    onSearch(term);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1 w-full" ref={containerRef}>
      <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-[#64748B]" />
      <Input
        type="text"
        placeholder="Search businesses, niches, or keywords..."
        className="pl-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl focus-visible:ring-[#2563EB] text-[#111827] placeholder:text-[#64748B]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => {
            onChange('');
            onSearch('');
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {showSuggestions && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-md z-50 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
            Recent Searches
          </div>
          <ul>
            {searchHistory.map((term) => (
              <li key={term} className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer group">
                <div
                  className="flex items-center gap-2 flex-1"
                  onClick={() => handleSuggestionClick(term)}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{term}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearchHistory(term);
                  }}
                  aria-label="Remove search history"
                >
                  <X className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
