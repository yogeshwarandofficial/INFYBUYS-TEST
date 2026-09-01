import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminBuyer } from '../../../store/useAdminStore';
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
import { MoreVertical, Ban, CheckCircle, Eye, ShieldCheck, Shield, AlertTriangle, Play, RefreshCw, Trash2 } from 'lucide-react';

interface AdminBuyerActionsProps {
  buyer: AdminBuyer;
}

export function AdminBuyerActions({ buyer }: AdminBuyerActionsProps) {
  const navigate = useNavigate();
  const store = useAdminStore();
  const [actionDialog, setActionDialog] = useState<{ type: string; title: string; description: string; destructive?: boolean } | null>(null);

  const handleAction = () => {
    if (!actionDialog) return;

    switch (actionDialog.type) {
      case 'activate':
        store.activateBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'activation',
          description: 'Activated buyer account',
          timestamp: new Date().toISOString()
        });
        break;
      case 'suspend':
        store.suspendBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'suspension',
          description: 'Suspended buyer account',
          timestamp: new Date().toISOString()
        });
        break;
      case 'block':
        store.blockBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'block',
          description: 'Blocked buyer account',
          timestamp: new Date().toISOString()
        });
        break;
      case 'unblock':
        store.unblockBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'unblock',
          description: 'Unblocked buyer account',
          timestamp: new Date().toISOString()
        });
        break;
      case 'restore':
        store.restoreBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'restore',
          description: 'Restored deleted buyer account (set to pending)',
          timestamp: new Date().toISOString()
        });
        break;
      case 'delete':
        store.deleteBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'deletion',
          description: 'Deleted buyer account',
          timestamp: new Date().toISOString()
        });
        break;
      case 'verify':
        store.verifyBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'verification',
          description: 'Verified buyer identity manually',
          timestamp: new Date().toISOString()
        });
        break;
      case 'unverify':
        store.unverifyBuyer(buyer.id);
        store.addBuyerActivity(buyer.id, {
          type: 'unverify',
          description: 'Removed buyer verification status',
          timestamp: new Date().toISOString()
        });
        break;
    }

    setActionDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open buyer actions menu">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/admin/buyers/${buyer.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {buyer.status === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'activate', title: 'Activate Buyer', description: 'Are you sure you want to activate this buyer account?' })}>
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Activate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'block', title: 'Block Buyer', description: 'Are you sure you want to block this pending buyer?', destructive: true })}>
                <Ban className="mr-2 h-4 w-4 text-red-600" /> Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Buyer', description: 'Are you sure you want to delete this buyer account?', destructive: true })}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {buyer.status === 'active' && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'suspend', title: 'Suspend Buyer', description: 'Are you sure you want to suspend this buyer account? They will not be able to log in.', destructive: true })}>
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" /> Suspend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'block', title: 'Block Buyer', description: 'Are you sure you want to block this buyer? This is a severe action.', destructive: true })}>
                <Ban className="mr-2 h-4 w-4 text-red-600" /> Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Buyer', description: 'Are you sure you want to delete this buyer account?', destructive: true })}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {buyer.status === 'suspended' && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'activate', title: 'Activate Buyer', description: 'Are you sure you want to reactivate this suspended buyer?' })}>
                <Play className="mr-2 h-4 w-4 text-emerald-600" /> Activate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'block', title: 'Block Buyer', description: 'Are you sure you want to escalate this suspension to a block?', destructive: true })}>
                <Ban className="mr-2 h-4 w-4 text-red-600" /> Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Buyer', description: 'Are you sure you want to delete this buyer account?', destructive: true })}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {buyer.status === 'blocked' && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'unblock', title: 'Unblock Buyer', description: 'Are you sure you want to unblock this buyer account?' })}>
                <RefreshCw className="mr-2 h-4 w-4 text-emerald-600" /> Unblock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Buyer', description: 'Are you sure you want to delete this buyer account?', destructive: true })}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {buyer.status === 'deleted' && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'restore', title: 'Restore Buyer', description: 'Are you sure you want to restore this deleted buyer account to pending status?' })}>
                <RefreshCw className="mr-2 h-4 w-4 text-emerald-600" /> Restore
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          {(buyer.verificationStatus === 'pending' || buyer.verificationStatus === 'unverified') && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'verify', title: 'Verify Buyer', description: 'Are you sure you want to manually verify this buyer?' })}>
              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" /> Manually Verify
            </DropdownMenuItem>
          )}

          {buyer.verificationStatus === 'verified' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'unverify', title: 'Remove Verification', description: 'Are you sure you want to remove verification from this buyer?' })}>
              <Shield className="mr-2 h-4 w-4 text-amber-600" /> Remove Verification
            </DropdownMenuItem>
          )}
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
