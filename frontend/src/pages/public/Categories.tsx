import { Seo } from '@/components/shared/Seo';
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
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              CATEGORIES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Find the Perfect Digital <span className="text-[#00B8E6]">Asset</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] leading-relaxed max-w-2xl drop-shadow-md">
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
