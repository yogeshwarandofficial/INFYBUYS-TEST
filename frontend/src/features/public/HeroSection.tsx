import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[75vh] min-h-[600px] flex flex-col items-center justify-center pt-40 pb-16">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788424709/4bb2dd53-19b6-4927-969f-8a11b1b5013b_jnulo4.png")' }}
      >
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-8">
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 uppercase drop-shadow-lg">
        <span className="text-[#00B8E6]"> Buy </span>|<span className="text-[#00B8E6]"> Sell </span>|<span className="text-[#00B8E6]"> Discover </span>|<span className="text-[#00B8E6]"> Grow </span>
        </h1>
        <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
          The premium marketplace to discover vetted online businesses and securely list your own digital assets with confidence.
        </p>

        {/* Large Search Bar */}
        <div className="w-full max-w-4xl bg-blue-30 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 relative flex items-center">
          <Input
            type="text"
            placeholder="Find Listings, Categories, Or Enter A Listing ID..."
            className="w-full h-16 md:h-20 pl-8 pr-20 text-base md:text-lg bg-transparent border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-300 font-medium rounded-full"
          />
          <button className="absolute right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-[#0B4C8C] bg-slate-50 transition-colors">
            <Search className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
