import { STATS } from '@/constants/marketing';
import { motion } from 'framer-motion';

export function StatisticsSection() {
  return (
    <section className="py-16 bg-[#0A0E1A] border-y border-white/5 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-brand-blue/20">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="text-4xl md:text-5xl font-black mb-2 text-brand-blue">{stat.value}</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
