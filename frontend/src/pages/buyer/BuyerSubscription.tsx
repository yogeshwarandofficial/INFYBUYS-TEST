import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { BuyerPageHeader } from '@/components/buyer/BuyerPageHeader';
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
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
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
      setSubscriptionHistory(meRes?.history || []);
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

      <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
        <BuyerPageHeader
          title="Subscription & Limits"
          description="Manage your current plan, view usage limits, and upgrade to unlock more features."
          // breadcrumbs={[{ label: 'Subscription' }]}
        />

        {/* Current Plan Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 relative overflow-hidden bg-white/85 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-2xl">
            {subscription?.status === 'cancelled' && (
              <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
            )}
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3 text-[#0F172A]">
                    {activePlan.name} {activePlan.name.toLowerCase().includes('plan') ? '' : 'Plan'}
                    {subscription?.status === 'ACTIVE' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 shadow-none dark:bg-green-900/30 dark:text-green-500">Active</Badge>}
                    {subscription?.status === 'CANCELLED' && <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 shadow-none">Cancels on {subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1 text-[#64748B]">
                    {subscription?.status === 'ACTIVE' && (subscription?.startDate || subscription?.createdAt)
                      ? `Started on ${new Date(subscription.startDate || subscription.createdAt).toLocaleDateString()}`
                      : 'You are currently on the free tier.'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#0F172A]">${activePlan.price}</div>
                  <div className="text-[13px] text-[#64748B] font-medium">/ {subscription?.billingCycle || 'month'}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscription && subscription.status === 'ACTIVE' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white/50 rounded-xl border border-[#E2E8F0] gap-4">
                  <div>
                    <div className="font-medium text-[13px] text-[#64748B]">Next billing date</div>
                    <div className="text-[#0F172A] font-semibold text-sm mt-0.5">{subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => setIsCancelDialogOpen(true)} className="border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg bg-white/50 hover:bg-white/80">
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              )}

              {subscription && subscription.status === 'CANCELLED' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-red-50/50 rounded-xl border border-red-100 gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-700 text-[15px]">Subscription Cancelled</div>
                      <div className="text-red-600/80 text-[13px] mt-1 max-w-md leading-relaxed">
                        Your subscription has been cancelled and you will lose access at the end of your billing cycle.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!subscription && (
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 mt-2">
                  <p className="text-[15px] text-[#334155] leading-relaxed flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    Upgrade to Professional to unlock unlimited enquiries, direct messaging, and NDA access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white/85 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-2xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-[#0F172A]">Billing & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <Button variant="outline" className="w-full justify-between h-11 border-[#E2E8F0] text-[#334155] hover:bg-slate-50/50 rounded-xl" asChild>
                <Link to="/buyer/billing">
                  View Billing History
                  <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between h-11 border-[#E2E8F0] text-[#334155] hover:bg-slate-50/50 rounded-xl" asChild>
                <Link to="/buyer/billing">
                  Payment Methods
                  <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                </Link>
              </Button>
              <div className="pt-6 border-t border-[#E2E8F0] mt-auto">
                <p className="text-[13px] text-[#64748B] mb-2 font-medium">Need help with your plan?</p>
                <Button variant="link" className="p-0 h-auto text-[#2563EB] font-medium hover:text-[#1D4ED8]">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage & Limits */}
        <div className="pt-6">
          <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Current Usage</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm shadow-blue-900/5 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-indigo-50/80 text-[#4F46E5] rounded-xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#475569] bg-green-200 px-2.5 py-1 rounded-md">
                    {searchesLimit === -1 ? 'Unlimited' : `${savedCount} / ${searchesLimit}`}
                  </span>
                </div>
                <h4 className="font-bold text-[#0F172A] mb-3">Saved Searches</h4>
                {searchesLimit !== -1 && (
                  <Progress value={searchesPercent} className="h-2 bg-slate-100 [&>div]:bg-[#2563EB]" />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm shadow-blue-900/5 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-indigo-50/80 text-[#4F46E5] rounded-xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#475569] bg-green-200 px-2.5 py-1 rounded-md">
                    {enquiriesLimit === -1 ? 'Unlimited' : `${enquiryCount} / ${enquiriesLimit}`}
                  </span>
                </div>
                <h4 className="font-bold text-[#0F172A] mb-3">Enquiries</h4>
                {enquiriesLimit !== -1 && (
                  <Progress value={enquiriesPercent} className="h-2 bg-slate-100 [&>div]:bg-[#4F46E5]" />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm shadow-blue-900/5 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-indigo-50/80 text-[#4F46E5] rounded-xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {activePlan.featureLimits?.ndaAccess && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" />
                  )}
                </div>
                <h4 className="font-bold text-[#0F172A] mb-1.5">NDA Access</h4>
                <p className="text-[13px] text-[#64748B] font-medium">
                  {activePlan.featureLimits?.ndaAccess ? 'Included in your plan' : 'Requires Professional plan'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm shadow-blue-900/5 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-indigo-50/80 text-[#4F46E5] rounded-xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  {activePlan.featureLimits?.messaging && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" />
                  )}
                </div>
                <h4 className="font-bold text-[#0F172A] mb-1.5">Direct Messaging</h4>
                <p className="text-[13px] text-[#64748B] font-medium">
                  {activePlan.featureLimits?.messaging ? 'Included in your plan' : 'Requires Professional plan'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscription History */}
        <div className="pt-8">
          <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Subscription History</h2>
          <Card className="bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {subscriptionHistory.length === 0 ? (
                <div className="p-6 text-center text-[#64748B] text-sm">No subscription history found.</div>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {subscriptionHistory.slice(0, 5).map((historyItem: any) => (
                    <div key={historyItem.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#0F172A]">{historyItem.plan?.name || 'Unknown Plan'}</span>
                          <Badge variant={historyItem.status === 'ACTIVE' ? 'default' : 'secondary'} className={historyItem.status === 'ACTIVE' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-0 shadow-none dark:bg-green-900/30 dark:text-green-500' : ''}>
                            {historyItem.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-[#64748B]">
                          {new Date(historyItem.startDate || historyItem.createdAt).toLocaleDateString()} &rarr; {historyItem.renewalDate ? new Date(historyItem.renewalDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="text-right flex sm:block items-center justify-between sm:justify-end">
                        <div className="font-medium text-[#0F172A]">${historyItem.plan?.price || 0}</div>
                        <div className="text-[12px] text-[#64748B]">{historyItem.plan?.billingCycle || 'MONTHLY'}</div>
                      </div>
                    </div>
                  ))}
                  {subscriptionHistory.length > 5 && (
                    <div className="p-4 text-center bg-slate-50/50">
                      <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1D4ED8] hover:bg-blue-50/50">
                        View More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Plans */}
        <div className="pt-8 pb-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3 text-[#0F172A]">Available Plans</h2>
            <p className="text-[15px] text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Upgrade to unlock unlimited access, direct messaging, and advanced buyer tools.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
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
