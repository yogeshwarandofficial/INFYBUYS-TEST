import { useState } from 'react';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { SearchFilters } from '@/hooks/useListingSearch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SaveSearchDialogProps {
  filters: SearchFilters;
  resultCount: number;
  trigger?: React.ReactNode;
}

export function SaveSearchDialog({ filters, resultCount, trigger }: SaveSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const { saveSearch } = useBuyerStore();

  const handleSave = () => {
    if (!name.trim()) return;

    saveSearch(
      {
        name,
        filters,
        alertEnabled,
      },
      resultCount
    );

    setOpen(false);
    setName('');
    setAlertEnabled(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Save Search</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
          <DialogDescription>
            Save these filters to quickly run this search again later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Search Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Profitable SaaS in US"
            />
          </div>

          <div className="bg-muted p-3 rounded-md text-sm space-y-1">
            <p className="font-medium text-foreground mb-2">Current Criteria:</p>
            {filters.query && <p><span className="text-muted-foreground">Keyword:</span> {filters.query}</p>}
            {filters.category !== 'all' && <p><span className="text-muted-foreground">Category:</span> {filters.category}</p>}
            {filters.location !== 'all' && <p><span className="text-muted-foreground">Location:</span> {filters.location}</p>}
            {(filters.minPrice > 0 || filters.maxPrice > 0) && (
              <p><span className="text-muted-foreground">Price:</span> ${filters.minPrice} - {filters.maxPrice > 0 ? `$${filters.maxPrice}` : 'Any'}</p>
            )}
            {filters.minRevenue > 0 && <p><span className="text-muted-foreground">Min Revenue:</span> ${filters.minRevenue}</p>}
            {!filters.query && filters.category === 'all' && filters.location === 'all' && filters.minPrice === 0 && filters.maxPrice === 0 && filters.minRevenue === 0 && (
              <p className="italic text-muted-foreground">No specific filters applied (All Listings)</p>
            )}
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3 mt-2">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new listings match.
              </p>
            </div>
            <Switch
              checked={alertEnabled}
              onCheckedChange={setAlertEnabled}
              aria-label="Toggle auto alerts"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Save Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
