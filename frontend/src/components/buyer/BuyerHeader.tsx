import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, MessageSquare } from 'lucide-react';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BuyerSidebar } from './BuyerSidebar';
import { BuyerProfileMenu } from './BuyerProfileMenu';
import { NotificationPopover } from '@/components/buyer/NotificationPopover';

export function BuyerHeader() {
  const { unreadMessageCount } = useBuyerStore();

  return (
    <header className="h-[64px] border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30 w-full shrink-0">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-slate-500 hover:text-slate-700 focus:outline-none" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Buyer Navigation Menu</SheetTitle>
            <BuyerSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block text-[15px] font-medium text-slate-500">
          Dashboard
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/seller/dashboard" className="hidden sm:block">
          <button className="relative group flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></span>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            Switch to Sell
          </button>
        </Link>

        <Link to="/buyer/messages" aria-label="Messages" className="relative text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {unreadMessageCount > 0 && (
            <span className="absolute -top-1 -right-1.5 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Link>

        <NotificationPopover />

        <BuyerProfileMenu />
      </div>
    </header>
  );
}
