import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search, Bell, MessageSquare } from 'lucide-react';
import { SellerSidebar } from './SellerSidebar';
import { SellerProfileMenu } from './SellerProfileMenu';
import { Input } from '@/components/ui/input';
import { useSellerStore } from '@/store/useSellerStore';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';

export function SellerHeader() {
  const { conversations } = useSellerStore();
  const unreadMessagesCount = conversations.filter((c) => c.unreadCount > 0).length;
  
  const { data: unreadNotifications } = useUnreadNotificationCount();
  const unreadNotificationsCount = unreadNotifications?.count || 0;

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
            <SheetTitle className="sr-only">Seller Navigation Menu</SheetTitle>
            <SellerSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block text-[15px] font-medium text-slate-500">
          Dashboard
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/buyer" className="hidden sm:block">
          <button className="relative group flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></span>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            Switch to Buy
          </button>
        </Link>

        {/* Messages */}
        <Link
          to="/seller/enquiries"
          aria-label={
            unreadMessagesCount > 0
              ? `Enquiries — ${unreadMessagesCount} unread`
              : 'Enquiries'
          }
          className="relative text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1.5 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Link>

        {/* Notifications */}
        <Link
          to="/seller/notifications"
          aria-label={
            unreadNotificationsCount > 0
              ? `Notifications — ${unreadNotificationsCount} unread`
              : 'Notifications'
          }
          className="relative text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Link>

        <SellerProfileMenu />
      </div>
    </header>
  );
}
