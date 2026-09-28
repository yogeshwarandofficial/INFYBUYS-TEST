import { Check, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionPlan } from '@/store/useBuyerStore';
import { cn } from '@/lib/utils';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isActive?: boolean;
  isCurrent?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function SubscriptionPlanCard({
  plan,
  isActive,
  isCurrent,
  onSelect,
  className
}: SubscriptionPlanCardProps) {
  return (
    <Card className={cn(
      "flex flex-col relative transition-all duration-300 bg-white border border-slate-200/60 shadow-sm rounded-[24px] overflow-hidden",
      plan.popular && "border-blue-200/80 shadow-[0_8px_30px_rgb(37,99,235,0.06)] ring-1 ring-blue-100",
      isCurrent && !plan.popular && "border-slate-200/80 bg-slate-50/30",
      className
    )}>
      {plan.popular && (
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
      )}
      
      {plan.popular && (
        <div className="absolute top-6 right-6">
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm font-extrabold px-3 py-1 uppercase tracking-widest text-[10px] rounded-lg">
            Recommended
          </Badge>
        </div>
      )}

      {isCurrent && !plan.popular && (
        <div className="absolute top-6 right-6">
          <Badge variant="outline" className="border-slate-200 text-slate-500 bg-white font-bold px-3 py-1 shadow-sm rounded-lg">Current Plan</Badge>
        </div>
      )}

      <CardHeader className="pb-6 pt-8 px-8">
        <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{plan.name}</h3>
        <p className="text-[14px] text-slate-500 font-medium min-h-[40px] mt-2">{plan.description}</p>
        <div className="mt-6 flex items-end">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">${plan.price}</span>
          <span className="ml-1.5 text-[15px] font-bold text-slate-400 mb-1">
            / {plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-8 pb-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Plan Limits</h4>
            <ul className="text-[14px] space-y-3.5 font-medium text-slate-700">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
                <span>
                  {plan.limits.savedSearches === -1 ? 'Unlimited' : plan.limits.savedSearches} Saved Searches
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
                <span>
                  {plan.limits.enquiries === -1 ? 'Unlimited' : plan.limits.enquiries} Enquiries
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
                <span>{plan.limits.ndaAccess ? 'NDA Access included' : 'No NDA Access'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
                <span>{plan.limits.messaging ? 'Direct Messaging included' : 'No Direct Messaging'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100/80">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included Features</h4>
            <ul className="space-y-3.5">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3 mt-0.5", plan.popular ? "bg-blue-100" : "bg-slate-100")}>
                    <Check className={cn("h-3 w-3", plan.popular ? "text-blue-600 font-bold" : "text-slate-600")} strokeWidth={3} />
                  </div>
                  <span className="text-[14px] font-medium text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-0">
        <Button
          className={cn(
            "w-full h-12 rounded-xl text-[15px] font-bold transition-all",
            isCurrent 
              ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border-none shadow-none" 
              : plan.popular 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
          )}
          variant={isCurrent ? "secondary" : plan.popular ? "default" : "outline"}
          onClick={onSelect}
          disabled={isCurrent}
        >
          {isCurrent ? 'Current Plan' : isActive ? 'Downgrade' : 'Upgrade Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
