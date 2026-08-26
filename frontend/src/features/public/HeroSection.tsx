import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, ShieldCheck, Headset, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden flex items-center justify-center min-h-[70vh] bg-[#0A0E1A]">
      {/* Background with dot grid and blue blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-20 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] z-0 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] z-0 mix-blend-screen pointer-events-none" />

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-32 right-[10%] hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-20"
      >
        <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
          <TrendingUp className="text-brand-blue w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-white tracking-tight">$200M+</div>
          <div className="text-xs font-semibold text-white/50 uppercase tracking-widest">Total Volume</div>
        </div>
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm text-primary-foreground backdrop-blur-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-success mr-2"></span>
            Over $150M+ in successful acquisitions
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Buy and Sell <br className="hidden md:block" /><span className="text-brand-blue">Profitable Online Businesses</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto">
            The premium marketplace for SaaS, E-commerce, and Digital Agencies. Join 15,000+ verified buyers and sellers today.
          </p>

          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search businesses (e.g., SaaS, $500k MRR)..."
                className="pl-12 h-14 text-base bg-black/50 text-white border border-white/10 shadow-lg rounded-full focus-visible:ring-1 focus-visible:ring-brand-blue focus-visible:border-brand-blue placeholder:text-muted-foreground/70"
              />
            </div>
            <Button size="lg" className="h-14 px-8 rounded-full shadow-lg bg-brand-blue hover:bg-brand-blue/90 text-white font-bold tracking-wide uppercase text-sm">
              Search
            </Button>
          </div>

          <div className="pt-16 flex flex-wrap justify-center gap-4 md:gap-6 items-center text-white">
            <div className="flex items-center gap-3 bg-[#0A0E1A]/80 border border-brand-blue/20 rounded-xl px-5 py-3 shadow-md">
              <CheckCircle2 className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold tracking-wide">Verified Listings</span>
            </div>
            <div className="flex items-center gap-3 bg-[#0A0E1A]/80 border border-brand-blue/20 rounded-xl px-5 py-3 shadow-md">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold tracking-wide">Secure Escrow</span>
            </div>
            <div className="flex items-center gap-3 bg-[#0A0E1A]/80 border border-brand-blue/20 rounded-xl px-5 py-3 shadow-md">
              <Headset className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold tracking-wide">Expert Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
