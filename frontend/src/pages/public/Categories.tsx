import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryCards } from '@/features/public/CategoryCards';

export default function Categories() {
  return (
    <>
      <Seo
        title="All Categories"
        description="Browse all business categories available for sale on InfyBuys."
      />
      <section className="relative w-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Financial analysis and business valuation charts" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/10"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              CATEGORIES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Find the Perfect Digital Asset
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Explore online businesses and digital opportunities across various categories and industries.
            </p>
          </div>
        </div>
      </section>
      <div className="py-8">
        <CategoryCards />
      </div>
    </>
  );
}
