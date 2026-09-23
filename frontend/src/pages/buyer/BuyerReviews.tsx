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
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden max-w-7xl mx-auto px-4 xl:px-0 py-6 gap-6">
        <div className="flex flex-1 flex-col h-full bg-white/80 backdrop-blur-md border border-[#E5E9F2] shadow-sm rounded-2xl overflow-hidden relative">
          <div className="p-5 border-b border-[#E5E9F2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent shrink-0">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#111827]">My Reviews</h2>
              <p className="text-[13px] text-[#64748B]">
                Manage the feedback you've left for sellers.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus:ring-[#2563EB]">
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

          <div className="flex-1 overflow-auto p-5 relative z-10">
            {reviews.length === 0 ? (
              <div className="relative h-full min-h-[400px]">
                <div className="absolute inset-0 bg-blue-100/40 blur-3xl rounded-full -z-10" />
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
                    <Star className="h-8 w-8 text-[#2563EB]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">No reviews yet</h3>
                  <p className="text-[15px] text-[#64748B] max-w-sm mx-auto mb-8 leading-relaxed">
                    You haven't left any reviews for sellers yet. Share your experience after interacting with a seller.
                  </p>
                  <Button size="lg" asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-12 px-8 font-medium transition-all hover:shadow-lg">
                    <Link to="/buyer/browse">Browse Businesses</Link>
                  </Button>
                </div>
              </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl">
                  <CardHeader className="bg-slate-50/50 pb-4 border-b border-[#E2E8F0]/50 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1 text-[#0F172A]">{review.sellerName}</CardTitle>
                      <CardDescription className="text-[#64748B]">
                        Review for <Link to={`/buyer/listing/${review.listingId}`} className="text-[#2563EB] hover:underline font-medium">{review.listingTitle}</Link>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.status === 'published' ? 'default' : 'secondary'} className={review.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 hover:bg-slate-100">
                            <MoreVertical className="w-4 h-4 text-[#64748B]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDeleteId(review.id)} className="text-red-600 focus:text-red-700">
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
                          className={`w-5 h-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                      <span className="ml-3 text-[13px] font-medium text-[#94A3B8]">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-[#334155]">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E2E8F0]">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#0F172A]">Delete Review?</DialogTitle>
              <DialogDescription className="text-[#64748B]">
                Are you sure you want to delete this review? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </>
  );
}
