import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Check, Trash2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useSellerStore } from '@/store/useSellerStore';

export function SellerNotificationActions() {
  const { markAllNotificationsAsRead, deleteAllReadNotifications, clearAllNotifications } = useSellerStore();
  const [showClearDialog, setShowClearDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" aria-hidden="true" />
            Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={markAllNotificationsAsRead}>
            <Check className="w-4 h-4 mr-2" aria-hidden="true" />
            Mark all as read
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteAllReadNotifications}>
            <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
            Delete all read
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowClearDialog(true)}
          >
            <ShieldAlert className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all notifications?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all your notifications,
              including unread ones.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearAllNotifications();
                setShowClearDialog(false);
              }}
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
