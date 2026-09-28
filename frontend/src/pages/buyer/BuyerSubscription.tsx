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

      <div className="w-full space-y-8 max-w-6xl mx-auto px-6 xl:px-8 py-8 mt-4">
        <BuyerPageHeader
          title="Subscription & Limits"
          description="Manage your current plan, view usage limits, and upgrade to unlock more features."
        />

        {/* Current Plan Overview & Billing Support */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 relative overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200/75 shadow-sm rounded-[24px]">
            {subscription?.status === 'cancelled' && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500" />
            )}
            {subscription?.status === 'ACTIVE' && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600" />
            )}
            <CardHeader className="pb-4 pt-7 px-7">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Plan</div>
                  <CardTitle className="text-3xl font-extrabold flex items-center gap-3 text-slate-900 tracking-tight">
                    {activePlan.name} {activePlan.name.toLowerCase().includes('plan') ? '' : 'Plan'}
                    {subscription?.status === 'ACTIVE' && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 shadow-sm px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]">Active</Badge>}
                    {subscription?.status === 'CANCELLED' && <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border border-red-200 shadow-sm px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]">Cancels on {subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-2 text-slate-500 font-medium text-[15px]">
                    {subscription?.status === 'ACTIVE' && (subscription?.startDate || subscription?.createdAt)
                      ? `Started on ${new Date(subscription.startDate || subscription.createdAt).toLocaleDateString()}`
                      : 'You are currently on the free tier.'}
                  </CardDescription>
                </div>
                <div className="text-right bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm min-w-[120px]">
                  <div className="text-3xl font-extrabold text-slate-900">${activePlan.price}</div>
                  <div className="text-[13px] text-slate-500 font-bold uppercase tracking-wider mt-1">/ {subscription?.billingCycle || 'month'}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-7 pb-7">
              {subscription && subscription.status === 'ACTIVE' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/80 gap-4 mt-2">
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Next billing date</div>
                    <div className="text-slate-900 font-extrabold text-[15px] mt-1">{subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => setIsCancelDialogOpen(true)} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl h-10 px-5 font-bold shadow-sm">
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              )}

              {subscription && subscription.status === 'CANCELLED' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-red-50/50 rounded-2xl border border-red-100 gap-4 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-extrabold text-red-900 text-[15px]">Subscription Cancelled</div>
                      <div className="text-red-700 font-medium text-[13px] mt-1 max-w-md leading-relaxed">
                        Your subscription has been cancelled and you will lose access at the end of your billing cycle.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!subscription && (
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-[14px] font-medium text-blue-900 leading-relaxed">
                      Upgrade to Professional to unlock unlimited enquiries, direct messaging, and NDA access.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white/90 backdrop-blur-xl border border-slate-200/75 shadow-sm rounded-[24px] flex flex-col">
            <CardHeader className="pb-2 pt-7 px-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quick Links</div>
              <CardTitle className="text-xl font-extrabold text-slate-900 tracking-tight">Billing & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col px-6 pb-6 pt-4">
              <Button variant="outline" className="w-full justify-between h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm" asChild>
                <Link to="/buyer/billing">
                  Billing History
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm" asChild>
                <Link to="/buyer/billing">
                  Payment Methods
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </Button>
              <div className="pt-6 border-t border-slate-100 mt-auto">
                <p className="text-[13px] text-slate-500 mb-2 font-medium">Need help with your plan?</p>
                <Button variant="link" className="p-0 h-auto text-blue-600 font-bold hover:text-blue-700">Contact Support &rarr;</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Dashboard */}
        <div className="pt-2">
          <div className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Usage</h2>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Track your plan limits</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[20px] overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-[12px] flex items-center justify-center border border-blue-100">
                    <Search className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-[14px]">Searches</h4>
                </div>
                <div className="flex items-end justify-between mb-3">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {searchesLimit === -1 ? 'Unlimited' : savedCount}
                  </div>
                  {searchesLimit !== -1 && (
                    <div className="text-[13px] font-bold text-slate-400 mb-1">/ {searchesLimit}</div>
                  )}
                </div>
                {searchesLimit !== -1 && (
                  <Progress value={searchesPercent} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600" />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[20px] overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[12px] flex items-center justify-center border border-indigo-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-[14px]">Enquiries</h4>
                </div>
                <div className="flex items-end justify-between mb-3">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {enquiriesLimit === -1 ? 'Unlimited' : enquiryCount}
                  </div>
                  {enquiriesLimit !== -1 && (
                    <div className="text-[13px] font-bold text-slate-400 mb-1">/ {enquiriesLimit}</div>
                  )}
                </div>
                {enquiriesLimit !== -1 && (
                  <Progress value={enquiriesPercent} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-600" />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[20px] overflow-hidden relative">
              {!activePlan.featureLimits?.ndaAccess && <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold">Upgrade required</Badge></div>}
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[12px] flex items-center justify-center border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-[14px]">NDA Access</h4>
                </div>
                <div className="flex items-end mb-3">
                  <div className="text-xl font-extrabold text-slate-900">
                    {activePlan.featureLimits?.ndaAccess ? 'Included' : 'Locked'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[20px] overflow-hidden relative">
              {!activePlan.featureLimits?.messaging && <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold">Upgrade required</Badge></div>}
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-[12px] flex items-center justify-center border border-purple-100">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-[14px]">Messaging</h4>
                </div>
                <div className="flex items-end mb-3">
                  <div className="text-xl font-extrabold text-slate-900">
                    {activePlan.featureLimits?.messaging ? 'Included' : 'Locked'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Plans */}
        <div className="pt-8">
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Choose Your Plan</h2>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upgrade your limits</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
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

        {/* Subscription History */}
        <div className="pt-12 pb-12">
          <div className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billing Logs</h2>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Subscription History</h3>
          </div>
          <Card className="bg-white border border-slate-200/60 shadow-sm rounded-[24px] overflow-hidden">
            <CardContent className="p-0">
              {subscriptionHistory.length === 0 ? (
                <div className="p-10 text-center text-slate-500 font-medium text-[15px]">No subscription history found.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {subscriptionHistory.slice(0, 5).map((historyItem: any) => (
                    <div key={historyItem.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-extrabold text-slate-900">{historyItem.plan?.name || 'Unknown Plan'}</span>
                          <Badge variant={historyItem.status === 'ACTIVE' ? 'default' : 'secondary'} className={historyItem.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 shadow-none px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold' : 'px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold'}>
                            {historyItem.status}
                          </Badge>
                        </div>
                        <div className="text-[13px] font-medium text-slate-500">
                          {new Date(historyItem.startDate || historyItem.createdAt).toLocaleDateString()} &rarr; {historyItem.renewalDate ? new Date(historyItem.renewalDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="text-right flex sm:block items-center justify-between sm:justify-end">
                        <div className="font-extrabold text-slate-900 text-[16px]">${historyItem.plan?.price || 0}</div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">{historyItem.plan?.billingCycle || 'MONTHLY'}</div>
                      </div>
                    </div>
                  ))}
                  {subscriptionHistory.length > 5 && (
                    <div className="p-4 text-center bg-slate-50/50 border-t border-slate-100">
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50/50 rounded-xl h-9 px-6">
                        View More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
