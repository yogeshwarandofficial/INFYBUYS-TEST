import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldAlert, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBuyerStore } from '@/store/useBuyerStore';

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Name on card is required.'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits.').max(19),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format must be MM/YY'),
  cvc: z.string().min(3, 'CVC must be at least 3 digits').max(4),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodDialog({ open, onOpenChange }: AddPaymentMethodDialogProps) {
  const { addPaymentMethod } = useBuyerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
  });

  const onSubmit = (data: PaymentMethodFormValues) => {
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      // Mock parsing for demo
      const [month, year] = data.expiry.split('/');
      const last4 = data.cardNumber.slice(-4);
      const brand = data.cardNumber.startsWith('4') ? 'Visa' :
                   data.cardNumber.startsWith('5') ? 'Mastercard' :
                   data.cardNumber.startsWith('3') ? 'Amex' : 'Card';

      addPaymentMethod({
        type: 'card',
        brand,
        last4,
        expiryMonth: parseInt(month, 10),
        expiryYear: parseInt(`20${year}`, 10),
      });

      setIsSubmitting(false);
      reset();
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) reset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter a mock credit card for demonstration purposes.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900/50 my-4 flex gap-3 text-yellow-800 dark:text-yellow-200">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Mock Environment:</strong> Do not enter real credit card information. Use any 16-digit number to simulate adding a card.
            </div>
          </div>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  className="pl-10"
                  maxLength={19}
                  {...register('cardNumber', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                    }
                  })}
                />
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  {...register('expiry', {
                    onChange: (e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        e.target.value = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                      } else {
                        e.target.value = val;
                      }
                    }
                  })}
                />
                {errors.expiry && <p className="text-sm text-destructive">{errors.expiry.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" maxLength={4} {...register('cvc')} />
                {errors.cvc && <p className="text-sm text-destructive">{errors.cvc.message}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Mock Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
