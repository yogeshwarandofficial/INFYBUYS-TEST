import { ListingCard } from '@/components/shared/ListingCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';

export function FeaturedListings() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Assuming backend supports isFeatured query
        const response = await apiClient.get<any>(`/listings`, { isFeatured: true, limit: 3 });
        setFeatured(response.data || []);
      } catch (err: any) {
        console.error('Failed to fetch featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <section className="py-24 bg-white relative">
      <div className="container relative mx-auto px-4 z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Explore Businesses</h2>
          <p className="text-lg text-slate-600">
            A glimpse of premium online businesses currently available for acquisition.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <p className="text-slate-500 font-medium">No featured listings found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)]">
                  <ListingCard listing={listing} variant="featured" className="h-full border-slate-200 shadow-sm rounded-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="h-12 px-8 rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-all text-sm uppercase tracking-wide bg-white shadow-sm">
            <Link to="/search?featured=true">
              View More Businesses <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
