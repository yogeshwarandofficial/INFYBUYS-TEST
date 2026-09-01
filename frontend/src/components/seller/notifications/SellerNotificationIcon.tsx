import { type SellerNotificationType } from '@/store/useSellerStore';
import { cn } from '@/lib/utils';
import {
  Building2,
  User,
  MessageSquare,
  CreditCard,
  CheckCircle,
  FileText,
  Bell,
  Activity
} from 'lucide-react';

interface SellerNotificationIconProps {
  type: SellerNotificationType;
  className?: string;
}

export function SellerNotificationIcon({ type, className }: SellerNotificationIconProps) {
  const baseClasses = 'w-9 h-9 rounded-full flex items-center justify-center shrink-0 border mt-0.5';

  switch (type) {
    case 'listing':
      return (
        <div className={cn(baseClasses, 'bg-blue-500/10 border-blue-500/20 text-blue-500', className)} aria-hidden="true">
          <Building2 className="w-4 h-4" />
        </div>
      );
    case 'enquiry':
      return (
        <div className={cn(baseClasses, 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500', className)} aria-hidden="true">
          <User className="w-4 h-4" />
        </div>
      );
    case 'message':
      return (
        <div className={cn(baseClasses, 'bg-purple-500/10 border-purple-500/20 text-purple-500', className)} aria-hidden="true">
          <MessageSquare className="w-4 h-4" />
        </div>
      );
    case 'subscription':
    case 'payment':
      return (
        <div className={cn(baseClasses, 'bg-amber-500/10 border-amber-500/20 text-amber-500', className)} aria-hidden="true">
          <CreditCard className="w-4 h-4" />
        </div>
      );
    case 'approval':
      return (
        <div className={cn(baseClasses, 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500', className)} aria-hidden="true">
          <CheckCircle className="w-4 h-4" />
        </div>
      );
    case 'nda':
      return (
        <div className={cn(baseClasses, 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500', className)} aria-hidden="true">
          <FileText className="w-4 h-4" />
        </div>
      );
    case 'system':
      return (
        <div className={cn(baseClasses, 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500 dark:text-zinc-400', className)} aria-hidden="true">
          <Bell className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className={cn(baseClasses, 'bg-muted border-border text-muted-foreground', className)} aria-hidden="true">
          <Activity className="w-4 h-4" />
        </div>
      );
  }
}
