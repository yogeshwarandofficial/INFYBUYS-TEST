import { STATS } from '@/constants/marketing';
import { motion } from 'framer-motion';

export function StatisticsSection() {
  return (
    <section className="py-16 bg-brand-blue relative z-10 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="text-4xl md:text-5xl font-black mb-2 text-white">{stat.value}</div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
