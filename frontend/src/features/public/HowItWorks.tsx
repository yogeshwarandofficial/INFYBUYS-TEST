import { motion } from 'framer-motion';
import { Search, FileCheck, Handshake } from 'lucide-react';

const STEPS = [
  {
    title: 'Discover & Evaluate',
    description: 'Browse verified listings, review detailed financial metrics, and find the perfect business that matches your acquisition criteria.',
    icon: Search,
  },
  {
    title: 'Connect & Negotiate',
    description: 'Sign an NDA instantly to unlock confidential details. Communicate directly with founders and negotiate terms securely.',
    icon: FileCheck,
  },
  {
    title: 'Acquire & Transfer',
    description: 'Use our integrated escrow and legal services to finalize the deal and seamlessly transfer assets to your control.',
    icon: Handshake,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#0D1220] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How InfyBuys Works</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A streamlined, secure, and transparent process for buying and selling online businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center p-6 bg-[#0A0E1A] rounded-2xl shadow-sm border border-white/5 hover:border-brand-blue/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>

              {/* Connector Line (desktop only) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/4 -right-4 w-8 border-t-2 border-dashed border-white/10 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
