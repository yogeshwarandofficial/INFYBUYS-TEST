import { useState } from 'react';
import { useSellerStore } from '@/store/useSellerStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface SellerDeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerDeleteAccountDialog({ open, onOpenChange }: SellerDeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const { requestSellerAccountDeletion } = useSellerStore();

  const handleConfirm = () => {
    if (confirmText === 'DELETE') {
      requestSellerAccountDeletion();
      setConfirmText('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">Delete Account</DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your account,
            remove your data from our servers, and delete all your listings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive-foreground">
            <p className="font-semibold mb-1">Warning: Frontend Mock</p>
            <p>This will simulate an account deletion request in the frontend store without actually logging you out or deleting auth data.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmDelete">
              Please type <span className="font-bold">DELETE</span> to confirm.
            </Label>
            <Input
              id="confirmDelete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="font-mono uppercase"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex-row">
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE'}
          >
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
