import { Seo } from '@/components/shared/Seo';
import { FAQS } from '@/constants/marketing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Find answers to common questions about buying and selling online businesses on InfyBuys."
      />

      <section className="relative w-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070" 
            alt="FAQ and Help Center" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
        
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              KNOWLEDGE BASE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Find <span className="text-[#00B8E6]">Answers</span> Quickly
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
              Everything you need to know about buying, selling, and managing digital assets on InfyBuys.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
