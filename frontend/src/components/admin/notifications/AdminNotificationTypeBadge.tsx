import { Badge } from '../../ui/badge';
import type { AdminNotificationType } from '../../../store/useAdminStore';
import {
  Bell,
  User,
  Store,
  ShoppingBag,
  Package,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Megaphone
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminNotificationTypeBadgeProps {
  type: AdminNotificationType;
  className?: string;
}

export function AdminNotificationTypeBadge({ type, className }: AdminNotificationTypeBadgeProps) {
  const config: Record<AdminNotificationType, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    system: { label: 'System', icon: Bell, className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700', variant: 'outline' },
    user: { label: 'User', icon: User, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800', variant: 'secondary' },
    seller: { label: 'Seller', icon: Store, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800', variant: 'secondary' },
    buyer: { label: 'Buyer', icon: ShoppingBag, className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', variant: 'secondary' },
    listing: { label: 'Listing', icon: Package, className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800', variant: 'secondary' },
    enquiry: { label: 'Enquiry', icon: HelpCircle, className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', variant: 'secondary' },
    message: { label: 'Message', icon: MessageSquare, className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800', variant: 'secondary' },
    security: { label: 'Security', icon: ShieldAlert, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800', variant: 'destructive' },
    announcement: { label: 'Announcement', icon: Megaphone, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800', variant: 'secondary' }
  };

  const { label, icon: Icon, className: variantClassName, variant } = config[type];

  return (
    <Badge
      variant={variant}
      className={cn('capitalize flex w-fit items-center gap-1 font-medium', variantClassName, className)}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
