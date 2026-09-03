import { Link } from 'react-router';
import { ArrowRight, TrendingUp, ShieldCheck, BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden bg-white text-slate-900 selection:bg-[#0B4C8C] selection:text-white border-t border-slate-100">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#0B4C8C]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none"></div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center order-2 lg:order-1 relative">
            <div className="absolute -left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#0B4C8C] to-transparent hidden lg:block opacity-20"></div>
            
            <p className="text-[#0B4C8C] font-bold tracking-[0.2em] uppercase text-xs mb-4">
              Join The Marketplace
            </p>
            
            <h2 className=" text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#0B152A] tracking-tight leading-[1.1] mb-6">
              Take the Next Step in Your Business Journey.
            </h2>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl">
              Whether you are looking to discover verified acquisition opportunities or securely list your own digital assets to a network of serious acquirers, InfyBuys is your trusted platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link 
                to="/search" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center bg-[#0B4C8C] text-white px-8 h-14 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_8px_20px_rgba(11,76,140,0.2)] hover:shadow-[0_12px_30px_rgba(11,76,140,0.3)] hover:bg-[#093d72] transition-all duration-300 hover:-translate-y-1"
              >
                <span>Explore Businesses</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/register" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center bg-white border-2 border-[#0B4C8C]/20 text-[#0B4C8C] px-8 h-14 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#0B4C8C]/5 hover:border-[#0B4C8C] transition-all duration-300"
              >
                <span>List Your Business</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform opacity-80 group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          {/* Right Abstract Visual */}
          <div className="w-full lg:w-[40%] order-1 lg:order-2 flex justify-center lg:justify-end relative min-h-[300px] md:min-h-[400px]">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              
              {/* Glass Card 1 (Main Analytics) */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 w-[85%] bg-white backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0B4C8C] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BarChart4 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="w-24 h-2.5 bg-slate-200 rounded-full mb-3"></div>
                      <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0B4C8C]/5 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#0B4C8C]" />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[70%] h-full bg-gradient-to-r from-[#0B4C8C] to-[#3B82F6] rounded-full"></div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[45%] h-full bg-gradient-to-r from-[#0B4C8C] to-[#3B82F6] rounded-full"></div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[85%] h-full bg-gradient-to-r from-[#0B4C8C] to-[#3B82F6] rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              {/* Glass Card 2 (Verified Status Pill) */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute z-30 -right-2 md:-right-6 top-[15%] bg-white border border-slate-100 rounded-full py-3.5 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#0B4C8C]/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#0B4C8C]" />
                </div>
                <span className="text-[#0B152A] font-extrabold text-sm tracking-wide">Verified Listing</span>
              </motion.div>

              {/* Glass Card 3 (Floating Metrics) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute z-10 -left-2 md:-left-6 bottom-[15%] w-52 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="w-24 h-3 bg-slate-200 rounded-full mb-3"></div>
                <div className="w-32 h-2 bg-slate-100 rounded-full"></div>
              </motion.div>

              {/* Decorative Circle Behind */}
              <div className="absolute z-0 w-[95%] aspect-square rounded-full border border-slate-200 border-dashed animate-[spin_80s_linear_infinite] opacity-60"></div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
