import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminEnquiry, AdminEnquiryStatus } from '../../../store/useAdminStore';
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
import { MoreVertical, Ban, Eye, Trash2, XCircle, UserCheck, CheckCircle2, Handshake, ArrowRightCircle } from 'lucide-react';

interface AdminEnquiryActionsProps {
  enquiry: AdminEnquiry;
}

export function AdminEnquiryActions({ enquiry }: AdminEnquiryActionsProps) {
  const navigate = useNavigate();
  const store = useAdminStore();
  const [actionDialog, setActionDialog] = useState<{ type: string; title: string; description: string; nextStatus?: AdminEnquiryStatus; destructive?: boolean } | null>(null);

  const handleAction = () => {
    if (!actionDialog) return;

    if (actionDialog.type === 'update_status' && actionDialog.nextStatus) {
      store.updateEnquiryStatus(enquiry.id, actionDialog.nextStatus);
      store.addEnquiryActivity(enquiry.id, {
        type: 'status_update',
        description: `Admin updated status to ${actionDialog.nextStatus}`,
        timestamp: new Date().toISOString()
      });
    } else if (actionDialog.type === 'delete') {
      store.deleteEnquiry(enquiry.id);
    }

    setActionDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open enquiry actions menu">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/admin/enquiries/${enquiry.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">Change Status</DropdownMenuLabel>

          {enquiry.status !== 'contacted' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'contacted', title: 'Mark as Contacted', description: 'Are you sure you want to change the status of this enquiry to Contacted?' })}>
              <CheckCircle2 className="mr-2 h-4 w-4 text-cyan-600" /> Contacted
            </DropdownMenuItem>
          )}

          {enquiry.status !== 'qualified' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'qualified', title: 'Mark as Qualified', description: 'Are you sure you want to mark this enquiry as Qualified?' })}>
              <UserCheck className="mr-2 h-4 w-4 text-indigo-600" /> Qualified
            </DropdownMenuItem>
          )}

          {enquiry.status !== 'negotiating' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'negotiating', title: 'Mark as Negotiating', description: 'Are you sure you want to move this enquiry to Negotiating phase?' })}>
              <Handshake className="mr-2 h-4 w-4 text-purple-600" /> Negotiating
            </DropdownMenuItem>
          )}

          {enquiry.status !== 'closed' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'closed', title: 'Close Enquiry', description: 'Are you sure you want to close this enquiry?' })}>
              <Ban className="mr-2 h-4 w-4 text-emerald-600" /> Close
            </DropdownMenuItem>
          )}

          {enquiry.status !== 'rejected' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'rejected', title: 'Reject Enquiry', description: 'Are you sure you want to reject this enquiry?', destructive: true })}>
              <XCircle className="mr-2 h-4 w-4 text-slate-600" /> Reject
            </DropdownMenuItem>
          )}

          {enquiry.status !== 'new' && (
            <DropdownMenuItem onClick={() => setActionDialog({ type: 'update_status', nextStatus: 'new', title: 'Reset to New', description: 'Are you sure you want to reset this enquiry status back to New?' })}>
              <ArrowRightCircle className="mr-2 h-4 w-4 text-blue-600" /> Reset to New
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setActionDialog({ type: 'delete', title: 'Delete Enquiry', description: 'Are you sure you want to permanently delete this enquiry? This action cannot be undone.', destructive: true })}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete Enquiry
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
