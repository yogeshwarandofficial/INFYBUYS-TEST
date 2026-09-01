import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SubscriptionPlan } from '@/store/useBuyerStore';

interface MockPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
  billingCycle: 'monthly' | 'yearly';
  onSimulateSuccess: () => void;
  onSimulateFailure: () => void;
}

export function MockPaymentDialog({
  open,
  onOpenChange,
  plan,
  billingCycle,
  onSimulateSuccess,
  onSimulateFailure
}: MockPaymentDialogProps) {
  if (!plan) return null;

  const price = billingCycle === 'monthly' ? plan.price : plan.price * 10;
  const total = price + (price * 0.1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            Mock Payment Simulation
          </DialogTitle>
          <DialogDescription>
            You are about to simulate a payment for the <strong>{plan.name}</strong> plan (${total.toFixed(2)}).
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/50 my-4 text-yellow-800 dark:text-yellow-200 text-sm">
          <strong>Important:</strong> This is a mock environment. No real transaction will take place. Please choose an outcome below to test the application flows.
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
          <Button
            variant="destructive"
            onClick={onSimulateFailure}
            className="w-full sm:w-auto flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Simulate Failure
          </Button>
          <Button
            variant="default"
            onClick={onSimulateSuccess}
            className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Simulate Success
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
