import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Seo title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <div className="text-primary font-black text-9xl mb-4 opacity-20">404</div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link to="/">Go back home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/search"><Search className="w-4 h-4 mr-2" /> Browse Listings</Link>
        </Button>
      </div>
    </div>
  );
}
