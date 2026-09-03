import { motion } from 'framer-motion';
import { Search, Map, LayoutTemplate, MessageSquare } from 'lucide-react';

const CAPABILITIES = [
  {
    title: 'Discover Opportunities',
    description: 'Browse verified, profitable online businesses curated for serious acquirers.',
    icon: Search,
  },
  {
    title: 'Explore Business Listings',
    description: 'Access detailed financial metrics and traffic data before making an offer.',
    icon: Map,
  },
  {
    title: 'List Your Business',
    description: 'Create a comprehensive listing to reach our active network of buyers.',
    icon: LayoutTemplate,
  },
  {
    title: 'Connect Securely',
    description: 'Communicate and negotiate directly through our integrated platform.',
    icon: MessageSquare,
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-24 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">
            What We Offer
          </h2>
          <p className="text-lg text-slate-600">
            The complete marketplace solution to take your acquisition strategy to the next level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {CAPABILITIES.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-white border border-slate-200 text-brand-blue rounded-lg flex items-center justify-center mb-6">
                <cap.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{cap.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
