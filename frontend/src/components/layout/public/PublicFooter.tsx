import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Globe, MessageSquare } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#0B152A] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-6 block">
              InfyBuys.
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              The premier marketplace for buying and selling profitable online businesses, SaaS, and digital assets.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-[#0B4C8C] transition-colors">
                <Mail className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-[#0B4C8C] transition-colors">
                <Globe className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-[#0B4C8C] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Marketplace</h4>
            <ul className="space-y-4">
              <li><Link to="/search?category=Technology" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Browse Technology</Link></li>
              <li><Link to="/search?category=E-commerce" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Browse E-Commerce</Link></li>
              <li><Link to="/search?category=Professional Services" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Browse Services</Link></li>
              <li><Link to="/sell" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Sell your business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/blog" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Blog</Link></li>
              <li><Link to="/guides" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Valuation Guides</Link></li>
              <li><Link to="/help" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-brand-blue transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Get the latest premium listings delivered to your inbox.</p>
            <form className="space-y-3">
              <Input type="email" placeholder="Your email address" className="text-white placeholder:text-white-600 h-10 rounded-lg" />
              <Button className="w-full h-10 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-lg tracking-wide">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} InfyBuys. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
