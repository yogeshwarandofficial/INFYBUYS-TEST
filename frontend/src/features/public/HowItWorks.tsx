import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, MessageSquare, Handshake, ChevronRight, ShieldCheck, Zap, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

const WORKFLOW_STEPS = [
  {
    id: '01',
    title: 'Discover Businesses',
    shortDesc: 'Search active listings',
    icon: Search,
    detailTitle: 'Find Your Perfect Acquisition',
    detailDesc: 'Browse our comprehensive marketplace of vetted online businesses, SaaS platforms, and e-commerce stores. Use advanced filters to match your exact investment criteria, revenue targets, and preferred tech stack.',
    features: [
      { title: 'Advanced Filtering', desc: 'Filter by MRR, asking price, and business model.', icon: Zap },
      { title: 'Verified Metrics', desc: 'All financial claims are checked by our team.', icon: ShieldCheck }
    ]
  },
  {
    id: '02',
    title: 'Explore & Review',
    shortDesc: 'Analyze public data',
    icon: Map,
    detailTitle: 'Deep Dive into Business Profiles',
    detailDesc: 'Review detailed public summaries of the businesses you are interested in. Understand their growth history, operational requirements, and the primary reasons the current owner is looking to exit.',
    features: [
      { title: 'Operational Insights', desc: 'Understand the weekly hours required.', icon: Users },
      { title: 'Growth Opportunities', desc: 'Identify potential areas for scaling the business.', icon: Zap }
    ]
  },
  {
    id: '03',
    title: 'Enquire & Connect',
    shortDesc: 'Sign NDA & message',
    icon: MessageSquare,
    detailTitle: 'Securely Connect with Sellers',
    detailDesc: 'Once you find a promising business, submit a formal enquiry. You can sign a digital Non-Disclosure Agreement (NDA) to unlock highly confidential financial reports, URL details, and direct seller communication.',
    features: [
      { title: 'Digital NDAs', desc: 'Protect confidentiality with built-in digital NDAs.', icon: Lock },
      { title: 'Direct Messaging', desc: 'Communicate directly via our secure platform.', icon: MessageSquare }
    ]
  },
  {
    id: '04',
    title: 'Move Forward',
    shortDesc: 'Negotiate and acquire',
    icon: Handshake,
    detailTitle: 'Negotiate and Close the Deal',
    detailDesc: 'Work directly with the seller to negotiate terms, perform your final due diligence, and successfully transition the assets. InfyBuys provides the secure environment to facilitate the introduction.',
    features: [
      { title: 'Secure Environment', desc: 'A safe platform for all your acquisition discussions.', icon: ShieldCheck },
      { title: 'Seamless Handoff', desc: 'Transition smoothly to the final acquisition phase.', icon: Handshake }
    ]
  }
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-[#F8FAFC] border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[#0B152A]">
            How InfyBuys Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            A straightforward, secure, and platform-driven process to discover and acquire profitable online businesses.
          </p>
        </div>

        {/* Four-Step Horizontal Journey */}
        <div className="hidden md:flex items-start justify-between relative mb-16 px-4">
          {/* Connecting Line */}
          <div className="absolute top-8 left-12 right-12 h-[2px] bg-slate-200 -z-10" />
          
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center cursor-pointer group w-1/4"
                onClick={() => setActiveStep(index)}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-2 mb-4",
                  isActive 
                    ? "bg-[#0B4C8C] border-[#0B4C8C] text-white scale-110" 
                    : "bg-white border-slate-200 text-slate-400 group-hover:border-[#0B4C8C] group-hover:text-[#0B4C8C]"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className={cn(
                  "font-bold text-lg mb-1 transition-colors",
                  isActive ? "text-[#0B4C8C]" : "text-slate-700"
                )}>
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 text-center">
                  {step.shortDesc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Journey (Visible on small screens) */}
        <div className="md:hidden flex flex-col gap-4 mb-12">
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors",
                  isActive ? "bg-white border-[#0B4C8C] shadow-sm" : "bg-transparent border-slate-200"
                )}
                onClick={() => setActiveStep(index)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isActive ? "bg-[#0B4C8C] text-white" : "bg-white text-slate-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={cn("font-bold", isActive ? "text-[#0B4C8C]" : "text-slate-700")}>{step.title}</h4>
                  <p className="text-sm text-slate-500">{step.shortDesc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Step Information Card */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B4C8C] to-[#2B7BCF]" />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row"
            >
              {/* Left Side: Description */}
              <div className="flex-1 p-8 md:p-12 lg:border-r border-slate-100">
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#0B4C8C] text-xs font-black tracking-widest uppercase rounded-full mb-6">
                  Step {WORKFLOW_STEPS[activeStep].id}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B152A] mb-4">
                  {WORKFLOW_STEPS[activeStep].detailTitle}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  {WORKFLOW_STEPS[activeStep].detailDesc}
                </p>
                <Button asChild size="lg" className="bg-[#0B4C8C] hover:bg-[#093D70] text-white rounded-full px-8 h-12 shadow-md">
                  <Link to="/search">
                    Explore Businesses <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Right Side: Features */}
              <div className="w-full lg:w-2/5 p-8 md:p-12 bg-slate-50 flex flex-col justify-center gap-6">
                {WORKFLOW_STEPS[activeStep].features.map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FeatureIcon className="w-5 h-5 text-[#0B4C8C]" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 mb-1">{feature.title}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
