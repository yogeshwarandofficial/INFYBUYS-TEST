import { Seo } from '@/components/shared/Seo';
import { motion } from 'framer-motion';
import { PRICING } from '@/constants/marketing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

      {/* Pricing Page Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[600px] flex items-center justify-center pt-32 lg:pt-40 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Business financial planning" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Subtle Blue/White Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/20"></div>
        
        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              SIMPLE & TRANSPARENT PRICING
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Choose the Right Plan <br className="hidden md:block"/>for Your Business Journey
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Flexible plans designed for buyers and sellers to discover opportunities, list businesses, and grow with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="bg-slate-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Pricing Cards */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PRICING.plans.map((plan, index) => (
                <Card key={index} className={`relative flex flex-col rounded-2xl overflow-hidden bg-white ${plan.isPopular ? 'border-primary shadow-xl scale-100 lg:scale-105 z-10' : 'border-border shadow-sm mt-0 lg:mt-4 mb-0 lg:mb-4'}`}>
                  {plan.isPopular && (
                    <div className="mt-[-24px] bg-primary text-primary-foreground py-4 text-xs font-extrabold uppercase tracking-wider text-center">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl text-slate-500 font-medium">{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-5xl font-extrabold text-[#0B152A]">{plan.price}</span>
                      <span className="ml-2 text-slate-500 font-medium">/ {plan.period}</span>
                    </div>
                    <p className="text-slate-600 mt-4 text-sm min-h-[40px] leading-relaxed">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 p-8 pt-4">
                    <Button variant={plan.isPopular ? 'default' : 'outline'} className="w-full mb-8 h-12 text-base rounded-xl font-bold" asChild>
                      <Link to="/register">{plan.ctaText}</Link>
                    </Button>
                    <ul className="space-y-4">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-slate-700 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0B152A]">Compare Plans</h2>
              <p className="text-slate-600 mt-3 text-lg">See exactly what's included in each tier.</p>
            </div>
            
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b">
                    <th className="p-6 font-semibold text-slate-900 w-2/5 text-lg">Feature</th>
                    <th className="p-6 font-semibold text-slate-900 text-center w-1/5 text-lg">Buyer Plan</th>
                    <th className="p-6 font-bold text-primary text-center w-1/5 text-lg">Professional</th>
                    <th className="p-6 font-semibold text-slate-900 text-center w-1/5 text-lg">Business Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.comparison.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 text-slate-700 font-medium">{row.feature}</td>
                      <td className="p-6 text-center">
                        {row.buyer ? <Check className="w-5 h-5 text-primary mx-auto" /> : <div className="w-4 h-0.5 bg-slate-300 mx-auto rounded-full"></div>}
                      </td>
                      <td className="p-6 text-center">
                        {row.professional ? <Check className="w-5 h-5 text-primary mx-auto" /> : <div className="w-4 h-0.5 bg-slate-300 mx-auto rounded-full"></div>}
                      </td>
                      <td className="p-6 text-center">
                        {row.business ? <Check className="w-5 h-5 text-primary mx-auto" /> : <div className="w-4 h-0.5 bg-slate-300 mx-auto rounded-full"></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
