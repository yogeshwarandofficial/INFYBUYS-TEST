import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  Package,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

const adminLinks = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Sellers', href: '/admin/sellers', icon: UserCheck },
  { title: 'Buyers', href: '/admin/buyers', icon: ShoppingBag },
  { title: 'Listings', href: '/admin/listings', icon: Package },
  { title: 'Enquiries', href: '/admin/enquiries', icon: HelpCircle },
  { title: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { title: 'Notifications', href: '/admin/notifications', icon: Bell },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Reports', href: '/admin/reports', icon: FileText },
  { title: 'Activity Log', href: '/admin/activity', icon: ClipboardList },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ collapsed, setCollapsed, isMobile }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#0B152A] text-slate-300 transition-all duration-300",
      collapsed && !isMobile ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!collapsed || isMobile ? (
          <Link to="/admin" className="font-bold text-xl tracking-tight truncate text-white">
            InfyBuys Admin
          </Link>
        ) : (
          <div className="w-8 h-8 mx-auto bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
            A
          </div>
        )}

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto text-slate-400 hover:text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <TooltipProvider delayDuration={0}>
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.href || (location.pathname.startsWith(link.href) && link.href !== '/admin');
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                        isActive
                          ? "bg-[#0B4C8C] text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white",
                        collapsed && !isMobile ? "justify-center px-0" : ""
                      )}
                    >
                      <link.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "")} />
                      {(!collapsed || isMobile) && <span className="truncate">{link.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                    <TooltipContent side="right">
                      {link.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </div>
  );
}
