import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Globe, MessageSquare } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-muted/50 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-black text-primary tracking-tighter mb-4 block">
              InfyBuys.
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The premier marketplace for buying and selling profitable online businesses, SaaS, and digital assets.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Mail className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Globe className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-3">
              <li><Link to="/search?category=SaaS" className="text-muted-foreground hover:text-primary transition-colors text-sm">Browse SaaS</Link></li>
              <li><Link to="/search?category=E-Commerce" className="text-muted-foreground hover:text-primary transition-colors text-sm">Browse E-Commerce</Link></li>
              <li><Link to="/search?category=Agencies" className="text-muted-foreground hover:text-primary transition-colors text-sm">Browse Agencies</Link></li>
              <li><Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sell your business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors text-sm">Valuation Guides</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">Get the latest premium listings delivered to your inbox.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" className="bg-background" />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} InfyBuys. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
