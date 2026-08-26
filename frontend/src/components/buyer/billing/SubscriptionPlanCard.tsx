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
      "flex flex-col relative transition-all duration-200",
      plan.popular && "border-primary shadow-md scale-[1.02]",
      isCurrent && "border-primary/50 bg-primary/5",
      className
    )}>
      {plan.popular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <Badge className="bg-primary text-primary-foreground font-semibold px-3 uppercase tracking-widest text-[10px]">
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrent && (
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="border-primary text-primary">Current Plan</Badge>
        </div>
      )}

      <CardHeader>
        <h3 className="font-bold text-xl">{plan.name}</h3>
        <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>
        <div className="mt-4 flex items-baseline text-3xl font-bold">
          ${plan.price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / {plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Limits</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  {plan.limits.savedSearches === -1 ? 'Unlimited' : plan.limits.savedSearches} Saved Searches
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  {plan.limits.enquiries === -1 ? 'Unlimited' : plan.limits.enquiries} Enquiries
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{plan.limits.ndaAccess ? 'NDA Access included' : 'No NDA Access'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{plan.limits.messaging ? 'Direct Messaging included' : 'No Direct Messaging'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-2" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
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
