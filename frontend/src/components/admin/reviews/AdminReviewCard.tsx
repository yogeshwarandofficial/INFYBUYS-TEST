import { format } from 'date-fns';
import { Card, CardContent } from '../../ui/card';
import type { AdminReview } from '../../../store/useAdminStore';
import { AdminStarRating } from './AdminStarRating';
import { AdminReviewStatusBadge } from './AdminReviewStatusBadge';
import { AdminReviewActions } from './AdminReviewActions';
import { Building, Store } from 'lucide-react';
import { Link } from 'react-router';

interface AdminReviewCardProps {
  review: AdminReview;
}

export function AdminReviewCard({ review }: AdminReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AdminStarRating rating={review.rating} />
              <AdminReviewStatusBadge status={review.status} />
            </div>
            <Link to={`/admin/reviews/${review.id}`} className="font-semibold line-clamp-1 hover:underline text-primary">
              {review.title}
            </Link>
          </div>
          <AdminReviewActions review={review} />
        </div>

        {/* Content */}
        <div className="text-sm text-muted-foreground line-clamp-3 bg-muted/50 p-3 rounded-md border">
          {review.comment}
        </div>

        {/* Reply (if exists) */}
        {review.adminReply && (
          <div className="text-xs bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-2.5 rounded-md text-blue-800 dark:text-blue-300">
            <span className="font-semibold mr-1">Admin Reply:</span>
            {review.adminReply}
          </div>
        )}

        {/* Footer Meta */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1 border-t">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{review.reviewerName}</span>
            <span>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full">
            {review.targetType === 'seller' ? <Store className="h-3 w-3" /> : <Building className="h-3 w-3" />}
            <span className="truncate max-w-[120px]">{review.targetName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
