import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0A0E1A]">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-10 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[150px] z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Ready to make your next big move?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Whether you're looking to acquire a profitable asset or exit your current business, InfyBuys is the only platform you need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 text-sm uppercase tracking-widest font-bold bg-brand-blue text-white hover:bg-brand-blue/90 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Link to="/register">
                Start Buying <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-8 text-sm uppercase tracking-widest font-bold bg-transparent text-white hover:bg-white/5 border-white/20 hover:border-white/50 rounded-full">
              <Link to="/sell">
                <DollarSign className="mr-2 w-5 h-5" /> Get a Free Valuation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
