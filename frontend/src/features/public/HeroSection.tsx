import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[75vh] min-h-[600px] flex flex-col items-center justify-center pt-40 pb-16">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-marketplace.jpg")' }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        {/* Gradient overlay: Light at the top for dark navbar text readability, darker/blue at the bottom for hero text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#0B4C8C]/50 to-[#0B152A]/90"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-8">
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B152A] mb-6 uppercase drop-shadow-lg">
          Buy | Sell | Discover | Grow
        </h1>
        <p className="text-lg md:text-xl text-grey max-w-2xl font-medium drop-shadow-md mb-12">
          The premium marketplace to discover vetted online businesses and securely list your own digital assets with confidence.
        </p>

        {/* Large Search Bar */}
        <div className="w-full max-w-4xl  rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 relative flex items-center">
          <Input
            type="text"
            placeholder="Find Listings, Categories, Or Enter A Listing ID..."
            className="w-full h-16 md:h-20 pl-8 pr-20 text-base md:text-lg bg-transparent border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-400 font-medium rounded-full"
          />
          <button className="absolute right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-[#0B4C8C] bg-slate-50 transition-colors">
            <Search className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
