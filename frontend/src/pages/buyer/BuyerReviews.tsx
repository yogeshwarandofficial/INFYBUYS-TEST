import { useState, useMemo } from 'react';
import { useBuyerStore } from '@/store/useBuyerStore';
import { Seo } from '@/components/shared/Seo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BuyerReviews() {
  const { reviews, deleteReview } = useBuyerStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  const sortedReviews = useMemo(() => {
    const result = [...reviews];
    switch (sortBy) {
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'highest':
        return result.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return result.sort((a, b) => a.rating - b.rating);
      default:
        return result;
    }
  }, [reviews, sortBy]);

  const handleDelete = () => {
    if (deleteId) {
      deleteReview(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Seo title="My Reviews" />
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Manage the feedback you've left for sellers.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-xl border shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              You haven't left any reviews for sellers yet. Share your experience after interacting with a seller.
            </p>
            <Button size="lg" asChild>
              <Link to="/buyer/browse">Browse Businesses</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{review.sellerName}</CardTitle>
                    <CardDescription>
                      Review for <Link to={`/listing/${review.listingId}`} className="text-primary hover:underline">{review.listingTitle}</Link>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={review.status === 'published' ? 'default' : 'secondary'} className={review.status === 'published' ? 'bg-success hover:bg-success' : ''}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDeleteId(review.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Review?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
