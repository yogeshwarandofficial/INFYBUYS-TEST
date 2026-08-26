import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminReviewStatus } from '../store/useAdminStore';

export type AdminReviewSortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export function useAdminReviewSearch() {
  const { reviews } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminReviewStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all'); // 'all' or '1', '2', '3', '4', '5'
  const [sortBy, setSortBy] = useState<AdminReviewSortOption>('newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews].filter(r => r.status !== 'deleted');

    // Search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.reviewerName.toLowerCase().includes(lowerSearch) ||
        r.targetName.toLowerCase().includes(lowerSearch) ||
        r.title.toLowerCase().includes(lowerSearch) ||
        r.comment.toLowerCase().includes(lowerSearch)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter, 10);
      result = result.filter(r => r.rating === rating);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest_rating':
          return b.rating - a.rating;
        case 'lowest_rating':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [reviews, searchTerm, statusFilter, ratingFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const paginatedReviews = filteredAndSortedReviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return {
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
    totalResults: filteredAndSortedReviews.length,
    reviews: paginatedReviews,
  };
}
