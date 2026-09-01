import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';
import { 
  Calculator, 
  Cloud, 
  ShoppingCart, 
  Globe, 
  Layers, 
  Target, 
  TrendingUp, 
  Repeat, 
  Users, 
  BarChart, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Guides() {
  return (
    <>
      <Seo
        title="Valuation Guides - InfyBuys"
        description="Learn how to accurately value online businesses, SaaS, e-commerce, and digital assets with our comprehensive valuation guides."
      />
      
      {/* 1. EXISTING / GUIDES HERO */}
      <section className="relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Business valuation and digital asset analysis" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/10"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              VALUATION GUIDES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Know the Value of Your Digital Business
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Practical valuation guides to help buyers and sellers understand the value of online businesses, SaaS companies, e-commerce stores, websites, and digital assets.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A] mb-6">
            Understand What Your Business Is Worth
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Learn how buyers and sellers evaluate online businesses using financial performance, growth potential, recurring revenue, customer strength, and other important value drivers.
          </p>
        </div>
      </section>

      {/* 3. Valuation Guides Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Calculator className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">How to Value an Online Business</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain the key factors buyers and sellers should consider when estimating the value of an online business.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Cloud className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">SaaS Business Valuation</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain recurring revenue, profitability, retention, growth rate, customer metrics, and business stability.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <ShoppingCart className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">E-Commerce Business Valuation</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain revenue, profit margins, customer acquisition, repeat customers, inventory, and operational strength.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Globe className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">Website & Digital Asset Valuation</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain traffic, revenue, monetization, audience quality, content, technology, and growth potential.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Layers className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">Understanding Valuation Multiples</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain how buyers may use revenue, earnings, and relevant market multiples when evaluating businesses.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Target className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3">Business Value Drivers</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain the factors that can increase or decrease the value of an online business.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. What Affects Business Value? */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A] mb-4">
              What Affects Business Value?
            </h2>
            <p className="text-slate-600 text-lg">
              The primary factors that buyers analyze to determine the market worth of an online business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { title: "Revenue & Profitability", icon: TrendingUp },
              { title: "Recurring Revenue", icon: Repeat },
              { title: "Growth Rate", icon: BarChart },
              { title: "Customer Retention", icon: Users },
              { title: "Traffic & Audience Quality", icon: Globe },
              { title: "Owner Dependence", icon: Target },
              { title: "Business Operations", icon: Layers },
              { title: "Brand Strength", icon: ShieldCheck },
              { title: "Market Opportunity", icon: Target },
              { title: "Risk & Stability", icon: ShieldCheck }
            ].map((factor, idx) => (
              <div key={idx} className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-[#0B4C8C]/30 hover:bg-[#0B4C8C]/5 transition-colors duration-300 group">
                <factor.icon className="w-8 h-8 text-[#0B4C8C] mb-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-bold text-[#0B152A] text-sm md:text-base">{factor.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 & 6. Checklists */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Buyer Checklist */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs uppercase mb-2 block">For Buyers</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B152A]">
                  What Should Buyers Look At?
                </h2>
              </div>
              <ul className="space-y-5">
                {[
                  "Revenue consistency",
                  "Profitability",
                  "Revenue sources",
                  "Customer concentration",
                  "Traffic sources",
                  "Growth trends",
                  "Operating costs",
                  "Owner involvement",
                  "Recurring revenue",
                  "Business risks",
                  "Supporting financial records"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#0B4C8C] shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Checklist */}
            <div className="bg-[#0B152A] rounded-3xl p-8 md:p-12 shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-8 border-b border-slate-800 pb-6">
                  <span className="text-blue-400 font-extrabold tracking-widest text-xs uppercase mb-2 block">For Sellers</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    Preparing Your Business for Valuation
                  </h2>
                </div>
                <ul className="space-y-5">
                  {[
                    "Organize financial records",
                    "Review revenue and profit trends",
                    "Document business operations",
                    "Reduce unnecessary owner dependency",
                    "Demonstrate customer retention",
                    "Highlight growth opportunities",
                    "Prepare important business documentation",
                    "Clearly present the business model"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#0B4C8C]/30 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#0B4C8C]/10 blur-3xl pointer-events-none"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Valuation Process Timeline */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A] mb-4">
              The Valuation Process
            </h2>
            <p className="text-slate-600 text-lg">
              A structured approach to determining the fair market value of a digital asset.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-slate-100 z-0"></div>
            
            {/* Vertical Line for Mobile/Tablet */}
            <div className="lg:hidden absolute left-[27px] top-[28px] bottom-0 w-[2px] bg-slate-100 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 relative z-10">
              {[
                "Understand the Business",
                "Review Financial Performance",
                "Analyze Growth & Customers",
                "Compare Relevant Market Benchmarks",
                "Assess Risk & Owner Dependence",
                "Determine a Realistic Value Range"
              ].map((step, idx) => (
                <div key={idx} className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center group mb-10 lg:mb-0 px-2 relative z-10">
                  <div className="w-14 h-14 bg-white rounded-full border-[3px] border-slate-100 flex items-center justify-center mb-0 lg:mb-6 mr-6 lg:mr-0 group-hover:border-[#0B4C8C] transition-colors duration-300 shrink-0 relative z-10">
                    <span className="text-sm font-bold text-slate-400 group-hover:text-[#0B4C8C] transition-colors duration-300">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="pt-2 lg:pt-0 max-w-[200px] lg:mx-auto">
                    <h3 className="font-bold text-[#0B152A] text-sm lg:text-base leading-snug group-hover:text-[#0B4C8C] transition-colors">
                      {step}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-[#0B152A] mb-6">
            Ready to Explore Your Next Business Opportunity?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Discover online businesses and digital opportunities on InfyBuys while making informed decisions with a better understanding of business value.
          </p>
          <Button asChild size="lg" className="bg-[#0B4C8C] text-white hover:bg-[#0B152A] font-bold text-lg px-8 h-14 rounded-full shadow-lg group border-none outline-none transition-colors">
            <Link to="/search">
              Explore Businesses
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
