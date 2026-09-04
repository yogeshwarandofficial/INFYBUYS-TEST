import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Clock, MessageSquare, User, ChevronDown } from 'lucide-react';

export default function AdvisoryBooking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    date: '',
    time: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to the backend
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Seo
        title="Talk to an Advisor - InfyBuys"
        description="Get personalized guidance for buying, selling, valuing, or exploring opportunities on the InfyBuys marketplace."
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
       <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788445818/a4f51b1f-f460-4f06-9597-789efeead94e_yraizx.png")' }}
      >
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
      </div>

        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              ADVISORY & BROKERAGE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Get Expert Advice for Your<span className="text-[#00B8E6]"> Next Move</span> 
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
              Book a free consultation with our experienced brokers to discuss buying, selling, or valuing an online business.
            </p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B152A] mb-6">Expert Guidance for Your Business Journey</h2>
            <p className="text-lg text-slate-600">
              Whether you're buying, selling, valuing, or exploring a digital business, our advisory team helps you navigate the InfyBuys marketplace with greater clarity and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0B4C8C] mb-4 uppercase tracking-wide">Buy a Business</h3>
              <p className="text-slate-600 leading-relaxed">
                Explore online businesses and digital opportunities that match your goals, interests, and investment plans.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0B4C8C] mb-4 uppercase tracking-wide">Sell Your Business</h3>
              <p className="text-slate-600 leading-relaxed">
                Get guidance on preparing your business listing, presenting key information, and connecting with potential buyers.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0B4C8C] mb-4 uppercase tracking-wide">Business Valuation</h3>
              <p className="text-slate-600 leading-relaxed">
                Understand the factors that influence business value, including revenue, profitability, growth potential, digital assets, and market position.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0B4C8C] mb-4 uppercase tracking-wide">Due Diligence</h3>
              <p className="text-slate-600 leading-relaxed">
                Make informed decisions by reviewing important business, financial, operational, and marketplace information before moving forward.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-10 md:p-16 border border-slate-200">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0B152A] mb-6">Why Talk to an InfyBuys Advisor?</h3>
              <p className="text-lg text-slate-600 mb-12">
                Our advisors can help you better understand business opportunities available through InfyBuys and guide you through the next steps based on your goals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                  <h4 className="text-lg font-bold text-[#0B4C8C] mb-3">Understand the opportunity</h4>
                  <p className="text-slate-600">Get clarity on listings, business models, and important information.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0B4C8C] mb-3">Make informed decisions</h4>
                  <p className="text-slate-600">Learn what to review before buying, selling, or evaluating a business.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0B4C8C] mb-3">Navigate the marketplace</h4>
                  <p className="text-slate-600">Get guidance on the process and identify the right next step for your business journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          {submitted ? (
            <div className="bg-white rounded-2xl p-10 md:p-16 border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#0B152A] mb-4">Request Received!</h2>
              <p className="text-slate-600 text-lg mb-8">
                Thank you for reaching out. One of our specialized business advisors will contact you shortly to confirm your consultation time.
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                className="bg-[#0B4C8C] hover:bg-[#0B152A] text-white px-8 py-3 rounded-lg font-semibold"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm">
              <div className="mb-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B152A] mb-3">Schedule Your Session</h2>
                <p className="text-slate-600">Fill out the details below and we'll match you with the right expert.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Interest */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">What are you looking for?</label>
                    <div className="relative">
                      <select 
                        name="interest"
                        required
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] appearance-none transition-all cursor-pointer"
                        value={formData.interest}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select an option...</option>
                        <option value="buy">Buy a Business</option>
                        <option value="sell">Sell a Business</option>
                        <option value="valuation">Business Valuation</option>
                        <option value="guidance">General Guidance</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        name="date"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0B152A]">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="time" 
                        name="time"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0B152A]">Message (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                    <textarea 
                      name="message"
                      rows={4}
                      placeholder="Tell us a little more about your goals or any specific questions..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-[#0B152A] transition-all resize-none"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#2069B3] to-[#124B8B] hover:from-[#1A5A9A] hover:to-[#0F3E72] text-white rounded-xl shadow-md px-6 py-6 text-base font-bold tracking-wide transition-all"
                  >
                    Request a Consultation
                  </Button>
                </div>
                
                <p className="text-xs text-center text-slate-500 mt-4">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
