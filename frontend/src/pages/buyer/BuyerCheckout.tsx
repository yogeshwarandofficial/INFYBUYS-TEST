import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { BuyerPageHeader } from '@/components/buyer/BuyerPageHeader';
import { Button } from '@/components/ui/button';
import { useBuyerStore } from '@/store/useBuyerStore';
import { CheckoutSummary } from '@/components/buyer/billing/CheckoutSummary';
import { PaymentMethodSelector } from '@/components/buyer/billing/PaymentMethodSelector';
import { MockPaymentDialog } from '@/components/buyer/billing/MockPaymentDialog';

export default function BuyerCheckout() {
  const navigate = useNavigate();
  const {
    plans,
    selectedPlanId,
    completeMockPayment,
    failMockPayment
  } = useBuyerStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockDialog, setShowMockDialog] = useState(false);

  const plan = plans.find(p => p.id === selectedPlanId);

  useEffect(() => {
    if (!plan) {
      navigate('/buyer/subscription', { replace: true });
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const handlePay = () => {
    if (!selectedMethodId) return; // Add validation UI if needed
    setIsProcessing(true);
    // Simulate loading briefly before showing the mock dialog
    setTimeout(() => {
      setIsProcessing(false);
      setShowMockDialog(true);
    }, 800);
  };

  const handleSimulateSuccess = () => {
    setShowMockDialog(false);
    completeMockPayment(plan.id, billingCycle);
    navigate('/buyer/payment-result?status=success');
  };

  const handleSimulateFailure = () => {
    setShowMockDialog(false);
    failMockPayment();
    navigate('/buyer/payment-result?status=failure');
  };

  return (
    <>
      <Seo title="Checkout" description="Complete your subscription purchase." />

      <div className="w-full space-y-8">
        <Button variant="ghost" onClick={() => navigate('/buyer/subscription')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
        </Button>

        <BuyerPageHeader
          title="Checkout"
          description="Review your plan and complete your mock payment."
          breadcrumbs={[{ label: 'Subscription', href: '/buyer/subscription' }, { label: 'Checkout' }]}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50 flex items-start gap-3 text-yellow-800 dark:text-yellow-200">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Mock Checkout Environment</h3>
            <p className="text-sm">
              This checkout is for demonstration purposes only. No real charges will be applied.
              Please select a mock payment method and proceed to simulate a success or failure outcome.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold border-b pb-4">1. Billing Cycle</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    billingCycle === 'monthly' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  <div className="font-semibold mb-1">Monthly Billing</div>
                  <div className="text-sm text-muted-foreground">${plan.price}/mo</div>
                </button>
                <button
                  type="button"
                  className={`p-4 rounded-lg border text-left transition-colors relative ${
                    billingCycle === 'yearly' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  <div className="absolute -top-3 right-4 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-green-200">
                    Save 17%
                  </div>
                  <div className="font-semibold mb-1">Yearly Billing</div>
                  <div className="text-sm text-muted-foreground">${plan.price * 10}/yr (Billed annually)</div>
                </button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-bold border-b pb-4 mb-6">2. Payment Details</h2>
              <PaymentMethodSelector
                selectedMethodId={selectedMethodId}
                onSelect={setSelectedMethodId}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              plan={plan}
              billingCycle={billingCycle}
              onPay={handlePay}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      <MockPaymentDialog
        open={showMockDialog}
        onOpenChange={setShowMockDialog}
        plan={plan}
        billingCycle={billingCycle}
        onSimulateSuccess={handleSimulateSuccess}
        onSimulateFailure={handleSimulateFailure}
      />
    </>
  );
}
