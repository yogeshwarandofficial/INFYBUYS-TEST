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
      "flex flex-col relative transition-all duration-300 bg-white/85 backdrop-blur-md border border-[#DCE5F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden",
      plan.popular && "border-indigo-200/60 bg-indigo-50/20 shadow-md shadow-indigo-900/10 scale-[1.02]",
      isCurrent && !plan.popular && "border-blue-200 bg-blue-50/50",
      className
    )}>
      {plan.popular && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#4F46E5]" />
      )}
      
      {plan.popular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-indigo-100 text-[#4F46E5] hover:bg-indigo-100 border-0 shadow-none font-semibold px-3 uppercase tracking-widest text-[10px]">
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrent && !plan.popular && (
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="border-blue-200 text-[#2563EB] bg-blue-50/50">Current Plan</Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <h3 className="font-bold text-xl text-[#0F172A]">{plan.name}</h3>
        <p className="text-[13px] text-[#64748B] min-h-[40px] mt-1">{plan.description}</p>
        <div className="mt-4 flex items-baseline text-3xl font-bold text-[#0F172A]">
          ${plan.price}
          <span className={cn("ml-1 text-[13px] font-medium", plan.popular ? "text-[#4F46E5]" : "text-[#2563EB]")}>
            / {plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-5">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Limits</h4>
            <ul className="text-[13px] space-y-3 text-[#475569]">
              <li className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>
                  {plan.limits.savedSearches === -1 ? 'Unlimited' : plan.limits.savedSearches} Saved Searches
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>
                  {plan.limits.enquiries === -1 ? 'Unlimited' : plan.limits.enquiries} Enquiries
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>{plan.limits.ndaAccess ? 'NDA Access included' : 'No NDA Access'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>{plan.limits.messaging ? 'Direct Messaging included' : 'No Direct Messaging'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-5 border-t border-[#E2E8F0]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Features</h4>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className={cn("h-4 w-4 shrink-0 mt-0.5 mr-2.5", plan.popular ? "text-[#4F46E5]" : "text-[#2563EB]")} />
                  <span className="text-[13px] text-[#475569]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className={cn(
            "w-full h-11 rounded-xl font-medium transition-all shadow-sm",
            isCurrent 
              ? "bg-slate-100 text-[#64748B] hover:bg-slate-100 opacity-70" 
              : plan.popular 
                ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:brightness-110 text-white shadow-blue-900/20 hover:shadow-md hover:-translate-y-0.5" 
                : "bg-white border border-[#DCE5F2] text-[#0F172A] hover:bg-slate-50"
          )}
          variant={isCurrent ? "outline" : plan.popular ? "default" : "secondary"}
          onClick={onSelect}
          disabled={isCurrent}
        >
          {isCurrent ? 'Current Plan' : isActive ? 'Downgrade' : 'Upgrade'}
        </Button>
      </CardFooter>
    </Card>
  );
}
