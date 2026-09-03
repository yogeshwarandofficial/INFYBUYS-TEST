import { Seo } from '@/components/shared/Seo';
import { BuyerPageHeader } from '@/components/buyer/BuyerPageHeader';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BillingHistoryTable } from '@/components/buyer/billing/BillingHistoryTable';
import { PaymentMethodCard } from '@/components/buyer/billing/PaymentMethodCard';
import { AddPaymentMethodDialog } from '@/components/buyer/billing/AddPaymentMethodDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function BuyerBilling() {
  const {
    subscription,
    plans,
    billingHistory,
    paymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod
  } = useBuyerStore();

  const [isAddingCard, setIsAddingCard] = useState(false);

  const activePlan = plans.find(p => p.id === subscription?.planId) || plans[0];

  return (
    <>
      <Seo title="Billing & Payments" description="Manage your billing history and payment methods." />

      <div className="w-full space-y-8">
        <BuyerPageHeader
          title="Billing & Payments"
          description="View your billing history, manage payment methods, and download invoices."
          breadcrumbs={[{ label: 'Billing' }]}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View past charges and download invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                <BillingHistoryTable records={billingHistory} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Current Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="font-semibold">{activePlan.name}</span>
                  <span className="text-muted-foreground">${activePlan.price}/{subscription?.billingCycle || 'month'}</span>
                </div>
                {subscription?.status === 'active' ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Next billing date</span>
                      <span>{new Date(subscription.renewalDate || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span>${subscription.amount.toFixed(2)}</span>
                    </div>
                  </>
                ) : subscription?.status === 'cancelled' ? (
                  <div className="text-sm text-destructive">
                    Cancels on {new Date(subscription.renewalDate || '').toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    You are on the free tier.
                  </div>
                )}

                <Button className="w-full mt-2" variant="outline" asChild>
                  <Link to="/buyer/subscription">Manage Plan</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved cards.</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={() => setIsAddingCard(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg bg-muted/50">
                    <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No payment methods saved.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map(pm => (
                      <PaymentMethodCard
                        key={pm.id}
                        method={pm}
                        onSetDefault={() => setDefaultPaymentMethod(pm.id)}
                        onRemove={() => removePaymentMethod(pm.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddPaymentMethodDialog open={isAddingCard} onOpenChange={setIsAddingCard} />
    </>
  );
}
