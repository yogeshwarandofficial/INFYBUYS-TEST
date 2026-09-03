import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  List,
  MessageSquare,
  Mail,
  Bell,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

const navItems = [
  { title: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { title: 'My Listings', path: '/seller/listings', icon: List },
  { title: 'Enquiries', path: '/seller/enquiries', icon: Mail },
  { title: 'Messages', path: '/seller/messages', icon: MessageSquare },
  { title: 'Notifications', path: '/seller/notifications', icon: Bell },
  { title: 'Analytics', path: '/seller/analytics', icon: BarChart },
  { title: 'Profile', path: '/seller/profile', icon: User },
  { title: 'Settings', path: '/seller/settings', icon: Settings },
];

export function SellerSidebar({ collapsed, setCollapsed, isMobile }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#0B152A] text-slate-300 transition-all duration-300",
      collapsed && !isMobile ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!collapsed || isMobile ? (
          <Link to="/seller" className="font-bold text-lg tracking-tight truncate text-white">
            Seller Portal
          </Link>
        ) : (
          <div className="w-8 h-8 mx-auto bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
            S
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
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/seller');
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                        isActive
                          ? "bg-[#0B4C8C] text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white",
                        collapsed && !isMobile ? "justify-center px-0" : ""
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "")} />
                      {(!collapsed || isMobile) && <span className="truncate">{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                        <TooltipContent side="right">
                          {item.title}
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
