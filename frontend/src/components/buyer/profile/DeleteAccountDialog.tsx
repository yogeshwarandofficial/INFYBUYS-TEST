import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserStore();


  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      await import('@/services/apiClient').then(m => m.apiClient.delete('/users/me'));
      setIsDeleting(false);
      onOpenChange(false);
      logout();
      navigate('/');
    } catch (err: any) {
      setIsDeleting(false);
      const msg = err.response?.data?.message || 'An error occurred while deleting your account.';
      setErrorMsg(msg);
    }
  };

  // Reset text when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
      setErrorMsg(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              All your saved searches, favorites, active NDAs, and messages will be permanently lost.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label htmlFor="confirmDelete" className="text-sm font-medium">
              Please type <span className="font-bold select-all">DELETE</span> to confirm.
            </label>
            <Input
              id="confirmDelete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="font-mono"
            />
            {errorMsg && (
              <p className="text-sm font-medium text-destructive mt-2">{errorMsg}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
