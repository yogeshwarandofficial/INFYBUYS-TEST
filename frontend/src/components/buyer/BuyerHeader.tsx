import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, MessageSquare } from 'lucide-react';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BuyerSidebar } from './BuyerSidebar';
import { BuyerProfileMenu } from './BuyerProfileMenu';
import { Input } from '@/components/ui/input';
import { NotificationPopover } from '@/components/buyer/NotificationPopover';

export function BuyerHeader() {
  const { unreadMessageCount } = useBuyerStore();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <BuyerSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block text-sm text-muted-foreground">
          <Link to="/buyer" className="hover:text-foreground">Dashboard</Link>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search businesses..." className="pl-9 bg-muted/50 w-full" />
        </div>

        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search">
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Link to="/buyer/messages" aria-label="Messages" className="relative">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            {unreadMessageCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            )}
          </Button>
        </Link>

        <NotificationPopover />

        <BuyerProfileMenu />
      </div>
    </header>
  );
}
