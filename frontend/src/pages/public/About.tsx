import { Seo } from '@/components/shared/Seo';
import { motion } from 'framer-motion';
import { Target, Shield, TrendingUp, Users } from 'lucide-react';

const INFO_CARDS = [
  {
    title: 'Our Mission',
    description: 'Our mission is to create a frictionless, transparent, and secure marketplace where founders can exit on their terms, and acquirers can find high-quality assets with confidence.',
    icon: Target,
  },
  {
    title: 'Radical Transparency',
    description: 'We believe both buyers and sellers deserve complete visibility into metrics, fees, and processes. No hidden agendas.',
    icon: Shield,
  },
  {
    title: 'Founder First',
    description: 'We design our tools to maximize outcomes for founders who have poured their lives into building their businesses.',
    icon: TrendingUp,
  },
  {
    title: 'Vetted Community',
    description: 'Quality over quantity. We rigorously vet every listing and every buyer to ensure a safe ecosystem.',
    icon: Users,
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About InfyBuys"
        description="Learn about our mission to democratize digital acquisitions and build the world's most trusted marketplace."
      />

      {/* About Page Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[600px] flex items-center justify-center pt-32 lg:pt-40 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Modern business office" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Subtle Blue/White Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/20"></div>
        
        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              About InfyBuys
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Building Trust in Digital <br className="hidden md:block"/>Business Acquisitions
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              InfyBuys is a trusted marketplace connecting buyers and sellers of verified online businesses, SaaS, digital assets, and profitable ventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area - Padding adjusted since Hero handles top spacing */}
      <div className="bg-white pb-20 pt-16 lg:pt-24">
        <section className="bg-white text-slate-900 overflow-hidden">
          <div className="container mx-auto px-4 max-w-[1200px]">
            
            {/* Top Split: Image vs About Content */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
              
              {/* Left: Image Composition */}
              {/* <div className="w-full lg:w-[45%] relative min-h-[400px]">
                
                Left Image
                <div className="absolute left-0 top-0 w-[60%] h-[90%] rounded-tr-[40px] rounded-bl-[10px] rounded-tl-[10px] rounded-br-[10px] overflow-hidden shadow-sm z-10 border-[6px] border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Business professionals" 
                    className="w-full h-full object-cover"
                  />
                </div>

                Right Image
                <div className="absolute right-0 top-[10%] w-[55%] h-[75%] rounded-tl-[40px] rounded-br-[10px] rounded-tr-[10px] rounded-bl-[10px] overflow-hidden shadow-sm z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                    alt="InfyBuys Team" 
                    className="w-full h-full object-cover"
                  />
                </div>

                Floating Highlight Badge
                <div className="absolute left-[55%] bottom-[5%] -translate-x-1/2 z-20 bg-[#063b7a] text-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-3xl font-bold tracking-tight mb-1">15K+</span>
                  <span className="text-xs font-semibold text-white/90 text-center leading-tight">
                    Verified Users<br/>Community
                  </span>
                </div>
              </div> */}

              {/* Right: About Text Content */}
              <div className="w-full lg:w-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-black mb-1 justify-center items-center flex">
                  About InfyBuys Platform
                </h2>
                <p className="text-[#0B4C8C] font-bold text-sm mb-6 justify-center items-center flex">
                  For Digital Businesses and Secure Acquisitions
                </p> 
                <div className="space-y-5 text-gray-600 text-[20px] leading-relaxed px-5 justify-center items-center ">
                  <p>Founded in 2024, InfyBuys was born out of frustration with traditional business brokers. High fees, opaque processes, and misaligned incentives plagued the industry. Launched with the idea of creating a secure, trustworthy, and accessible community for buyers and sellers, InfyBuys has established itself as the premier destination for digital business acquisitions.</p>
                  <p>Do you have a profitable SaaS to sell? Are you an entrepreneur interested in purchasing a thriving E-commerce brand? Avoid the stress of starting from scratch; InfyBuys has an array of verified listings for individuals and corporate buyers alike. We are building the future of digital acquisitions.
                  Proud to maintain the confidentiality and security of our sellers and buyers, InfyBuys offers a huge archive of listings where you can certainly find something to suit your acquisition requirements. Evolving into a large service-providing network, we connect executives from all over the world beyond geographical limits.
                 </p>               
                </div>
              </div>
            </div>

            {/* Bottom Grid: Information Cards */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 lg:px-4">
              {INFO_CARDS.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative bg-[#f6f7f9] rounded-2xl p-8 pt-10 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Floating Title Badge */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center bg-[#063b7a] rounded-full shadow-md pr-6 pl-1 py-1 h-10 min-w-[180px]">
                      <div className="w-8 h-8 rounded-full bg-[#fbbc05] text-[#063b7a] flex items-center justify-center flex-shrink-0 mr-3 shadow-inner">
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <h3 className="text-[15px] font-bold text-white whitespace-nowrap">{card.title}</h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-500 leading-relaxed text-[17px] mt-2">
                      {card.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
