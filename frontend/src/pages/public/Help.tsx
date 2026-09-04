import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';
import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Store, 
  FileEdit, 
  UserCircle, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown
} from 'lucide-react';

const FAQS = [
  {
    question: "What is InfyBuys?",
    answer: "InfyBuys is a premium marketplace designed to connect buyers and sellers of digital businesses, SaaS platforms, e-commerce stores, and other digital assets in a secure, streamlined environment."
  },
  {
    question: "How do I find a business to buy?",
    answer: "You can use our Browse page to search and filter active listings by category, revenue, profit, and business model. Once you find an interesting listing, you can unlock more details by signing an NDA."
  },
  {
    question: "How can I list my business on InfyBuys?",
    answer: "Sellers can create an account, complete their profile, and use our guided listing creation process to upload their business details, financial records, and operational metrics for review by our team."
  },
  {
    question: "What information should I provide when creating a listing?",
    answer: "You will need to provide accurate trailing 12-month financials (P&L), traffic data, customer metrics, operational SOPs, and proof of ownership. The more comprehensive your data, the higher buyer trust will be."
  },
  {
    question: "How can I evaluate a business before buying?",
    answer: "Review the provided prospectus carefully. Look for revenue consistency, customer concentration, and owner involvement. Always perform your own thorough due diligence before making an offer."
  },
  {
    question: "What is business valuation?",
    answer: "Business valuation is the process of determining the economic value of a digital asset. It typically relies on a multiple of Seller's Discretionary Earnings (SDE) or EBITDA, adjusted for growth, defensibility, and risk."
  },
  {
    question: "How can I contact a seller?",
    answer: "Once you have signed the NDA for a specific listing and been approved by the seller, you can use our built-in messaging system to ask questions directly and negotiate terms."
  },
  {
    question: "How does advisory support work?",
    answer: "InfyBuys offers premium advisory support to help both buyers and sellers navigate complex transactions, valuation, negotiations, and asset migration securely."
  },
  {
    question: "How can I update my listing?",
    answer: "You can update your listing details at any time from your Seller Dashboard. Note that significant changes to financials or asking price may require re-approval from our team."
  },
  {
    question: "Where can I get additional help?",
    answer: "If you cannot find the answer you are looking for in this Help Center, you can reach out to our support team directly via the Contact Us page."
  }
];

export default function Help() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Seo
        title="Help Center - InfyBuys"
        description="Find answers, guidance, and helpful information about buying, selling, listing, and discovering businesses on InfyBuys."
      />

      {/* 1. HELP CENTER HERO */}
      <section className="relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
 <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788434105/1832a48c-b7e4-4485-b2e2-ab0698db80dd_xwodn5.png")' }}
      >
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
      </div>

        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              HELP CENTER
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              How Can We <span className="text-[#00B8E6]">Help You?</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
              Find answers, guidance, and helpful information about buying, selling, listing, and discovering businesses on InfyBuys.
            </p>

            <div className="w-full max-w-3xl relative group mx-auto mt-2">
              <input
                type="text"
                placeholder="Find Listings, Categories, Or Enter A Listing ID..."
                className="w-full pl-8 pr-20 py-5 md:py-6 rounded-full border border-slate-700/50 bg-[#0B152A] shadow-2xl text-base md:text-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B4C8C] focus:ring-4 focus:ring-[#0B4C8C]/20 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 transition-colors shadow-md">
                  <Search className="w-6 h-6 md:w-7 md:h-7 text-[#0B4C8C]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK HELP CATEGORIES */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A] mb-4">
              How Can We Help?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <ShoppingBag className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Buying a Business</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Help users understand how to discover, evaluate, and acquire businesses listed on InfyBuys.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <Store className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Selling a Business</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain how sellers can prepare and list their businesses for potential buyers.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <FileEdit className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Creating a Listing</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain the basic steps involved in creating and managing a business listing.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <UserCircle className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Account & Profile</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Provide guidance about account, profile, and user-related questions.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <CreditCard className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Payments & Advisory</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain general information about advisory services, payments, and related processes.</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden rounded-2xl cursor-pointer">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#0B4C8C]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B4C8C] transition-colors duration-300">
                  <ShieldCheck className="w-7 h-7 text-[#0B4C8C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors">Safety & Verification</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">Explain how users can approach verification, due diligence, and safe business transactions.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'border-[#0B4C8C] bg-[#0B4C8C]/5 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span className={`font-bold text-lg pr-8 ${openFaqIndex === index ? 'text-[#0B4C8C]' : 'text-[#0B152A]'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-[#0B4C8C]' : 'text-slate-400'}`} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BUYER HELP & 5. SELLER HELP */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Buyer Help */}
            <div>
              <div className="mb-10 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-extrabold text-[#0B152A]">
                  Buying a Business on InfyBuys
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Browse Businesses", desc: "Use advanced filters to discover opportunities that match your budget and criteria." },
                  { step: "02", title: "Filter & Compare Opportunities", desc: "Compare multiple listings side-by-side to understand market benchmarks." },
                  { step: "03", title: "Review Business Information", desc: "Sign NDAs to unlock detailed prospectuses and operational data." },
                  { step: "04", title: "Evaluate Financial & Operational Details", desc: "Analyze P&L statements, traffic sources, and customer metrics." },
                  { step: "05", title: "Contact the Seller", desc: "Open a secure dialogue with the seller to ask questions and negotiate." },
                  { step: "06", title: "Complete Your Due Diligence", desc: "Verify all claims and proceed with a secure transaction." },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-slate-200 bg-white font-bold text-slate-400 text-sm z-10 shrink-0 mb-3 md:mb-0 md:mr-6">
                      {item.step}
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 w-full">
                      <h4 className="font-bold text-[#0B152A] mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Help */}
            <div>
              <div className="mb-10 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-extrabold text-[#0B152A]">
                  Selling Your Business on InfyBuys
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Prepare Your Business Information", desc: "Organize your financials, SOPs, and metrics for buyer review." },
                  { step: "02", title: "Create Your Listing", desc: "Submit your business details through our guided listing wizard." },
                  { step: "03", title: "Add Financial & Business Details", desc: "Provide accurate historical data to support your valuation." },
                  { step: "04", title: "Review Your Listing", desc: "Work with our team to ensure your listing meets our quality standards." },
                  { step: "05", title: "Connect With Potential Buyers", desc: "Review buyer profiles and approve NDAs to share private data." },
                  { step: "06", title: "Move Forward With the Acquisition Process", desc: "Negotiate terms and proceed to secure escrow and closing." },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#0B4C8C]/20 bg-[#0B4C8C]/5 font-bold text-[#0B4C8C] text-sm z-10 shrink-0 mb-3 md:mb-0 md:mr-6">
                      {item.step}
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 w-full relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B4C8C] scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                      <h4 className="font-bold text-[#0B152A] mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. NEED MORE HELP? CTA */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-[#0B152A] mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Our team is here to help you navigate the InfyBuys marketplace and find the information you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-[#0B4C8C] text-white hover:bg-[#0B152A] font-bold text-lg px-8 h-14 rounded-full shadow-lg transition-colors border-none outline-none">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-white border-2 border-[#0B4C8C] text-[#0B4C8C] hover:bg-[#0B4C8C] hover:text-white font-bold text-lg px-8 h-14 rounded-full transition-colors">
              <Link to="/search">
                Explore Businesses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
