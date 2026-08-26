import type { AdminUser } from '../../../store/useAdminStore';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AdminUserStatusBadge } from './AdminUserStatusBadge';
import { AdminUserRoleBadge } from './AdminUserRoleBadge';
import { AdminUserActions } from './AdminUserActions';
import { formatDistanceToNow, format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AdminUsersTableProps {
  users: AdminUser[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">User</th>
              <th scope="col" className="px-6 py-4 font-medium">Role</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
              <th scope="col" className="px-6 py-4 font-medium">Verification</th>
              <th scope="col" className="px-6 py-4 font-medium">Company</th>
              <th scope="col" className="px-6 py-4 font-medium">Last Login</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-muted-foreground text-xs">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminUserRoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <AdminUserStatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center" title="Email Verification">
                      {user.emailVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex items-center" title="Phone Verification">
                      {user.phoneVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-muted-foreground">{user.company || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>
                      {user.lastLoginAt
                        ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
                        : 'Never'
                      }
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <AdminUserActions user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
