import { useState } from 'react';
import type { AdminUser } from '../../../store/useAdminStore';
import { useAdminStore } from '../../../store/useAdminStore';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '../../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { MoreHorizontal, Eye, Ban, CheckCircle, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminUserActionsProps {
  user: AdminUser;
}

type ConfirmAction = 'suspend' | 'block' | 'activate' | 'delete' | null;

export function AdminUserActions({ user }: AdminUserActionsProps) {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const {
    suspendUser,
    blockUser,
    activateUser,
    deleteUser,
    updateUserRole,
    addUserActivity
  } = useAdminStore();

  const handleAction = () => {
    if (!confirmAction) return;

    switch (confirmAction) {
      case 'suspend':
        suspendUser(user.id);
        addUserActivity(user.id, { action: 'Account suspended by admin', date: new Date().toISOString() });
        break;
      case 'block':
        blockUser(user.id);
        addUserActivity(user.id, { action: 'Account blocked by admin', date: new Date().toISOString() });
        break;
      case 'activate':
        activateUser(user.id);
        addUserActivity(user.id, { action: 'Account activated by admin', date: new Date().toISOString() });
        break;
      case 'delete':
        deleteUser(user.id);
        // Note: activity wouldn't matter since user is deleted, but we keep it clean.
        break;
    }
    setConfirmAction(null);
  };

  const handleRoleChange = (role: string) => {
    updateUserRole(user.id, role as 'buyer' | 'seller' | 'admin');
    addUserActivity(user.id, { action: `Role changed to ${role} by admin`, date: new Date().toISOString() });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {user.status !== 'active' && (
            <DropdownMenuItem onClick={() => setConfirmAction('activate')}>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              Activate
            </DropdownMenuItem>
          )}

          {user.status === 'active' && (
            <DropdownMenuItem onClick={() => setConfirmAction('suspend')}>
              <Ban className="mr-2 h-4 w-4 text-amber-600" />
              Suspend
            </DropdownMenuItem>
          )}

          {user.status !== 'blocked' && (
            <DropdownMenuItem onClick={() => setConfirmAction('block')}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
              Block
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={user.role} onValueChange={handleRoleChange}>
                <DropdownMenuRadioItem value="buyer">Buyer</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="seller">Seller</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmAction('delete')}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'delete' ? 'Delete User' : `Confirm Action`}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'delete' && `Are you sure you want to delete ${user.name}? This action cannot be undone.`}
              {confirmAction === 'suspend' && `Are you sure you want to suspend ${user.name}? They will not be able to log in.`}
              {confirmAction === 'block' && `Are you sure you want to block ${user.name}? This will restrict all access.`}
              {confirmAction === 'activate' && `Are you sure you want to activate ${user.name}? They will regain full access.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction === 'delete' || confirmAction === 'block' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
