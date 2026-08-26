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
import { Archive } from 'lucide-react';

interface ArchiveListingDialogProps {
  listing: SellerListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveListingDialog({ listing, open, onOpenChange }: ArchiveListingDialogProps) {
  const { archiveListing } = useSellerStore();

  const handleArchive = () => {
    archiveListing(listing.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Listing?</DialogTitle>
          <DialogDescription>
            <strong>"{listing.title}"</strong> will be archived and will no longer appear
            as active on the marketplace. You can restore it later as a draft.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archive Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
