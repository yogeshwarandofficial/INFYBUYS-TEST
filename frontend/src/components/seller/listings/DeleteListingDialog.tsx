import { useSellerStore, type SellerListing } from '@/store/useSellerStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteListingDialogProps {
  listing: SellerListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteListingDialog({ listing, open, onOpenChange }: DeleteListingDialogProps) {
  const { deleteListing } = useSellerStore();

  const handleDelete = () => {
    deleteListing(listing.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Listing?</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{' '}
            <strong>"{listing.title}"</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
