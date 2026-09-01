import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminNotification } from '../../../store/useAdminStore';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { MoreVertical, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminNotificationActionsProps {
  notification: AdminNotification;
}

export function AdminNotificationActions({ notification }: AdminNotificationActionsProps) {
  const store = useAdminStore();
  const navigate = useNavigate();
  const [actionDialog, setActionDialog] = useState<{ type: string; title: string; description: string; destructive?: boolean } | null>(null);

  const handleAction = () => {
    if (!actionDialog) return;

    if (actionDialog.type === 'delete') {
      store.deleteAdminNotification(notification.id);
    }

    setActionDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open notification actions menu">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {notification.link && (
            <DropdownMenuItem onClick={() => {
              if (!notification.isRead) {
                store.markAdminNotificationRead(notification.id);
              }
              navigate(notification.link!);
            }}>
              <ExternalLink className="mr-2 h-4 w-4" /> Go to Link
            </DropdownMenuItem>
          )}

          {!notification.isRead && (
            <DropdownMenuItem onClick={() => store.markAdminNotificationRead(notification.id)}>
              <Check className="mr-2 h-4 w-4 text-emerald-600" /> Mark as Read
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Notification', description: 'Are you sure you want to permanently delete this notification? This action cannot be undone.', destructive: true })}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog?.title}</DialogTitle>
            <DialogDescription>
              {actionDialog?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
            <Button variant={actionDialog?.destructive ? 'destructive' : 'default'} onClick={handleAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
