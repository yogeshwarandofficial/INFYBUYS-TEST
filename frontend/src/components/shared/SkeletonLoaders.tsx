import { Skeleton } from '@/components/ui/skeleton';

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="pt-4 mt-2 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm h-full">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
