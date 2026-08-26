import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this data. Please try again.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-destructive/20 bg-destructive/5 rounded-xl">
      <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">{message}</p>

      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
          Try Again
        </Button>
      )}
    </div>
  );
}
