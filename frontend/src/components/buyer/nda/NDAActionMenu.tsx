import { MoreVertical, Check, X, Ban, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { BuyerNDA } from '@/store/useBuyerStore';

interface NDAActionMenuProps {
  nda: BuyerNDA;
  onApproveMock: () => void;
  onRejectMock: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function NDAActionMenu({ nda, onApproveMock, onRejectMock, onCancel, onDelete }: NDAActionMenuProps) {
  const isPending = nda.status === 'pending' || nda.status === 'draft';
  const isCancellable = ['pending', 'draft', 'under-review'].includes(nda.status);
  const isDeletable = ['cancelled', 'rejected', 'expired'].includes(nda.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open NDA actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">

        {/* Mock Actions for Testing */}
        {isPending && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider bg-muted/50">
              Mock Seller Actions
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={onApproveMock} className="text-success focus:text-success focus:bg-success/10 cursor-pointer">
              <Check className="mr-2 h-4 w-4" />
              Mock Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRejectMock} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
              <X className="mr-2 h-4 w-4" />
              Mock Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider bg-muted/50">
          Buyer Actions
        </DropdownMenuLabel>

        {isCancellable && (
          <DropdownMenuItem onClick={onCancel} className="cursor-pointer">
            <Ban className="mr-2 h-4 w-4" />
            Cancel Request
          </DropdownMenuItem>
        )}

        {isDeletable && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Record
          </DropdownMenuItem>
        )}

        {nda.status === 'approved' && (
          <DropdownMenuItem disabled>
            <Edit2 className="mr-2 h-4 w-4" />
            Request Amendment (Coming Soon)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
