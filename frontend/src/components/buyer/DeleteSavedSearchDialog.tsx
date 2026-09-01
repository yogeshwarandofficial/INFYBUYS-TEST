import { useBuyerStore } from '@/store/useBuyerStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteSavedSearchDialogProps {
  searchId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSavedSearchDialog({ searchId, open, onOpenChange }: DeleteSavedSearchDialogProps) {
  const { deleteSavedSearch } = useBuyerStore();

  const handleDelete = () => {
    deleteSavedSearch(searchId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Saved Search</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this saved search? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
