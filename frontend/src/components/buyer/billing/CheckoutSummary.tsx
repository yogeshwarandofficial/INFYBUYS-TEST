import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SubscriptionPlan } from '@/store/useBuyerStore';

interface CheckoutSummaryProps {
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  onPay?: () => void;
  isProcessing?: boolean;
}

export function CheckoutSummary({ plan, billingCycle, onPay, isProcessing }: CheckoutSummaryProps) {
  const price = billingCycle === 'monthly' ? plan.price : plan.price * 10; // Simple yearly discount for mock
  const tax = price * 0.1; // 10% mock tax
  const total = price + tax;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{plan.name} Plan</h3>
              <p className="text-sm text-muted-foreground capitalize">{billingCycle} billing</p>
            </div>
            <div className="text-right">
              <div className="font-bold">${price.toFixed(2)}</div>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {plan.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-end">
            <span className="font-bold text-lg">Total</span>
            <div className="text-right">
              <span className="font-bold text-2xl">${total.toFixed(2)}</span>
              <div className="text-xs text-muted-foreground">Billed {billingCycle}</div>
            </div>
          </div>
        </div>
      </CardContent>
      {onPay && (
        <CardFooter>
          <Button
            className="w-full text-lg h-12"
            onClick={onPay}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Mock Payment...' : `Pay $${total.toFixed(2)}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
