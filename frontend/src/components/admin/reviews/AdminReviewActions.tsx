import { useState } from 'react';
import { MoreHorizontal, CheckCircle, XCircle, EyeOff, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Textarea } from '../../ui/textarea';
import type { AdminReview } from '../../../store/useAdminStore';
import { useAdminStore } from '../../../store/useAdminStore';

interface AdminReviewActionsProps {
  review: AdminReview;
}

export function AdminReviewActions({ review }: AdminReviewActionsProps) {
  const { updateAdminReviewStatus, deleteAdminReview, replyToAdminReview } = useAdminStore();
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyText, setReplyText] = useState(review.adminReply || '');

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      replyToAdminReview(review.id, replyText);
    }
    setShowReplyDialog(false);
  };

  const handleDelete = () => {
    deleteAdminReview(review.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {review.status !== 'published' && (
            <DropdownMenuItem onClick={() => updateAdminReviewStatus(review.id, 'published')}>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
              Publish
            </DropdownMenuItem>
          )}
          {review.status !== 'rejected' && (
            <DropdownMenuItem onClick={() => updateAdminReviewStatus(review.id, 'rejected')}>
              <XCircle className="mr-2 h-4 w-4 text-red-500" />
              Reject
            </DropdownMenuItem>
          )}
          {review.status !== 'hidden' && (
            <DropdownMenuItem onClick={() => updateAdminReviewStatus(review.id, 'hidden')}>
              <EyeOff className="mr-2 h-4 w-4 text-slate-500" />
              Hide
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowReplyDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
            {review.adminReply ? 'Edit Reply' : 'Admin Reply'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 focus:bg-red-50 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Reply</DialogTitle>
            <DialogDescription>
              Respond officially to this review. Your reply will be publicly visible beneath the review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted p-3 rounded-md border text-sm text-muted-foreground">
              <span className="font-medium text-foreground">"{review.title}"</span>
              <p className="mt-1">{review.comment}</p>
            </div>

            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your official response here..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>Cancel</Button>
            <Button onClick={handleReplySubmit}>Save Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this review from {review.reviewerName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
