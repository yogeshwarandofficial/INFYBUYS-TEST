import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminListing } from '../../../store/useAdminStore';
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
import { MoreVertical, Ban, CheckCircle, Eye, ShieldCheck, Shield, AlertTriangle, Play, RefreshCw, Trash2, XCircle, ShoppingBag } from 'lucide-react';

interface AdminListingActionsProps {
  listing: AdminListing;
}

export function AdminListingActions({ listing }: AdminListingActionsProps) {
  const navigate = useNavigate();
  const store = useAdminStore();
  const [actionDialog, setActionDialog] = useState<{ type: string; title: string; description: string; destructive?: boolean } | null>(null);

  const handleAction = () => {
    if (!actionDialog) return;

    switch (actionDialog.type) {
      case 'approve':
        store.approveListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'approval',
          description: 'Approved listing for publication',
          timestamp: new Date().toISOString()
        });
        break;
      case 'reject':
        store.rejectListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'rejection',
          description: 'Rejected listing submission',
          timestamp: new Date().toISOString()
        });
        break;
      case 'suspend':
        store.suspendListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'suspension',
          description: 'Suspended active listing',
          timestamp: new Date().toISOString()
        });
        break;
      case 'restore':
        store.restoreListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'restore',
          description: 'Restored listing to pending review state',
          timestamp: new Date().toISOString()
        });
        break;
      case 'verify':
        store.verifyListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'verification',
          description: 'Manually verified listing claims',
          timestamp: new Date().toISOString()
        });
        break;
      case 'unverify':
        store.unverifyListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'unverify',
          description: 'Removed verification status',
          timestamp: new Date().toISOString()
        });
        break;
      case 'markSold':
        store.markListingSold(listing.id);
        store.addListingActivity(listing.id, {
          type: 'status_update',
          description: 'Marked listing as sold',
          timestamp: new Date().toISOString()
        });
        break;
      case 'close':
        store.closeListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'status_update',
          description: 'Closed listing',
          timestamp: new Date().toISOString()
        });
        break;
      case 'reopen':
        store.reopenListing(listing.id);
        store.addListingActivity(listing.id, {
          type: 'status_update',
          description: 'Reopened listing',
          timestamp: new Date().toISOString()
        });
        break;
      case 'delete':
        store.deleteListing(listing.id);
        break;
    }

    setActionDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open listing actions menu">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/admin/listings/${listing.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          { (listing.status === 'pending' || listing.status === 'SUBMITTED_FOR_REVIEW') && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'approve', title: 'Approve Listing', description: 'Are you sure you want to approve this listing? It will become visible on the marketplace.' })}>
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'reject', title: 'Reject Listing', description: 'Are you sure you want to reject this listing? The seller will need to submit a new one.', destructive: true })}>
                <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject
              </DropdownMenuItem>
            </>
          )}

          { (listing.status === 'active' || listing.status === 'PUBLISHED') && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'suspend', title: 'Suspend Listing', description: 'Are you sure you want to suspend this listing? It will be hidden from the marketplace.', destructive: true })}>
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" /> Suspend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'markSold', title: 'Mark as Sold', description: 'Are you sure you want to mark this listing as sold?' })}>
                <ShoppingBag className="mr-2 h-4 w-4 text-purple-600" /> Mark Sold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'close', title: 'Close Listing', description: 'Are you sure you want to close this listing?', destructive: true })}>
                <Ban className="mr-2 h-4 w-4 text-slate-600" /> Close
              </DropdownMenuItem>
            </>
          )}

          { (listing.status === 'suspended' || listing.status === 'PAUSED') && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'reopen', title: 'Reopen Listing', description: 'Are you sure you want to reactivate this suspended listing?' })}>
                <Play className="mr-2 h-4 w-4 text-emerald-600" /> Reactivate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'close', title: 'Close Listing', description: 'Are you sure you want to close this suspended listing?', destructive: true })}>
                <Ban className="mr-2 h-4 w-4 text-slate-600" /> Close
              </DropdownMenuItem>
            </>
          )}

          { (listing.status === 'rejected' || listing.status === 'REJECTED') && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'restore', title: 'Restore Listing', description: 'Are you sure you want to restore this rejected listing to pending review?' })}>
                <RefreshCw className="mr-2 h-4 w-4 text-emerald-600" /> Restore to Pending
              </DropdownMenuItem>
            </>
          )}

          {(listing.status === 'closed' || listing.status === 'sold' || listing.status === 'SOLD_LET' || listing.status === 'EXPIRED') && (
            <>
              <DropdownMenuItem onClick={() => setActionDialog({ type: 'reopen', title: 'Reopen Listing', description: 'Are you sure you want to reopen this listing?' })}>
                <RefreshCw className="mr-2 h-4 w-4 text-emerald-600" /> Reopen
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          {!listing.isVerified ? (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'verify', title: 'Verify Listing', description: 'Are you sure you want to manually verify this listing?' })}>
              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" /> Manually Verify
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'unverify', title: 'Remove Verification', description: 'Are you sure you want to remove verification from this listing?' })}>
              <Shield className="mr-2 h-4 w-4 text-amber-600" /> Remove Verification
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Listing', description: 'Are you sure you want to permanently delete this listing? This action cannot be undone.', destructive: true })}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete Listing
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
