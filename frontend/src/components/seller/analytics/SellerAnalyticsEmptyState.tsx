import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router';

export function SellerAnalyticsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Analytics Data Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Create your first listing to start receiving views, enquiries, and messages. Your performance metrics will appear here once buyers start interacting with your business.
        </p>
        <Button asChild size="lg">
          <Link to="/seller/listings/new">
            <Plus className="w-4 h-4 mr-2" />
            Create First Listing
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
