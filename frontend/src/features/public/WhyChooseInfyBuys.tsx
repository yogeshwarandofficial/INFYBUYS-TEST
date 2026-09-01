import { ShieldCheck, Search, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WHY_FEATURES = [
  {
    title: 'Comprehensive Metrics',
    description: 'Detailed financial and traffic data provided upfront to help you make informed decisions.',
    icon: Search,
  },
  {
    title: 'Verified Listings',
    description: 'Rigorous listing verification process ensures a high-quality marketplace.',
    icon: CheckCircle,
  },
  {
    title: 'Secure Workflows',
    description: 'In-platform NDA signing and secure environment to protect your data.',
    icon: ShieldCheck,
  },
  {
    title: 'Direct Communication',
    description: 'Connect and negotiate securely through our integrated messaging platform.',
    icon: MessageSquare,
  },
];

export function WhyChooseInfyBuys() {
  return (
    <section className="py-24 bg-[#0B152A] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {WHY_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-lg border border-brand-blue/30 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-brand-blue stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
