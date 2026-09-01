import { Badge } from '../../ui/badge';
import type { AdminUserRole } from '../../../store/useAdminStore';
import { Shield, User, Store } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminUserRoleBadgeProps {
  role: AdminUserRole;
  className?: string;
}

export function AdminUserRoleBadge({ role, className }: AdminUserRoleBadgeProps) {
  const config: Record<AdminUserRole, { label: string; icon: any; className: string; variant: 'default' | 'secondary' | 'outline' }> = {
    admin: {
      label: 'Admin',
      icon: Shield,
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      variant: 'outline'
    },
    seller: {
      label: 'Seller',
      icon: Store,
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      variant: 'outline'
    },
    buyer: {
      label: 'Buyer',
      icon: User,
      className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      variant: 'outline'
    }
  };

  const { label, icon: Icon, className: roleClass, variant } = config[role] || config.buyer;

  return (
    <Badge
      variant={variant}
      className={cn("gap-1 font-medium", roleClass, className)}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
