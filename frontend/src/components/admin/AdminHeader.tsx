import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileMenu } from './AdminProfileMenu';
import { useAdminStore } from '@/store/useAdminStore';

export function AdminHeader() {
  const { notifications } = useAdminStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <AdminSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg hidden sm:inline-block">Admin Portal</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3 md:gap-4 ml-4">
        <Button variant="ghost" size="icon" className="relative hidden sm:flex" onClick={() => window.location.href = '/admin/notifications'}>
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-destructive text-destructive-foreground border-2 border-card">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <div className="h-8 w-px bg-border hidden sm:block" />
        <AdminProfileMenu />
      </div>
    </header>
  );
}
