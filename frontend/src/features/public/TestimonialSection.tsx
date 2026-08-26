import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Selling our SaaS took exactly 42 days from listing to cash in bank. The InfyBuys platform made due diligence incredibly smooth.",
    author: "Sarah Jenkins",
    role: "Founder, TechFlow (Sold for $1.2M)",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    quote: "As a serial acquirer, I've used every platform. InfyBuys has the highest quality deal flow and the most transparent metrics.",
    author: "David Chen",
    role: "Managing Partner, Horizon Capital",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "The direct messaging and integrated NDA process saved us weeks of legal back-and-forth. Simply the best way to buy an online business.",
    author: "Elena Rodriguez",
    role: "E-commerce Operator",
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-[#0D1220] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Hear from founders and acquirers who have successfully navigated the InfyBuys platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-[#0A0E1A] border border-white/5 hover:border-brand-blue/50 transition-colors">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-brand-blue text-brand-blue" />
                    ))}
                  </div>
                  <p className="text-lg italic text-white/90 mb-8 flex-1">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center font-bold text-brand-blue shrink-0 border border-brand-blue/30">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/50">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
