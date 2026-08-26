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
    <section className="py-24 bg-[#0A0E1A] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-10 z-0" />
      <div className="container relative mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Acquisitions</h2>
            <p className="text-lg text-white/70 max-w-2xl">
              Hand-picked, highly profitable businesses vetted by our expert team.
            </p>
          </div>
          <Button asChild className="hidden md:flex bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full uppercase tracking-widest text-xs font-bold px-6">
            <Link to="/search?featured=true">
              View all premium <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No featured listings found.</p>
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
              >
                <ListingCard listing={listing} variant="featured" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Button asChild className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full uppercase tracking-widest text-xs font-bold px-6">
            <Link to="/search?featured=true">
              View all premium <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
