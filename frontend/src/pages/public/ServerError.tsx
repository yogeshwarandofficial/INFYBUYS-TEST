import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-muted/20">
      <Seo title="500 - Internal Server Error" description="Something went wrong on our end." />
      <div className="text-destructive font-black text-9xl mb-4 opacity-20">500</div>
      <h1 className="text-4xl font-bold mb-4">Internal Server Error</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! Something went wrong on our end. Our team has been notified and is working to fix the issue.
      </p>
      <Button
        size="lg"
        onClick={() => window.location.reload()}
      >
        <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
      </Button>
    </div>
  );
}
