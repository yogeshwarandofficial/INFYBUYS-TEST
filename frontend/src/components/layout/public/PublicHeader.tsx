import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Search, Menu } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { GlobalSearch } from './GlobalSearch';

import { useUserStore } from '@/store/useUserStore';
import { BuyerProfileMenu } from '@/components/buyer/BuyerProfileMenu';
import { SellerProfileMenu } from '@/components/seller/SellerProfileMenu';
import { AdminProfileMenu } from '@/components/admin/AdminProfileMenu';

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderUserMenu = () => {
    if (!user) {
      return (
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
          <Button variant="ghost" asChild className="text-white hover:text-brand-blue hover:bg-transparent uppercase tracking-widest text-xs font-semibold">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full uppercase tracking-widest text-xs font-semibold px-6">
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
        {user.roles?.includes('admin') ? (
          <AdminProfileMenu />
        ) : user.roles?.includes('seller') ? (
          <SellerProfileMenu />
        ) : (
          <BuyerProfileMenu />
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#0A0E1A]/60 backdrop-blur-[16px] saturate-[150%] border-white/10 shadow-sm py-3'
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white hover:text-brand-blue transition-colors">
              InfyBuys.
            </Link>
            <div className="hidden lg:block">
              <DesktopNav />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {renderUserMenu()}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
