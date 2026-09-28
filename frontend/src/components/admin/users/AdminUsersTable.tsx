import type { AdminUser } from '../../../store/useAdminStore';
import { AdminUserActions } from './AdminUserActions';
import { formatDistanceToNow, format } from 'date-fns';
import { Check, X, ShieldAlert, Store, User } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminUsersTableProps {
  users: AdminUser[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldAlert className="w-[10px] h-[10px] text-slate-300" />;
      case 'seller': return <Store className="w-[10px] h-[10px] text-slate-300" />;
      case 'buyer':
      default:
        return <User className="w-[10px] h-[10px] text-slate-300" />;
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-white border-b border-slate-200">
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-1/4">User</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Verification</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Login</th>
          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {users.map((user) => (
          <tr 
            key={user.id} 
            className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            {/* User Column */}
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shadow-sm shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
            </td>
            
            {/* Role Column */}
            <td className="py-4 px-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-medium shadow-sm capitalize">
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </td>
            
            {/* Status Column */}
            <td className="py-4 px-6">
              {user.status === 'active' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              )}
              {user.status === 'pending' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  Pending
                </span>
              )}
              {user.status === 'suspended' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                  </span>
                  Suspended
                </span>
              )}
              {user.status === 'blocked' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-500"></span>
                  </span>
                  Blocked
                </span>
              )}
            </td>
            
            {/* Verification Column */}
            <td className="py-4 px-6">
              <div className="flex items-center justify-center gap-2">
                {user.emailVerified ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 cursor-help" title="Email Verified">
                    <Check className="w-[10px] h-[10px]" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 cursor-help" title="Email Not Verified">
                    <X className="w-[10px] h-[10px]" strokeWidth={3} />
                  </div>
                )}
                {user.phoneVerified ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 cursor-help" title="Phone Verified">
                    <Check className="w-[10px] h-[10px]" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 cursor-help" title="Phone Not Verified">
                    <X className="w-[10px] h-[10px]" strokeWidth={3} />
                  </div>
                )}
              </div>
            </td>
            
            {/* Company Column */}
            <td className="py-4 px-6 text-sm text-slate-500">
              {user.company || '-'}
            </td>
            
            {/* Last Login Column */}
            <td className="py-4 px-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  {user.lastLoginAt ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true }) : 'Never'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </td>
            
            {/* Actions Column */}
            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
              <AdminUserActions user={user} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
