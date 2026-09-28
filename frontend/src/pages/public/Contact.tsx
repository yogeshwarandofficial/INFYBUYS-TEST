import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Seo } from '@/components/shared/Seo';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: wire to real /api/contact endpoint when backend supports it
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      // silently fail on simulated submission
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with the InfyBuys team for support, partnership inquiries, or platform assistance."
      />

      {/* Contact Page Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[600px] flex items-center justify-center pt-32 lg:pt-40 pb-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788432516/178f1e69-7410-43c8-9308-f1ad62fcfc15_s2d4oe.png")' }}
        >
          <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
          {/* Dark navy gradient overlay for premium look */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Let’s Connect and <br className="hidden md:block" /><span className="text-[#00B8E6]">Grow Together</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
              Have a question, need assistance, or want to explore a business opportunity? Our team is here to help you connect with the right people and take the next step with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="bg-[#f8fafc]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-16 lg:pt-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Contact Information */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full">
                <h2 className="text-3xl font-extrabold text-[#0B152A] mb-4">Get in Touch</h2>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Whether you're looking to sell your business or searching for your next acquisition, our team of experts is ready to assist you.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#0B4C8C]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-[#0B4C8C]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0B152A]">Global Headquarters</h4>
                      <p className="text-slate-500 mt-2 leading-relaxed">
                        100 Market Street, Suite 400<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#0B4C8C]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-[#0B4C8C]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0B152A]">Email Us</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-slate-500"><span className="font-medium text-slate-700">Support:</span> support@infybuys.com</p>
                        <p className="text-slate-500"><span className="font-medium text-slate-700">Partners:</span> partnerships@infybuys.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#0B4C8C]/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-[#0B4C8C]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0B152A]">Business Hours</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-slate-500">Monday - Friday</p>
                        <p className="text-slate-500 font-medium text-[#0B4C8C]">9:00 AM - 6:00 PM (PST)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden h-full">
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-[#0B152A] mb-8">Send us a Message</h3>

                  {isSuccess ? (
                    <div className="py-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-[#0B152A] mb-3">Message Sent!</h3>
                      <p className="text-slate-500 text-lg max-w-md mx-auto">
                        Thank you for reaching out. A member of our team will get back to you within 24 hours.
                      </p>
                      <Button
                        className="mt-10 h-12 px-8 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0B152A] font-bold rounded-xl"
                        onClick={() => setIsSuccess(false)}
                        variant="outline"
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-bold text-[#0B152A]">Full Name</Label>
                          <input
                            id="name"
                            placeholder="John Doe"
                            {...register('name')}
                            className={`flex h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-base shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4C8C] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 transition-colors ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                          />
                          {errors.name && <p className="text-sm text-red-500 font-medium mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-bold text-[#0B152A]">Email Address</Label>
                          <input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email')}
                            className={`flex h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-base shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4C8C] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 transition-colors ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                          />
                          {errors.email && <p className="text-sm text-red-500 font-medium mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-bold text-[#0B152A]">Subject</Label>
                        <input
                          id="subject"
                          placeholder="How can we help you?"
                          {...register('subject')}
                          className={`flex h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-base shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4C8C] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 transition-colors ${errors.subject ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                        />
                        {errors.subject && <p className="text-sm text-red-500 font-medium mt-1">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-bold text-[#0B152A]">Message</Label>
                        <textarea
                          id="message"
                          className={`flex min-h-[160px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-base shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4C8C] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 transition-colors ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                          placeholder="Please provide as much detail as possible..."
                          {...register('message')}
                        />
                        {errors.message && <p className="text-sm text-red-500 font-medium mt-1">{errors.message.message}</p>}
                      </div>

                      <div className="pt-2">
                        <Button type="submit" className="w-full sm:w-auto h-12 px-10 bg-[#0B4C8C] hover:bg-[#0B4C8C]/90 text-white font-bold rounded-xl tracking-wide shadow-md transition-all hover:shadow-lg active:scale-95" disabled={isSubmitting}>
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          {/* <div className="mt-12 w-full h-[400px] bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale" />
            <div className="relative z-10 bg-white/95 backdrop-blur-md px-8 py-5 rounded-2xl shadow-xl text-center border border-white/50 transform hover:scale-105 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-[#0B4C8C] mx-auto mb-3" />
              <span className="text-lg font-bold text-[#0B152A]">San Francisco Office</span>
              <p className="text-sm text-slate-500 font-medium mt-1">100 Market Street, Suite 400</p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
