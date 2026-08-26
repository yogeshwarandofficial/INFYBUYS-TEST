import { PageHeader } from '../../components/shared/PageHeader';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminReviewSearch } from '../../hooks/useAdminReviewSearch';
import { AdminReviewSearch } from '../../components/admin/reviews/AdminReviewSearch';
import { AdminReviewFilters } from '../../components/admin/reviews/AdminReviewFilters';
import { AdminReviewsTable } from '../../components/admin/reviews/AdminReviewsTable';
import { AdminReviewCard } from '../../components/admin/reviews/AdminReviewCard';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';
import { Star, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function AdminReviews() {
  const { reviews: allReviews } = useAdminStore();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    totalResults,
    reviews,
  } = useAdminReviewSearch();

  // Quick stats
  const activeReviews = allReviews.filter(r => r.status !== 'deleted');
  const totalReviewCount = activeReviews.length;
  const pendingCount = activeReviews.filter(r => r.status === 'pending').length;
  const flaggedCount = activeReviews.filter(r => r.status === 'flagged').length;
  const avgRating = totalReviewCount > 0
    ? (activeReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewCount).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Reviews & Ratings"
        description="Monitor, moderate, and reply to user reviews across the platform."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Reviews' }]}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Total Reviews</span>
                <MessageSquareWarning className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold">{totalReviewCount}</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-500">
                <span className="text-sm font-medium">Avg Rating</span>
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">{avgRating}</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-500">
                <span className="text-sm font-medium">Pending Moderation</span>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{pendingCount}</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-red-600 dark:text-red-500">
                <span className="text-sm font-medium">Flagged Issues</span>
                <MessageSquareWarning className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">{flaggedCount}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <AdminReviewSearch value={searchTerm} onChange={setSearchTerm} />
          <AdminReviewFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Results Info */}
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{reviews.length}</span> of <span className="font-medium text-foreground">{totalResults}</span> reviews
        </div>

        {/* Results Display */}
        {reviews.length > 0 ? (
          <>
            <div className="hidden lg:block animate-in fade-in duration-300">
              <AdminReviewsTable reviews={reviews} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden animate-in fade-in duration-300">
              {reviews.map(review => (
                <AdminReviewCard key={review.id} review={review} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No reviews found"
            description={searchTerm ? "No reviews match your search or filter criteria." : "There are no reviews on the platform yet."}
            actionLabel={searchTerm ? "Clear Filters" : undefined}
            onAction={searchTerm ? () => { setSearchTerm(''); setStatusFilter('all'); setRatingFilter('all'); } : undefined}
          />
        )}
      </div>
    </div>
  );
}
