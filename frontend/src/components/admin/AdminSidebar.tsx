import { NavLink } from 'react-router';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const adminLinks = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Sellers',
    href: '/admin/sellers',
    icon: UserCheck,
  },
  {
    title: 'KYC Approvals',
    href: '/admin/kyc',
    icon: FileText,
  },
  {
    title: 'Buyers',
    href: '/admin/buyers',
    icon: ShoppingBag,
  },
  {
    title: 'Listings',
    href: '/admin/listings',
    icon: Package,
  },
  {
    title: 'Enquiries',
    href: '/admin/enquiries',
    icon: HelpCircle,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'Activity Log',
    href: '/admin/activity',
    icon: ClipboardList,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <div className="w-64 border-r bg-card h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          InfyBuys Admin
        </span>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <link.icon className="w-5 h-5" />
              {link.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
