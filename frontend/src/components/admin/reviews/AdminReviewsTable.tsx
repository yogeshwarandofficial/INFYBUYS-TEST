import { format } from 'date-fns';
import type { AdminReview } from '../../../store/useAdminStore';
import { AdminStarRating } from './AdminStarRating';
import { AdminReviewStatusBadge } from './AdminReviewStatusBadge';
import { AdminReviewActions } from './AdminReviewActions';
import { Building, Store } from 'lucide-react';
import { Link } from 'react-router';

interface AdminReviewsTableProps {
  reviews: AdminReview[];
}

export function AdminReviewsTable({ reviews }: AdminReviewsTableProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Rating</th>
              <th className="px-4 py-3 font-medium min-w-[250px]">Review Content</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Target</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Reviewer</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <AdminStarRating rating={review.rating} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 max-w-[400px]">
                    <Link to={`/admin/reviews/${review.id}`} className="font-semibold truncate hover:underline text-primary" title={review.title}>
                      {review.title}
                    </Link>
                    <span className="text-muted-foreground truncate" title={review.comment}>{review.comment}</span>
                    {review.adminReply && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 truncate mt-0.5 border-l-2 border-blue-500 pl-2">
                        {review.adminReply}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {review.targetType === 'seller' ? <Store className="h-3.5 w-3.5" /> : <Building className="h-3.5 w-3.5" />}
                    <span className="truncate max-w-[120px]" title={review.targetName}>{review.targetName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium">{review.reviewerName}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <AdminReviewStatusBadge status={review.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <AdminReviewActions review={review} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
