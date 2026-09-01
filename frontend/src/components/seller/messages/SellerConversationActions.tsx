import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SellerConversation, useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Archive,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface SellerConversationActionsProps {
  conversation: SellerConversation;
  /** If true, render as inline button group */
  inline?: boolean;
}

export function SellerConversationActions({ conversation, inline = false }: SellerConversationActionsProps) {
  const navigate = useNavigate();
  const { markConversationAsRead, archiveConversation, restoreConversation, deleteConversation } = useSellerStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isArchived = conversation.status === 'archived';
  const isClosed = conversation.status === 'closed';
  const canArchive = conversation.status === 'active';
  const canRestore = isArchived || isClosed;

  const handleDelete = () => {
    setShowDeleteDialog(false);
    navigate('/seller/messages');
    deleteConversation(conversation.id);
  };

  const DeleteDialog = (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Conversation?</DialogTitle>
          <DialogDescription>
            Permanently delete your conversation with{' '}
            <strong>{conversation.buyerName}</strong>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (inline) {
    return (
      <>
        {DeleteDialog}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Conversation actions">
          {conversation.unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markConversationAsRead(conversation.id)}
              className="gap-1.5"
              aria-label="Mark as read"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Mark Read
            </Button>
          )}
          {canArchive && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => archiveConversation(conversation.id)}
              className="gap-1.5"
              aria-label="Archive conversation"
            >
              <Archive className="w-3.5 h-3.5" aria-hidden="true" />
              Archive
            </Button>
          )}
          {canRestore && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => restoreConversation(conversation.id)}
              className="gap-1.5"
              aria-label="Restore conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Restore
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
            aria-label="Delete conversation"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </>
    );
  }

  // Dropdown mode (used in card list)
  return (
    <>
      {DeleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Conversation actions">
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {conversation.unreadCount > 0 && (
            <DropdownMenuItem onClick={() => markConversationAsRead(conversation.id)}>
              <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              Mark as Read
            </DropdownMenuItem>
          )}
          {canArchive && (
            <DropdownMenuItem onClick={() => archiveConversation(conversation.id)}>
              <Archive className="w-4 h-4 mr-2" aria-hidden="true" />
              Archive
            </DropdownMenuItem>
          )}
          {canRestore && (
            <DropdownMenuItem onClick={() => restoreConversation(conversation.id)}>
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Restore
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
