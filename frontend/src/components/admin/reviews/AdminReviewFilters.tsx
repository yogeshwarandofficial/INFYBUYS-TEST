import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { AdminReviewStatus } from '../../../store/useAdminStore';
import type { AdminReviewSortOption } from '../../../hooks/useAdminReviewSearch';

interface AdminReviewFiltersProps {
  statusFilter: AdminReviewStatus | 'all';
  onStatusChange: (val: AdminReviewStatus | 'all') => void;
  ratingFilter: string;
  onRatingChange: (val: string) => void;
  sortBy: AdminReviewSortOption;
  onSortChange: (val: AdminReviewSortOption) => void;
}

export function AdminReviewFilters({
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
  sortBy,
  onSortChange,
}: AdminReviewFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as AdminReviewStatus | 'all')}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
          <SelectItem value="hidden">Hidden</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ratingFilter} onValueChange={onRatingChange}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="All Ratings" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4 Stars</SelectItem>
          <SelectItem value="3">3 Stars</SelectItem>
          <SelectItem value="2">2 Stars</SelectItem>
          <SelectItem value="1">1 Star</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(val) => onSortChange(val as AdminReviewSortOption)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="highest_rating">Highest Rating</SelectItem>
          <SelectItem value="lowest_rating">Lowest Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
