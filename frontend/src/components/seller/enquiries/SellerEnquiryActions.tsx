import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SellerEnquiry, type SellerEnquiryStatus, type SellerEnquiryPriority, useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MoreHorizontal,
  PhoneCall,
  Star,
  Handshake,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  Trash2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

interface SellerEnquiryActionsProps {
  enquiry: SellerEnquiry;
  /** If true renders as an inline button group, otherwise uses a dropdown */
  inline?: boolean;
}

const STATUS_TRANSITIONS: Record<SellerEnquiryStatus, SellerEnquiryStatus[]> = {
  new: ['contacted', 'qualified', 'rejected'],
  contacted: ['qualified', 'negotiating', 'rejected'],
  qualified: ['negotiating', 'closed', 'rejected'],
  negotiating: ['closed', 'rejected'],
  closed: ['contacted'],
  rejected: ['contacted'],
};

const STATUS_ACTION_LABELS: Partial<Record<SellerEnquiryStatus, { label: string; icon: React.ElementType }>> = {
  contacted: { label: 'Mark as Contacted', icon: PhoneCall },
  qualified: { label: 'Mark as Qualified', icon: Star },
  negotiating: { label: 'Mark as Negotiating', icon: Handshake },
  closed: { label: 'Close Enquiry', icon: CheckCircle2 },
  rejected: { label: 'Reject Enquiry', icon: XCircle },
};

const PRIORITY_OPTIONS: { value: SellerEnquiryPriority; label: string; icon: React.ElementType }[] = [
  { value: 'high', label: 'High Priority', icon: ArrowUp },
  { value: 'medium', label: 'Medium Priority', icon: ArrowRight },
  { value: 'low', label: 'Low Priority', icon: ArrowDown },
];

export function SellerEnquiryActions({ enquiry, inline = false }: SellerEnquiryActionsProps) {
  const navigate = useNavigate();
  const { updateEnquiryStatus, markEnquiryAsRead, deleteEnquiry, setEnquiryPriority } = useSellerStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const allowedTransitions = STATUS_TRANSITIONS[enquiry.status] ?? [];
  const isTerminal = enquiry.status === 'closed' || enquiry.status === 'rejected';

  const handleStatusChange = (status: SellerEnquiryStatus) => {
    updateEnquiryStatus(enquiry.id, status);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    navigate('/seller/enquiries');
    deleteEnquiry(enquiry.id);
  };

  const DeleteConfirmDialog = (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Enquiry?</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete the enquiry from{' '}
            <strong>{enquiry.buyerName}</strong>? This action cannot be undone.
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
        {DeleteConfirmDialog}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Enquiry actions">
          {allowedTransitions.map((status) => {
            const config = STATUS_ACTION_LABELS[status];
            if (!config) return null;
            const Icon = config.icon;
            const isDestructive = status === 'rejected';
            const isPrimary = status === 'closed';
            return (
              <Button
                key={status}
                size="sm"
                variant={isDestructive ? 'destructive' : isPrimary ? 'default' : 'outline'}
                onClick={() => handleStatusChange(status)}
                className="gap-1.5"
                aria-label={config.label}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {config.label}
              </Button>
            );
          })}

          {isTerminal && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('contacted')}
              className="gap-1.5"
              aria-label="Reopen enquiry"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reopen
            </Button>
          )}

          {enquiry.unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markEnquiryAsRead(enquiry.id)}
              className="gap-1.5"
              aria-label="Mark enquiry as read"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Mark Read
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
            aria-label="Delete enquiry"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </>
    );
  }

  // Dropdown mode
  return (
    <>
      {DeleteConfirmDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Enquiry actions">
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {allowedTransitions.map((status) => {
            const config = STATUS_ACTION_LABELS[status];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
                <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {config.label}
              </DropdownMenuItem>
            );
          })}

          {isTerminal && (
            <DropdownMenuItem onClick={() => handleStatusChange('contacted')}>
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Reopen Enquiry
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {PRIORITY_OPTIONS.filter((p) => p.value !== enquiry.priority).map((p) => {
            const Icon = p.icon;
            return (
              <DropdownMenuItem key={p.value} onClick={() => setEnquiryPriority(enquiry.id, p.value)}>
                <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                Set {p.label}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          {enquiry.unreadCount > 0 && (
            <DropdownMenuItem onClick={() => markEnquiryAsRead(enquiry.id)}>
              <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              Mark as Read
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
            Delete Enquiry
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
