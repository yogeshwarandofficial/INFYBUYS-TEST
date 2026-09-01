import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { useBuyerStore } from '@/store/useBuyerStore';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subscription, plans } = useBuyerStore();

  const status = searchParams.get('status');

  useEffect(() => {
    if (!status || (status !== 'success' && status !== 'failure')) {
      navigate('/buyer/subscription', { replace: true });
    }
  }, [status, navigate]);

  if (!status) return null;

  const isSuccess = status === 'success';
  const plan = subscription ? plans.find(p => p.id === subscription.planId) : null;

  return (
    <>
      <Seo title={isSuccess ? "Payment Successful" : "Payment Failed"} />

      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isSuccess
              ? `Your subscription to the ${plan?.name || ''} plan is now active. Thank you for your purchase.`
              : 'We were unable to process your payment. Please try again with a different payment method.'
            }
          </p>
        </div>

        {isSuccess && subscription && (
          <div className="bg-muted/50 border rounded-lg p-6 max-w-sm mx-auto text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium">${subscription.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{plan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Renewal Date</span>
              <span className="font-medium">{new Date(subscription.renewalDate || '').toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isSuccess ? (
            <>
              <Button asChild size="lg">
                <Link to="/buyer/subscription">
                  View Subscription
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/buyer/billing">View Billing History</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg">
                <Link to="/buyer/checkout">
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/buyer/subscription">Cancel</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
