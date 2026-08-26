import type { AdminUser } from '../../../store/useAdminStore';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AdminUserStatusBadge } from './AdminUserStatusBadge';
import { AdminUserRoleBadge } from './AdminUserRoleBadge';
import { AdminUserActions } from './AdminUserActions';
import { formatDistanceToNow } from 'date-fns';
import { Building2, Mail, CheckCircle2, XCircle } from 'lucide-react';

interface AdminUserCardProps {
  user: AdminUser;
}

export function AdminUserCard({ user }: AdminUserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg leading-tight truncate max-w-[200px]">
              {user.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{user.email}</span>
            </div>
          </div>
        </div>
        <AdminUserActions user={user} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AdminUserRoleBadge role={user.role} />
              <AdminUserStatusBadge status={user.status} />
            </div>
            {user.company && (
              <div className="flex items-center text-sm text-muted-foreground gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                <Building2 className="h-3.5 w-3.5" />
                <span className="truncate max-w-[100px]">{user.company}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Verifications</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" title="Email Verification">
                  {user.emailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className="text-xs">Email</span>
                </div>
                <div className="flex items-center gap-1" title="Phone Verification">
                  {user.phoneVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className="text-xs">Phone</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Last Login</span>
              <span className="text-xs">
                {user.lastLoginAt
                  ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
                  : 'Never'
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
