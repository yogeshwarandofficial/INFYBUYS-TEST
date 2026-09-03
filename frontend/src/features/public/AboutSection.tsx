import { motion } from 'framer-motion';
import { HelpCircle, Globe, Eye, Rocket } from 'lucide-react';

const INFO_CARDS = [
  {
    title: 'What is InfyBuys?',
    description: 'InfyBuys is a virtual commercial online platform that brings Buyers, Sellers, and Brokers together, thereby transforming and simplifying the way digital businesses are bought and sold.',
    icon: HelpCircle,
  },
  {
    title: 'Reach',
    description: 'We offer a secure, accessible community for buyers to discover profitable online businesses and for sellers to securely list their assets to a global network of serious acquirers.',
    icon: Globe,
  },
  {
    title: 'Vision',
    description: 'To shape a dynamic global community through a Worldwide Trade Hub, where buying, selling, and investing in digital assets is made simple, secure, and built on lasting trust.',
    icon: Eye,
  },
  {
    title: 'Mission',
    description: 'Our mission is to provide a reliable platform connecting business owners and investors effortlessly through professional expertise, commitment to confidentiality, and value-driven solutions.',
    icon: Rocket,
  },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-white text-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        {/* Top Split: Image vs About Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
          
          {/* Left: Image Composition */}
          <div className="w-full lg:w-[45%] relative min-h-[400px]">
            
            {/* Left Image */}
            <div className="absolute left-0 top-0 w-[60%] h-[90%] rounded-tr-[40px] rounded-bl-[10px] rounded-tl-[10px] rounded-br-[10px] overflow-hidden shadow-sm z-10 border-[6px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Business professionals" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Image */}
            <div className="absolute right-0 top-[10%] w-[55%] h-[75%] rounded-tl-[40px] rounded-br-[10px] rounded-tr-[10px] rounded-bl-[10px] overflow-hidden shadow-sm z-0">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Business handshake" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Highlight Badge */}
            <div className="absolute left-[55%] bottom-[5%] -translate-x-1/2 z-20 bg-[#063b7a] text-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-3xl font-bold tracking-tight mb-1">15K+</span>
              <span className="text-xs font-semibold text-white/90 text-center leading-tight">
                Verified Users<br/>Community
              </span>
            </div>
          </div>

          {/* Right: About Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-black mb-1">
              About InfyBuys Platform
            </h2>
            <p className="text-[#0B4C8C] font-bold text-sm mb-6">
              For Digital Businesses and Secure Acquisitions
            </p>
            
            <div className="space-y-5 text-gray-600 text-[13px] leading-relaxed">
              <p>
                Launched with the idea of creating a secure, trustworthy, and accessible community for buyers and sellers, InfyBuys has established itself as the premier destination for digital business acquisitions. Thriving in an industry of immense potential, we gather online businesses from all over the world to help entrepreneurs scale and make profitable exits.
              </p>
              <p>
                Do you have a profitable SaaS to sell? Are you an entrepreneur interested in purchasing a thriving E-commerce brand? Avoid the stress of starting from scratch; InfyBuys has an array of verified listings for individuals and corporate buyers alike. The listing process makes it easy for anyone to create an account, bringing unprecedented transparency to the marketplace.
              </p>
              <p>
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
                <p className="text-gray-500 leading-relaxed text-[13px] mt-2">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
