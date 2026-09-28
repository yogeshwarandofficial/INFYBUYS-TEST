import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShieldAlert, LogOut, Settings } from 'lucide-react';

export function AdminProfileMenu() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="w-[38px] h-[38px] rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 outline-none" aria-label="Admin Menu">
          <span className="text-[14px] font-semibold text-slate-700 tracking-wide">
            {getInitials(user.name)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/60 p-2 bg-white/95 backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        <DropdownMenuLabel className="font-normal p-3 pb-4">
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-slate-900 leading-none mb-1.5">{user.name}</p>
            <p className="text-xs leading-none text-slate-500">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-blue-700 bg-blue-50/80 w-fit px-2.5 py-1.5 rounded-lg border border-blue-100">
              <ShieldAlert className="w-3.5 h-3.5" /> System Administrator
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 -mx-2 mb-2" />

        <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 transition-colors mb-0.5 outline-none">
          <Settings className="mr-3 h-4 w-4 text-slate-400" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-100 -mx-2 my-2" />

        <DropdownMenuItem onClick={handleLogout} className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors outline-none">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
