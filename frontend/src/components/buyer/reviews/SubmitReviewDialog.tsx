import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBuyerStore } from '@/store/useBuyerStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmitReviewDialogProps {
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  trigger?: React.ReactNode;
}

export function SubmitReviewDialog({ listingId, listingTitle, sellerId, sellerName, trigger }: SubmitReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const { createReview } = useBuyerStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const ratingValue = form.watch('rating');

  const onSubmit = (data: FormValues) => {
    createReview({
      listingId,
      listingTitle,
      sellerId,
      sellerName,
      rating: data.rating,
      comment: data.comment,
    });

    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Leave a Review</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-y-auto max-h-[95vh] bg-white">
        
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">Leave a Review</DialogTitle>
          <DialogDescription className="text-slate-500 text-base mt-1.5">
            Share your experience with this seller
          </DialogDescription>
        </DialogHeader>

        {/* CONTEXT CARD */}
        <div className="px-6 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-semibold text-slate-900 truncate">{listingTitle}</h4>
              <p className="text-sm text-slate-500 truncate">
                Seller: <span className="font-medium text-slate-700">{sellerName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col">
            
            <div className="px-6 space-y-8 pb-6">
              
              {/* RATING SECTION */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full p-6 rounded-xl border border-slate-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center justify-center space-y-5">
                      <FormLabel className="text-base font-semibold text-slate-900">
                        How would you rate your experience?
                      </FormLabel>
                      
                      <FormControl>
                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="w-12 h-12 flex items-center justify-center rounded-full focus:outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                              <Star
                                className={cn(
                                  "w-9 h-9 transition-colors duration-200",
                                  (hoveredStar !== null ? star <= hoveredStar : star <= ratingValue)
                                    ? "fill-orange-400 text-orange-400"
                                    : "text-slate-200"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      
                      <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-sm text-slate-500 font-medium">Select a rating</p>
                        <FormMessage className="text-sm" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* REVIEW TEXT SECTION */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full space-y-3">
                    <FormLabel className="text-base font-semibold text-slate-900">Your Review</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Textarea
                          placeholder="Tell us about your experience..."
                          className="w-full min-h-[140px] resize-y rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-medium text-slate-400">Minimum 10 characters</span>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full mt-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className="w-full sm:w-auto font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Review
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
