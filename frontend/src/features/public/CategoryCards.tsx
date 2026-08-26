import { motion } from 'framer-motion';
import { CATEGORIES } from '@/constants/marketing';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';
import * as Icons from 'lucide-react';

export function CategoryCards() {
  return (
    <section className="py-24 bg-[#0D1220] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-lg text-white/70 max-w-2xl">
              Find the perfect business in your preferred niche.
            </p>
          </div>
          <Link to="/search" className="text-brand-blue hover:text-brand-blue/80 hover:underline font-medium mt-4 md:mt-0 uppercase tracking-widest text-xs">
            View all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {CATEGORIES.map((category, index) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/search?category=${category.name}`}>
                  <Card className="bg-[#0A0E1A] border border-white/5 hover:border-brand-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer h-full group">
                    <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        {IconComponent && <IconComponent className="w-6 h-6" />}
                      </div>
                      <h3 className="font-semibold mb-1 text-white">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
