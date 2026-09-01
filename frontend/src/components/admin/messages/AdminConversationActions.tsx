import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminConversation, AdminConversationStatus } from '../../../store/useAdminStore';
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
import { MoreVertical, Ban, Eye, Trash2, Archive, MessageSquare } from 'lucide-react';

interface AdminConversationActionsProps {
  conversation: AdminConversation;
}

export function AdminConversationActions({ conversation }: AdminConversationActionsProps) {
  const navigate = useNavigate();
  const store = useAdminStore();
  const [actionDialog, setActionDialog] = useState<{ type: string; title: string; description: string; nextStatus?: AdminConversationStatus; destructive?: boolean } | null>(null);

  const handleAction = () => {
    if (!actionDialog) return;

    if (actionDialog.type === 'update_status' && actionDialog.nextStatus) {
      store.updateConversationStatus(conversation.id, actionDialog.nextStatus);
    } else if (actionDialog.type === 'delete') {
      store.deleteConversation(conversation.id);
    }

    setActionDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open conversation actions menu">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/admin/messages/${conversation.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">Change Status</DropdownMenuLabel>

          {conversation.status !== 'active' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'active', title: 'Mark as Active', description: 'Are you sure you want to reopen this conversation?' })}>
              <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" /> Active
            </DropdownMenuItem>
          )}

          {conversation.status !== 'archived' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'archived', title: 'Archive Conversation', description: 'Are you sure you want to archive this conversation?' })}>
              <Archive className="mr-2 h-4 w-4 text-amber-600" /> Archive
            </DropdownMenuItem>
          )}

          {conversation.status !== 'closed' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'closed', title: 'Close Conversation', description: 'Are you sure you want to close this conversation? No further messages will be allowed.' })}>
              <Ban className="mr-2 h-4 w-4 text-slate-600" /> Close
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Conversation', description: 'Are you sure you want to permanently delete this conversation and all its messages? This action cannot be undone.', destructive: true })}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete Conversation
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
