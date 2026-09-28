import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Search,
  Heart,
  Bookmark,
  Mail,
  ShieldCheck,
  MessageSquare,
  Bell,
  CreditCard,
  Receipt,
  Settings,
  Star,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useBuyerStore } from '@/store/useBuyerStore';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

type SidebarLink = {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string | number;
  badgeColor?: string;
  indicatorColor?: string;
};

export function BuyerSidebar({ collapsed, setCollapsed, isMobile }: SidebarProps) {
  const location = useLocation();
  const { data: unreadData } = useUnreadNotificationCount();
  const { unreadMessageCount } = useBuyerStore();
  const unreadNotificationsCount = unreadData?.count || 0;

  const overviewLinks: SidebarLink[] = [
    { title: 'Dashboard', href: '/buyer', icon: LayoutDashboard, exact: true },
    { title: 'Discover', href: '/buyer/browse', icon: Search },
    { title: 'Saved Listings', href: '/buyer/favorites', icon: Heart },
    { title: 'Saved Searches', href: '/buyer/saved-searches', icon: Bookmark },
  ];

  const dealsLinks: SidebarLink[] = [
    { title: 'Enquiries', href: '/buyer/enquiries', icon: Mail },
    { title: 'Signed NDAs', href: '/buyer/nda', icon: ShieldCheck },
    {
      title: 'Messages',
      href: '/buyer/messages',
      icon: MessageSquare,
      badge: unreadMessageCount > 0 ? (unreadMessageCount > 99 ? '99+' : unreadMessageCount) : undefined,
      badgeColor: 'blue'
    },
    { title: 'My Reviews', href: '/buyer/reviews', icon: Star },
  ];

  const accountLinks: SidebarLink[] = [
    {
      title: 'Notifications',
      href: '/buyer/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? (unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount) : undefined,
      badgeColor: 'rose',
      indicatorColor: unreadNotificationsCount > 0 ? 'rose' : undefined
    },
    { title: 'Subscription', href: '/buyer/subscription', icon: CreditCard },
    { title: 'Billing & Invoices', href: '/buyer/billing', icon: Receipt },
    { title: 'Settings', href: '/buyer/settings', icon: Settings },
  ];

  const renderLinks = (links: SidebarLink[]) => {
    return links.map((link) => {
      const isActive = link.exact
        ? location.pathname === link.href
        : location.pathname.startsWith(link.href) && link.href !== '/buyer';

      return (
        <TooltipProvider delayDuration={0} key={link.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={link.href}
                className={cn(
                  "group relative flex items-center justify-between py-2.5 mr-4 rounded-r-full transition-all duration-300 cursor-pointer overflow-hidden",
                  isActive ? "bg-[#1d4ed8]" : "hover:bg-white/5",
                  collapsed && !isMobile ? "justify-center pl-0" : "pl-6"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
                )}

                <div className="flex items-center gap-3.5 z-10 min-w-0">
                  <link.icon className={cn(
                    "w-5 h-5 transition-all duration-300 shrink-0",
                    isActive ? "text-white group-hover:scale-110" : "text-slate-400 group-hover:text-white group-hover:scale-110"
                  )} />
                  {(!collapsed || isMobile) && (
                    <span className={cn(
                      "text-sm transition-all duration-300 truncate",
                      isActive ? "font-semibold text-white tracking-wide" : "font-medium text-slate-400 group-hover:text-white group-hover:translate-x-1"
                    )}>
                      {link.title}
                    </span>
                  )}
                </div>

                {(!collapsed || isMobile) && link.badge && (
                  <span className={cn(
                    "py-0.5 px-2 rounded-full text-[10px] font-bold transition-transform group-hover:scale-105 shrink-0",
                    link.badgeColor === 'teal' && "bg-teal-50 text-teal-600 ring-1 ring-teal-100",
                    link.badgeColor === 'blue' && "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
                    link.badgeColor === 'rose' && "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                  )}>
                    {link.badge}
                  </span>
                )}

                {(!collapsed || isMobile) && !link.badge && link.indicatorColor && (
                  <span className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    link.indicatorColor === 'indigo' && "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]",
                    link.indicatorColor === 'rose' && "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                  )} />
                )}
              </Link>
            </TooltipTrigger>
            {collapsed && !isMobile && (
              <TooltipContent side="right">
                {link.title}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  return (
    <aside className={cn(
      "bg-transparent flex flex-col h-full flex-shrink-0 z-20 transition-all duration-300 select-none",
      collapsed && !isMobile ? "w-20" : "w-[260px]"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "h-[64px] flex items-center border-b border-white/10 transition-all shrink-0",
        collapsed && !isMobile ? "justify-center px-0" : "px-6"
      )}>
        <Link to="/buyer" className="flex items-center group cursor-pointer w-full">
          <div className="w-8 h-8 rounded-lg bg-[#0f44ff] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          {(!collapsed || isMobile) && (
            <div className="ml-3 flex items-baseline tracking-tight truncate">
              <span className="text-[17px] font-bold text-white">InfyBuys</span>
              <span className="text-[16px] font-medium text-slate-400 ml-1.5">Buyer</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-6 px-2 md:px-4 flex flex-col gap-6">
        {/* Overview Section */}
        <div>
          {(!collapsed || isMobile) && (
            <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Overview
            </h3>
          )}
          <nav className="space-y-1">
            {renderLinks(overviewLinks)}
          </nav>
        </div>

        {/* Deals & Activity Section */}
        <div>
          {(!collapsed || isMobile) && (
            <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Deals & Inquiries
            </h3>
          )}
          <nav className="space-y-1">
            {renderLinks(dealsLinks)}
          </nav>
        </div>

        {/* Account & Billing Section */}
        <div>
          {(!collapsed || isMobile) && (
            <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Account & Billing
            </h3>
          )}
          <nav className="space-y-1">
            {renderLinks(accountLinks)}
          </nav>
        </div>
      </div>

      {/* Bottom Collapse Area */}
      {!isMobile && (
        <div className={cn("p-4 border-t border-white/10 bg-transparent shrink-0", collapsed ? "p-3" : "")}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 group",
              collapsed ? "w-12 h-12 justify-center mx-auto p-0" : "w-full px-4 py-2.5"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform duration-300" />
            ) : (
              <PanelLeftClose className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
            )}
            {!collapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
