import { useState } from 'react';
import { useUpdateSavedSearch } from '@/hooks/useSavedSearches';
import type { SavedSearch } from '@/hooks/useSavedSearches';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EditSavedSearchDialogProps {
  search: SavedSearch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSavedSearchDialog({ search, open, onOpenChange }: EditSavedSearchDialogProps) {
  const [name, setName] = useState(search.name);
  const isAlertEnabled = search.alertFrequency && search.alertFrequency !== 'none';
  const [alertEnabled, setAlertEnabled] = useState(!!isAlertEnabled);
  const { mutate: updateSavedSearch, isPending } = useUpdateSavedSearch();

  const handleSave = () => {
    if (!name.trim()) return;
    updateSavedSearch({ id: search.id, data: { name, alertFrequency: alertEnabled ? 'daily' : 'none' } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Saved Search</DialogTitle>
          <DialogDescription>
            Update the name and alert settings for this search.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Search Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
