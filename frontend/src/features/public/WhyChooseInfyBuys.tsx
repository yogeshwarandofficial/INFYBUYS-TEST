import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  'Pre-vetted businesses only',
  'Integrated Escrow Services',
  'Zero listing fees for sellers',
  'Advanced financial metrics',
  'Direct buyer-seller messaging',
  'Expert migration support',
];

export function WhyChooseInfyBuys() {
  return (
    <section className="py-24 bg-[#0A0E1A] text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why the best founders choose <span className="text-brand-blue">InfyBuys</span>
            </h2>
            <p className="text-lg text-white/70 mb-8">
              We've engineered the most secure and transparent marketplace for digital assets.
              Say goodbye to broker fees and hello to direct, frictionless acquisitions.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
                  <span className="font-medium text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Abstract visual placeholder for UI mockup / graphic */}
            <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-[#0D1220] to-[#0A0E1A] border border-white/5 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen" />
              <div className="absolute inset-4 rounded-2xl border border-white/10 bg-[#0A0E1A]/60 backdrop-blur-md flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-5xl font-black text-brand-blue mb-2">$150M+</div>
                  <div className="text-lg font-semibold text-white">Total Transaction Volume</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
