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
    <header className="h-16 border-b border-[#E5E9F2] bg-white/90 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Seller Navigation Menu</SheetTitle>
            <SellerSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block text-sm text-muted-foreground">
          <Link to="/seller" className="hover:text-foreground">Dashboard</Link>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Messages */}
        <Link
          to="/seller/enquiries"
          aria-label={
            unreadMessagesCount > 0
              ? `Enquiries — ${unreadMessagesCount} unread`
              : 'Enquiries'
          }
          className="relative"
        >
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            {unreadMessagesCount > 0 && (
              <span
                className="absolute top-1 right-1.5 min-w-[16px] h-4 rounded-full bg-destructive border-2 border-background text-[9px] font-bold text-destructive-foreground flex items-center justify-center px-0.5"
                aria-hidden="true"
              >
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Notifications */}
        <Link
          to="/seller/notifications"
          aria-label={
            unreadNotificationsCount > 0
              ? `Notifications — ${unreadNotificationsCount} unread`
              : 'Notifications'
          }
          className="relative"
        >
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadNotificationsCount > 0 && (
              <span
                className="absolute top-1 right-1.5 min-w-[16px] h-4 rounded-full bg-destructive border-2 border-background text-[9px] font-bold text-destructive-foreground flex items-center justify-center px-0.5"
                aria-hidden="true"
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </Button>
        </Link>

        <SellerProfileMenu />
      </div>
    </header>
  );
}
