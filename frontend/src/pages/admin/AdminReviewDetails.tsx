import { useParams, useNavigate } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { AdminReviewStatusBadge } from '../../components/admin/reviews/AdminReviewStatusBadge';
import { AdminStarRating } from '../../components/admin/reviews/AdminStarRating';
import { AdminReviewActions } from '../../components/admin/reviews/AdminReviewActions';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { ArrowLeft, User, Target, Calendar, MessageSquare, History } from 'lucide-react';

export default function AdminReviewDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reviews } = useAdminStore();

  const review = reviews.find(r => r.id === id);

  if (!review || review.status === 'deleted') {
    return (
      <div className="flex flex-col min-h-screen pb-12">
        <PageHeader
          title="Review Not Found"
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Reviews', href: '/admin/reviews' },
            { label: 'Details' }
          ]}
        />
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="Review Not Found"
            description="The review you are looking for does not exist or has been deleted."
            actionLabel="Back to Reviews"
            onAction={() => navigate('/admin/reviews')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Review Details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reviews', href: '/admin/reviews' },
          { label: 'Details' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/admin/reviews')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <AdminReviewActions review={review} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
                <div className="flex items-center gap-3">
                  <AdminStarRating rating={review.rating} />
                  <AdminReviewStatusBadge status={review.status} />
                </div>
                <span className="text-sm text-muted-foreground">{format(new Date(review.createdAt), 'PPpp')}</span>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{review.title}</h3>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border">
                    {review.comment}
                  </p>
                </div>

                {review.adminReply && (
                  <div className="mt-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-lg text-blue-900 dark:text-blue-100">
                    <div className="flex items-center gap-2 mb-2 font-semibold">
                      <MessageSquare className="w-4 h-4" />
                      Admin Reply
                    </div>
                    <p className="whitespace-pre-wrap">{review.adminReply}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="w-5 h-5" />
                  Review Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l ml-3 space-y-6 pl-6">
                  {/* Mock history since it's not explicitly in the state yet but requested by prompt */}
                  <div className="relative">
                    <span className="absolute -left-[31px] bg-background border-2 rounded-full w-4 h-4" />
                    <p className="text-sm font-medium">Review Created</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'PPpp')}</p>
                  </div>
                  {review.adminReply && (
                    <div className="relative">
                      <span className="absolute -left-[31px] bg-blue-500 border-2 rounded-full w-4 h-4" />
                      <p className="text-sm font-medium">Admin Reply Added</p>
                    </div>
                  )}
                  {review.status !== 'pending' && (
                    <div className="relative">
                      <span className="absolute -left-[31px] bg-background border-2 rounded-full w-4 h-4" />
                      <p className="text-sm font-medium">Status Updated to {review.status}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Reviewer</p>
                    <p className="text-sm text-muted-foreground">{review.reviewerName}</p>
                    <p className="text-xs text-muted-foreground">ID: {review.reviewerId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Target ({review.targetType})</p>
                    <p className="text-sm text-muted-foreground">{review.targetName}</p>
                    <p className="text-xs text-muted-foreground">ID: {review.targetId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date Submitted</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(review.createdAt), 'PP')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
