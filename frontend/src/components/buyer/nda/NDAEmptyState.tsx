import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function NDAEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-card/50">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <FileText className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No NDAs Yet</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        You haven't requested any Non-Disclosure Agreements yet. Request an NDA to view confidential business details.
      </p>
      <Button asChild size="lg">
        <Link to="/buyer/browse">
          Browse Businesses <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
