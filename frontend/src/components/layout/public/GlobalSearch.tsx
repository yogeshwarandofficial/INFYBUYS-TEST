import { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { CATEGORIES } from '@/constants/marketing';
import { apiClient } from '@/services/apiClient';
import type { Listing } from '@/types/api';
import { Building2, Tag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        // Note: the backend may or may not support `?featured=true`, but we fetch and filter
        const data = await apiClient.get<{ data: Listing[] }>('/listings');
        setFeaturedListings(data.data.filter(l => l.isFeatured).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch featured listings for search', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, [open]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for businesses, categories, or keywords..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Popular Categories">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <CommandItem
              key={cat.id}
              onSelect={() => handleSelect(`/search?category=${cat.name}`)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span>{cat.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Featured Listings">
          {isLoading ? (
            <div className="py-6 text-center text-sm flex justify-center text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
            </div>
          ) : (
            featuredListings.map((listing) => (
              <CommandItem
              key={listing.id}
              onSelect={() => handleSelect(`/listing/${listing.id}`)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{listing.title}</span>
                <span className="text-xs text-muted-foreground">${((Number(listing.priceOrRent) || 0) / 1000).toFixed(0)}k • {listing.category}</span>
              </div>
            </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
