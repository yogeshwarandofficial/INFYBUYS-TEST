import { Link } from 'react-router';
import { CATEGORIES } from '@/constants/marketing';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function CategoryCards() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-24">
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase mb-4">
            Discover Businesses Across Leading Categories
          </p>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="hidden md:flex flex-1 items-center justify-end">
              <div className="w-16 border-t-[1.5px] border-slate-200 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border-r-[1.5px] border-t-[1.5px] border-slate-300"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B152A] uppercase">
              EXPLORE BY CATEGORY
            </h2>
            <div className="hidden md:flex flex-1 items-center justify-start">
              <div className="w-16 border-t-[1.5px] border-slate-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border-l-[1.5px] border-b-[1.5px] border-slate-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Journey Container */}
        <div className="relative w-full flex flex-col md:flex-row items-stretch justify-between mt-8">
          
          {/* Connecting Line (Desktop: Horizontal) */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-slate-100 z-0"></div>
          
          {/* Connecting Line (Mobile: Vertical) */}
          <div className="md:hidden absolute left-[27px] top-[28px] bottom-0 w-[2px] bg-slate-100 z-0"></div>

          {CATEGORIES.map((category, index) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;
            const number = String(index + 1).padStart(2, '0');

            return (
              <Link 
                to={`/search?category=${category.name}`} 
                key={category.id}
                className="group relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:flex-1 mb-12 md:mb-0 px-2 cursor-pointer"
              >
                {/* Timeline Node */}
                <div className="flex flex-col items-center mr-6 md:mr-0">
                  <div className="w-14 h-14 bg-white/50 rounded-full border-[3px] border-slate-100 flex items-center justify-center mb-0 md:mb-8 group-hover:border-[#0B4C8C] group-hover:shadow-[0_0_15px_rgba(11,76,140,0.2)] transition-all duration-300 relative z-10">
                    <span className="text-sm font-bold text-slate-400 group-hover:text-[#0B4C8C] transition-colors duration-300">
                      {number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-start md:items-center pt-2 md:pt-0 max-w-[200px] md:mx-auto">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:bg-[#0B4C8C]/5 group-hover:text-[#0B4C8C] transition-all duration-300">
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[#0B152A] text-lg mb-3 group-hover:text-[#0B4C8C] transition-colors duration-300">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 md:mt-24 text-center">
          <Link 
            to="/search" 
            className="inline-flex items-center justify-center font-bold uppercase tracking-widest text-xs text-[#0B152A] hover:text-[#0B4C8C] transition-colors group"
          >
            <span className="border-b border-transparent group-hover:border-[#0B4C8C] pb-1 transition-all">
              View All Categories
            </span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
