import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { BuyerSubscription } from '@/store/useBuyerStore';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: BuyerSubscription | null;
  onConfirm: () => void;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
  onConfirm
}: CancelSubscriptionDialogProps) {
  if (!subscription) return null;

  const endDate = new Date(subscription.renewalDate || '').toLocaleDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 text-sm text-muted-foreground">
          <p>
            Your current plan will remain active until the end of your billing period on <strong>{endDate}</strong>.
          </p>
          <p>
            After this date, you will be downgraded to the Free plan. You may lose access to premium features like NDA signing, direct messaging, and advanced search filters.
          </p>
        </div>

        <DialogFooter className="gap-4 sm:gap-4 mt-6 sm:justify-center pr-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}>
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
