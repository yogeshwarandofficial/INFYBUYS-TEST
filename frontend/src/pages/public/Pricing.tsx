import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { PRICING } from '@/constants/marketing';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router';

export default function Pricing() {
  return (
    <>
      <Seo
        title="Pricing & Fees"
        description="Transparent pricing for buyers and sellers on InfyBuys."
      />

      <PageHeader
        title="Transparent Pricing"
        description="No hidden fees. No surprises. Just straightforward pricing designed to align our incentives with your success."
        breadcrumbs={[{ label: 'Pricing' }]}
      />

      <div className="container mx-auto px-4 py-16">

        {/* Buyer Pricing */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">For Buyers</h2>
            <p className="text-muted-foreground mt-2">Choose the plan that fits your acquisition goals.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PRICING.buyer.map((plan, index) => (
              <Card key={index} className={`relative flex flex-col ${plan.isPopular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.plan}</CardTitle>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    {plan.price}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <Check className="w-5 h-5 text-success mr-2 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={plan.isPopular ? 'default' : 'outline'} className="w-full" asChild>
                    <Link to="/register">{plan.isPopular ? 'Upgrade to Premium' : 'Create Free Account'}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Seller Pricing */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">For Sellers</h2>
            <p className="text-muted-foreground mt-2">Free to list. We only succeed when you do.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 border-b font-semibold text-sm uppercase tracking-wider">
              <div>Transaction Size</div>
              <div>Success Fee</div>
              <div className="hidden sm:block">Description</div>
            </div>
            {PRICING.seller.map((tier, index) => (
              <div key={index} className="grid grid-cols-3 p-4 border-b last:border-0 items-center">
                <div className="font-medium">{tier.range}</div>
                <div className="text-2xl font-bold text-primary">{tier.fee}</div>
                <div className="hidden sm:block text-muted-foreground text-sm">{tier.description}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/sell">Get a Free Valuation</Link>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
