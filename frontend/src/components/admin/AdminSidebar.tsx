import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  Bell,
  BarChart3,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  badge?: string;
  badgeColor?: string;
  indicatorColor?: string;
};

const overviewLinks: SidebarLink[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'KYC Verifications', href: '/admin/kyc', icon: ShieldCheck, badge: '12', badgeColor: 'teal' },
  { title: 'Listings', href: '/admin/listings', icon: Package },
];

const insightsLinks: SidebarLink[] = [
  { title: 'Notifications', href: '/admin/notifications', icon: Bell, indicatorColor: 'indigo' },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Reports', href: '/admin/reports', icon: FileText },
];

export function AdminSidebar({ collapsed, setCollapsed, isMobile }: SidebarProps) {
  const location = useLocation();

  const renderLinks = (links: SidebarLink[]) => {
    return links.map((link) => {
      const isActive = link.exact 
        ? location.pathname === link.href 
        : location.pathname.startsWith(link.href) && link.href !== '/admin';

      return (
        <TooltipProvider delayDuration={0} key={link.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={link.href}
                className={cn(
                  "group relative flex items-center justify-between py-3 mr-4 rounded-r-full transition-all duration-300 cursor-pointer overflow-hidden",
                  isActive ? "bg-blue-600" : "hover:bg-white/5",
                  collapsed && !isMobile ? "justify-center pl-0" : "pl-6"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,0.4)]"></div>
                )}
                
                <div className="flex items-center gap-3.5 z-10">
                  <link.icon className={cn(
                    "w-5 h-5 transition-all duration-300 shrink-0",
                    isActive ? "text-white group-hover:scale-110" : "text-slate-400 group-hover:text-white group-hover:scale-110"
                  )} />
                  {(!collapsed || isMobile) && (
                    <span className={cn(
                      "text-sm transition-all duration-300",
                      isActive ? "font-semibold text-white tracking-wide" : "font-medium text-slate-400 group-hover:text-white group-hover:translate-x-1"
                    )}>
                      {link.title}
                    </span>
                  )}
                </div>

                {(!collapsed || isMobile) && link.badge && (
                  <span className={cn(
                    "py-0.5 px-2 rounded-full text-[10px] font-bold transition-transform group-hover:scale-105",
                    link.badgeColor === 'teal' ? "bg-teal-50 text-teal-600 ring-1 ring-teal-100" : ""
                  )}>
                    {link.badge}
                  </span>
                )}
                
                {(!collapsed || isMobile) && link.indicatorColor && (
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    link.indicatorColor === 'indigo' ? "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" : ""
                  )}></span>
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
      "bg-transparent flex flex-col h-full flex-shrink-0 z-20 transition-all duration-300",
      collapsed && !isMobile ? "w-20" : "w-[260px]"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "h-24 flex items-center border-b border-white/10 transition-all",
        collapsed && !isMobile ? "justify-center px-0" : "px-6"
      )}>
        <Link to="/admin" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </div>
          {(!collapsed || isMobile) && (
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300 truncate">
              InfyBuys <span className="font-medium text-slate-400">Admin</span>
            </h1>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-6 px-2 md:px-4 flex flex-col gap-6">
        
        {/* Main Menu Section */}
        <div>
          {(!collapsed || isMobile) && (
            <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 select-none">Overview</h3>
          )}
          <nav className="space-y-1.5">
            {renderLinks(overviewLinks)}
          </nav>
        </div>

        {/* Insights Section */}
        <div>
          {(!collapsed || isMobile) && (
            <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 select-none">Insights</h3>
          )}
          <nav className="space-y-1.5">
            {renderLinks(insightsLinks)}
          </nav>
        </div>
      </div>
      
      {/* Bottom Settings / Collapse Area */}
      {!isMobile && (
        <div className={cn("p-6 border-t border-white/10 bg-transparent", collapsed ? "p-4" : "")}>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 group",
              collapsed ? "w-12 h-12 justify-center mx-auto p-0" : "w-full px-4 py-2.5"
            )}
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
