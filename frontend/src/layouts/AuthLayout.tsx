import { Outlet, Link } from 'react-router';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Form Side */}
      <div className="flex flex-col flex-1 p-6 sm:p-12 md:p-16 lg:p-24 bg-background">
        <Link to="/" className="flex items-center gap-2 w-max mb-12 sm:mb-16">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">InfyBuys</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-[450px] w-full mx-auto">
          <Outlet />
        </div>

        <div className="mt-12 text-center lg:text-left text-sm text-muted-foreground">
          © {new Date().getFullYear()} InfyBuys. All rights reserved.
        </div>
      </div>

      {/* Right Visual Side (Desktop Only) */}
      <div className="hidden lg:flex relative bg-primary flex-col justify-between p-24 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            The premium marketplace for digital acquisitions.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-primary-foreground/80 text-lg max-w-md"
          >
            Join thousands of founders and investors securely buying and selling SaaS, E-commerce, and Digital Agencies.
          </motion.p>
        </div>

        {/* Mockup / Abstract Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 w-full aspect-video rounded-xl bg-background/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden mt-12"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">$150M+</div>
              <div className="text-sm font-medium text-white/80 uppercase tracking-widest">Transaction Volume</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
