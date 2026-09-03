import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/constants/marketing';
import { Link } from 'react-router';

// Map categories to high-quality Unsplash placeholder images
const CATEGORY_IMAGES: Record<string, string> = {
  'SaaS': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
  'E-Commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000',
  'Agencies': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000',
  'Marketplaces': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000',
  'Content Sites': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000',
  'Mobile Apps': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000',
};

export function ExploreOpportunities() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % CATEGORIES.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? CATEGORIES.length - 1 : prev - 1));
  };

  const activeCategory = CATEGORIES[activeIndex];
  const activeImage = CATEGORY_IMAGES[activeCategory.name] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000';

  return (
    <section className="py-24 bg-[#F9FAFB] relative overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">
            Explore Opportunities That Fit Your Goals
          </p>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="hidden md:flex flex-1 items-center justify-end">
              <div className="w-16 border-t-2 border-slate-300 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-r-2 border-t-2 border-slate-300"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              EXPLORE BUSINESS OPPORTUNITIES
            </h2>
            <div className="hidden md:flex flex-1 items-center justify-start">
              <div className="w-16 border-t-2 border-slate-300 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-l-2 border-b-2 border-slate-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Prev Arrow (Desktop) */}
          <button 
            onClick={prevSlide}
            className="hidden md:flex absolute -left-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 items-center justify-center text-slate-600 hover:text-brand-blue hover:scale-110 transition-all"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Showcase Card */}
          <div className="w-full bg-white rounded-[2rem] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-center relative overflow-hidden min-h-[420px]">
            
            {/* Left Image Area */}
            <div className="w-full md:w-[65%] h-[280px] md:h-[400px] rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="absolute inset-0 bg-black/10 z-10"></div>
                  <img 
                    src={activeImage} 
                    alt={activeCategory.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Overlapping Content Card */}
            <div className="w-[90%] md:w-[45%] md:absolute md:right-8 lg:right-12 mt-[-40px] md:mt-0 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-[#0B4C8C] rounded-2xl p-8 shadow-2xl text-white flex flex-col justify-center border border-white/10"
                >
                  <p className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-3">Category</p>
                  <h3 className="text-3xl font-bold mb-4">{activeCategory.name}</h3>
                  <p className="text-blue-50 leading-relaxed mb-8 opacity-95">
                    {activeCategory.description} Explore profitable acquisition opportunities in the {activeCategory.name.toLowerCase()} space and connect securely with vetted sellers today.
                  </p>
                  <Link 
                    to={`/search?category=${activeCategory.name}`}
                    className="inline-flex items-center justify-center w-full bg-white text-[#0B4C8C] hover:bg-slate-50 font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    Explore Businesses
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>

          {/* Next Arrow (Desktop) */}
          <button 
            onClick={nextSlide}
            className="hidden md:flex absolute -right-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 items-center justify-center text-slate-600 hover:text-brand-blue hover:scale-110 transition-all"
            aria-label="Next category"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Controls & Indicators */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button 
            onClick={prevSlide}
            className="md:hidden w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {CATEGORIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex 
                    ? 'w-10 h-2.5 bg-[#0B4C8C]' 
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="md:hidden w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
