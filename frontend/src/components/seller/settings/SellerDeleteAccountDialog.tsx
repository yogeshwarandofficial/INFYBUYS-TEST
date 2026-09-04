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

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (confirmText === 'DELETE') {
      setIsDeleting(true);
      setErrorMsg(null);
      try {
        await import('@/services/apiClient').then(m => m.apiClient.delete('/users/me'));
        setConfirmText('');
        onOpenChange(false);
        import('@/store/useUserStore').then(({ useUserStore }) => {
          useUserStore.getState().logout(true);
        });
        window.location.href = '/';
      } catch (err: any) {
        setIsDeleting(false);
        setErrorMsg(err.response?.data?.message || 'An error occurred while deleting your account.');
      }
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
            {errorMsg && (
              <p className="text-sm font-medium text-destructive mt-2">{errorMsg}</p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex-row">
          <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE' || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
