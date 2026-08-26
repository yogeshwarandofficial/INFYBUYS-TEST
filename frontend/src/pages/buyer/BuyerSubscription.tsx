import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { useBuyerStore } from '@/store/useBuyerStore';
import { SubscriptionPlanCard } from '@/components/buyer/billing/SubscriptionPlanCard';
import { CancelSubscriptionDialog } from '@/components/buyer/billing/CancelSubscriptionDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, MessageSquare, Search, FileText } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { apiClient } from '@/services/apiClient';
import { useUserStore } from '@/store/useUserStore';
import { authService } from '@/services/auth.service';

export default function BuyerSubscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const {
    savedCount,
    enquiryCount
  } = useBuyerStore();

  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [plansRes, meRes] = await Promise.all([
        apiClient.get<any[]>('/subscriptions/plans'),
        apiClient.get<any>('/subscriptions/me')
      ]);
      const formattedPlans = (Array.isArray(plansRes) ? plansRes : []).map((p: any) => ({
        ...p,
        description: p.name === 'Free' ? 'Basic access to marketplace' : 'Full access to all features',
        features: p.name === 'Free' ? ['Basic search', 'View public listings'] : ['Unlimited searches', 'Direct messaging', 'NDA access'],
        popular: p.name === 'Professional',
      }));
      setPlans(formattedPlans);
      setSubscription(meRes?.subscription || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fallbackPlan = { name: 'Free', price: 0, billingCycle: 'MONTHLY', featureLimits: {} };
  const activePlan = (subscription && subscription.status === 'ACTIVE')
    ? (plans.find(p => p.id === subscription.planId) || fallbackPlan)
    : fallbackPlan;

  const handleSubscribe = async (planId: string) => {
    try {
      await apiClient.post('/subscriptions/subscribe', { planId });
      const updatedUser = await authService.getCurrentUser();
      useUserStore.getState().setUser(updatedUser, useUserStore.getState().token || undefined);
      await fetchSubscriptionData();
      if (returnTo) {
        navigate(returnTo);
      }
    } catch (err: any) {
      alert(err.message || 'Subscription failed');
    } finally {
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await apiClient.post('/subscriptions/cancel', {});
      const updatedUser = await authService.getCurrentUser();
      useUserStore.getState().setUser(updatedUser, useUserStore.getState().token || undefined);
      setIsCancelDialogOpen(false);
      await fetchSubscriptionData();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading subscription plans...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Unable to load subscription plans: {error}</div>;
  }

  // Usage calculations
  const searchesLimit = activePlan.featureLimits?.savedSearches ?? -1;
  const enquiriesLimit = activePlan.featureLimits?.enquiries ?? -1;

  const searchesPercent = searchesLimit === -1 ? 0 : Math.min(100, (savedCount / searchesLimit) * 100);
  const enquiriesPercent = enquiriesLimit === -1 ? 0 : Math.min(100, (enquiryCount / enquiriesLimit) * 100);

  return (
    <>
      <Seo title="Subscription & Limits" description="Manage your InfyBuys subscription plan and limits." />

      <div className="max-w-6xl mx-auto space-y-8">
        <PageHeader
          title="Subscription & Limits"
          description="Manage your current plan, view usage limits, and upgrade to unlock more features."
          breadcrumbs={[{ label: 'Subscription' }]}
        />

        {/* Current Plan Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 relative overflow-hidden">
            {subscription?.status === 'cancelled' && (
              <div className="absolute top-0 inset-x-0 h-1 bg-destructive" />
            )}
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    {activePlan.name} {activePlan.name.toLowerCase().includes('plan') ? '' : 'Plan'}
                    {subscription?.status === 'ACTIVE' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 shadow-none dark:bg-green-900/30 dark:text-green-500">Active</Badge>}
                    {subscription?.status === 'CANCELLED' && <Badge variant="destructive">Cancels on {subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subscription?.status === 'ACTIVE' && (subscription?.startDate || subscription?.createdAt)
                      ? `Started on ${new Date(subscription.startDate || subscription.createdAt).toLocaleDateString()}`
                      : 'You are currently on the free tier.'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${activePlan.price}</div>
                  <div className="text-sm text-muted-foreground">/ {subscription?.billingCycle || 'month'}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscription && subscription.status === 'ACTIVE' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg border gap-4">
                  <div>
                    <div className="font-medium text-sm">Next billing date</div>
                    <div className="text-muted-foreground text-sm">{subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => setIsCancelDialogOpen(true)}>
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              )}

              {subscription && subscription.status === 'CANCELLED' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20 gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-destructive text-sm">Subscription Cancelled</div>
                      <div className="text-destructive/80 text-sm mt-1 max-w-md">
                        Your subscription has been cancelled and you will lose access at the end of your billing cycle.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!subscription && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Professional to unlock unlimited enquiries, direct messaging, and NDA access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/buyer/billing">
                  View Billing History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/buyer/billing">
                  Payment Methods
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Need help with your plan?</p>
                <Button variant="link" className="p-0 h-auto text-primary">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage & Limits */}
        <div>
          <h2 className="text-xl font-bold mb-4">Current Usage</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {searchesLimit === -1 ? 'Unlimited' : `${savedCount} / ${searchesLimit}`}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">Saved Searches</h4>
                {searchesLimit !== -1 && (
                  <Progress value={searchesPercent} className="h-2" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {enquiriesLimit === -1 ? 'Unlimited' : `${enquiryCount} / ${enquiriesLimit}`}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">Enquiries</h4>
                {enquiriesLimit !== -1 && (
                  <Progress value={enquiriesPercent} className="h-2" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activePlan.featureLimits?.ndaAccess ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {activePlan.featureLimits?.ndaAccess && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <h4 className="font-semibold mb-1">NDA Access</h4>
                <p className="text-xs text-muted-foreground">
                  {activePlan.featureLimits?.ndaAccess ? 'Included in your plan' : 'Requires Professional plan'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activePlan.featureLimits?.messaging ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  {activePlan.featureLimits?.messaging && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <h4 className="font-semibold mb-1">Direct Messaging</h4>
                <p className="text-xs text-muted-foreground">
                  {activePlan.featureLimits?.messaging ? 'Included in your plan' : 'Requires Professional plan'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Available Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upgrade to unlock unlimited access, direct messaging, and advanced buyer tools.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {plans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={{...plan, limits: plan.featureLimits}}
                isCurrent={plan.id === activePlan.id && subscription?.status === 'ACTIVE'}
                isActive={subscription?.status === 'ACTIVE'}
                onSelect={() => handleSubscribe(plan.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <CancelSubscriptionDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        subscription={subscription}
        onConfirm={handleCancelSubscription}
      />
    </>
  );
}
