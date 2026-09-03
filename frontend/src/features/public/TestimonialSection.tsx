import { ShieldCheck, Lock, UserCheck, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const TRUST_FEATURES = [
  {
    title: "Verified Users",
    description: "Strict buyer & seller vetting.",
    icon: UserCheck
  },
  {
    title: "Secure NDAs",
    description: "Integrated digital agreements.",
    icon: Lock
  },
  {
    title: "Checked Listings",
    description: "Admin verified business data.",
    icon: ShieldCheck
  },
  {
    title: "Direct Comm",
    description: "Secure in-platform messaging.",
    icon: MessageSquare
  }
];

export function TestimonialSection() {
  return (
    <section className="py-12 bg-[#F9FAFB] border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {TRUST_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center gap-4 w-full py-4 md:py-0"
            >
              <div className="w-12 h-12 rounded-full border border-brand-blue/20 bg-white flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
                <feature.icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
