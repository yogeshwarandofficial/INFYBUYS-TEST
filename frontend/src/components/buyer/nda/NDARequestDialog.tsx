import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/services/apiClient';

interface NDARequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  onAccepted?: () => void;
}

export function NDARequestDialog({
  open,
  onOpenChange,
  listingId,
  onAccepted,
}: NDARequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!agreed) {
      setError('You must agree to the Non-Disclosure Agreement.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.post(`/listings/${listingId}/nda/request`, {});
      await apiClient.post(`/listings/${listingId}/nda/sign`, {});
      onOpenChange(false);
      if (onAccepted) {
        onAccepted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept NDA. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Non-Disclosure Agreement</DialogTitle>
          <DialogDescription>
            This listing contains confidential business information.
            By accepting this agreement, you agree not to disclose
            or share confidential information obtained through this listing.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="nda-agree"
              checked={agreed}
              onCheckedChange={(checked) => {
                setAgreed(checked as boolean);
                if (checked) setError(null);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="nda-agree" className="font-medium text-sm leading-snug cursor-pointer">
                I agree to the Non-Disclosure Agreement
              </Label>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!agreed || isSubmitting}>
            {isSubmitting ? 'Accepting...' : 'Accept NDA & Reveal Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
