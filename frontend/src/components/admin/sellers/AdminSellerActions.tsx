import { useState } from 'react';
import type { AdminSeller } from '../../../store/useAdminStore';
import { useAdminStore } from '../../../store/useAdminStore';
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
import { MoreHorizontal, Eye, Ban, CheckCircle, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminSellerActionsProps {
  seller: AdminSeller;
}

type ConfirmAction = 'suspend' | 'block' | 'activate' | 'delete' | 'approve' | 'reject' | 'unblock' | null;

export function AdminSellerActions({ seller }: AdminSellerActionsProps) {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const {
    approveSeller,
    rejectSeller,
    suspendSeller,
    blockSeller,
    unblockSeller,
    activateSeller,
    deleteSeller,
    addSellerActivity
  } = useAdminStore();

  const handleAction = () => {
    if (!confirmAction) return;

    switch (confirmAction) {
      case 'approve':
        approveSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller approved by admin', date: new Date().toISOString() });
        break;
      case 'reject':
        rejectSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller rejected by admin', date: new Date().toISOString() });
        break;
      case 'suspend':
        suspendSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller suspended by admin', date: new Date().toISOString() });
        break;
      case 'block':
        blockSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller blocked by admin', date: new Date().toISOString() });
        break;
      case 'unblock':
        unblockSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller unblocked by admin', date: new Date().toISOString() });
        break;
      case 'activate':
        activateSeller(seller.id);
        addSellerActivity(seller.id, { action: 'Seller activated by admin', date: new Date().toISOString() });
        break;
      case 'delete':
        deleteSeller(seller.id);
        break;
    }
    setConfirmAction(null);
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
          <DropdownMenuItem onClick={() => navigate(`/admin/sellers/${seller.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {seller.status === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => setConfirmAction('approve')}>
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmAction('reject')}>
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Reject
              </DropdownMenuItem>
            </>
          )}

          {seller.status === 'rejected' && (
            <DropdownMenuItem onClick={() => setConfirmAction('approve')}>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              Approve
            </DropdownMenuItem>
          )}

          {seller.status === 'suspended' && (
            <DropdownMenuItem onClick={() => setConfirmAction('activate')}>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              Activate
            </DropdownMenuItem>
          )}

          {seller.status === 'blocked' && (
            <DropdownMenuItem onClick={() => setConfirmAction('unblock')}>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              Unblock
            </DropdownMenuItem>
          )}

          {seller.status === 'active' && (
            <DropdownMenuItem onClick={() => setConfirmAction('suspend')}>
              <Ban className="mr-2 h-4 w-4 text-amber-600" />
              Suspend
            </DropdownMenuItem>
          )}

          {(seller.status === 'active' || seller.status === 'suspended' || seller.status === 'pending') && (
            <DropdownMenuItem onClick={() => setConfirmAction('block')}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
              Block
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmAction('delete')}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete seller
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'delete' ? 'Delete Seller' : `Confirm Action`}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'delete' && `Are you sure you want to delete ${seller.companyName}? This action cannot be undone.`}
              {confirmAction === 'suspend' && `Are you sure you want to suspend ${seller.companyName}? Their listings will be hidden.`}
              {confirmAction === 'block' && `Are you sure you want to block ${seller.companyName}? This will restrict all access and hide all listings.`}
              {confirmAction === 'activate' && `Are you sure you want to activate ${seller.companyName}?`}
              {confirmAction === 'approve' && `Are you sure you want to approve ${seller.companyName}? They will be able to list items.`}
              {confirmAction === 'reject' && `Are you sure you want to reject ${seller.companyName}'s application?`}
              {confirmAction === 'unblock' && `Are you sure you want to unblock ${seller.companyName}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={['delete', 'block', 'reject', 'suspend'].includes(confirmAction || '') ? 'destructive' : 'default'}
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
