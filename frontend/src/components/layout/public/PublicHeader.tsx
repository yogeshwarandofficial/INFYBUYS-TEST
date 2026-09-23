import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Search, Menu, Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { GlobalSearch } from './GlobalSearch';

import { useUserStore } from '@/store/useUserStore';
import { BuyerProfileMenu } from '@/components/buyer/BuyerProfileMenu';
import { SellerProfileMenu } from '@/components/seller/SellerProfileMenu';
import { AdminProfileMenu } from '@/components/admin/AdminProfileMenu';

const REGIONS = [
  { id: 'GB', label: 'United Kingdom', short: 'UK' },
  { id: 'IN', label: 'India', short: 'IN', comingSoon: true },
  { id: 'AE', label: 'United Arab Emirates', short: 'UAE', comingSoon: true },
  { id: 'US', label: 'United States', short: 'US', comingSoon: true },
  { id: 'EU', label: 'European Union', short: 'EU', comingSoon: true },
  { id: 'SG', label: 'Singapore', short: 'SG', comingSoon: true },
  { id: 'AU', label: 'Australia', short: 'AU', comingSoon: true },
  { id: 'CA', label: 'Canada', short: 'CA', comingSoon: true },
  { id: 'INTL', label: 'International', short: 'INTL', comingSoon: true }
];
export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [regionSearch, setRegionSearch] = useState('');
  const [activePortal, setActivePortal] = useState<'buyer' | 'seller'>(() => 
    (localStorage.getItem('activePortal') as 'buyer' | 'seller') || 'buyer'
  );
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
        <div className="hidden sm:flex items-center gap-4">
          <Button asChild className="bg-white hover:bg-slate-100 text-[#0B4C8C] rounded-md uppercase tracking-widest text-xs font-bold px-5 h-8">
            <Link to="/login">Login</Link>
          </Button>
          <div className="w-[1px] h-4 bg-white/30"></div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-md uppercase tracking-widest text-xs font-bold px-5 h-8">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden sm:flex items-center gap-2">
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
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'is-scrolled bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        {/* Top Blue Bar */}
        <div className="bg-[#0B4C8C] text-white py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Left: Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </a>
            </div>

            {/* Right: Lang & Auth */}
            <div className="flex items-center gap-6 [&_[data-slot=avatar-fallback]]:!bg-white/20 [&_[data-slot=avatar-fallback]]:!text-white [&_[data-slot=avatar-fallback]]:border [&_[data-slot=avatar-fallback]]:border-white/40">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <div className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white opacity-90 hover:opacity-100 cursor-pointer transition-all focus:outline-none">
                    {selectedRegion.id === 'ALL' || selectedRegion.id === 'INTL' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <img 
                        src={`https://flagcdn.com/w20/${selectedRegion.id.toLowerCase()}.png`} 
                        srcSet={`https://flagcdn.com/w40/${selectedRegion.id.toLowerCase()}.png 2x`}
                        alt={selectedRegion.id} 
                        className="w-[18px] object-contain rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.2)]" 
                      />
                    )}
                    <span className="leading-none mt-[1px]">{selectedRegion.short}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-white border border-slate-200 shadow-xl rounded-xl z-[100] p-0 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-slate-100 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search regions..." 
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B4C8C]/20 focus:border-[#0B4C8C] text-slate-800 placeholder:text-slate-400"
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Scrollable Region List */}
                  <div className="max-h-[280px] overflow-y-auto p-2">
                    {REGIONS
                      .filter(r => r.label.toLowerCase().includes(regionSearch.toLowerCase()) || r.short.toLowerCase().includes(regionSearch.toLowerCase()))
                      .map((region) => (
                      <DropdownMenuItem 
                        key={region.id}
                        onClick={(e) => {
                          if (region.comingSoon) {
                            e.preventDefault();
                            return;
                          }
                          setSelectedRegion(region); 
                          setRegionSearch(''); 
                        }}
                        className={`text-sm font-medium py-2.5 px-3 rounded-lg mb-0.5 last:mb-0 transition-colors flex items-center justify-between gap-2.5 ${
                          region.comingSoon 
                            ? 'opacity-60 cursor-not-allowed'
                            : selectedRegion.id === region.id 
                              ? 'bg-blue-50 text-[#0B4C8C] cursor-pointer' 
                              : 'text-[#0B152A] focus:bg-slate-50 focus:text-[#0B4C8C] hover:bg-slate-50 hover:text-[#0B4C8C] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {region.id === 'INTL' ? (
                            <span className="text-base leading-none w-5 text-center">🌍</span>
                          ) : (
                            <img 
                              src={`https://flagcdn.com/w20/${region.id.toLowerCase()}.png`} 
                              srcSet={`https://flagcdn.com/w40/${region.id.toLowerCase()}.png 2x`}
                              alt={region.id} 
                              className={`w-5 object-contain rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.2)] ${region.comingSoon ? 'grayscale' : ''}`} 
                            />
                          )}
                          <span>{region.label}</span>
                        </div>
                        {region.comingSoon && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                    {REGIONS.filter(r => r.label.toLowerCase().includes(regionSearch.toLowerCase()) || r.short.toLowerCase().includes(regionSearch.toLowerCase())).length === 0 && (
                      <div className="py-6 text-center text-sm text-slate-500">
                        No regions found
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {renderUserMenu()}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className={`transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-black tracking-tighter text-blue-600 flex flex-col leading-none">
                InfyBuys<span className={`text-[10px] tracking-[0.2em] font-semibold ${isScrolled ? 'text-[#0B152A]' : 'text-white'} mt-2 uppercase transition-colors`}>Connecting Businesses</span>
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <DesktopNav />
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className={`lg:hidden ${isScrolled ? 'text-[#0B152A] hover:bg-slate-100' : 'text-white hover:text-white/80'}`}
              >
                <Search className="w-5 h-5" />
              </Button>

              <div className="hidden lg:flex items-center gap-2">
                <Link 
                  to="/buyer"
                  onClick={() => {
                    setActivePortal('buyer');
                    localStorage.setItem('activePortal', 'buyer');
                  }}
                  className={`h-9 flex items-center justify-center px-5 rounded-md font-semibold tracking-wide text-sm transition-all ${
                    activePortal === 'buyer' 
                      ? 'bg-gradient-to-r from-[#2069B3] to-[#124B8B] hover:from-[#1A5A9A] hover:to-[#0F3E72] text-white shadow-md border border-[#2B7BCF]/30' 
                      : (isScrolled ? 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                  }`}
                >
                  Buyer
                </Link>
                <Link 
                  to="/seller/listings"
                  onClick={() => {
                    setActivePortal('seller');
                    localStorage.setItem('activePortal', 'seller');
                  }}
                  className={`h-9 flex items-center justify-center px-5 rounded-md font-semibold tracking-wide text-sm transition-all ${
                    activePortal === 'seller' 
                      ? 'bg-gradient-to-r from-[#2069B3] to-[#124B8B] hover:from-[#1A5A9A] hover:to-[#0F3E72] text-white shadow-md border border-[#2B7BCF]/30' 
                      : (isScrolled ? 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                  }`}
                >
                  Seller
                </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${isScrolled ? 'text-[#0B152A] hover:bg-slate-100' : 'text-white hover:text-white/80'}`}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
