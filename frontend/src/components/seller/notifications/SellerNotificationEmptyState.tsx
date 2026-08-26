import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, SearchX, CheckCircle } from 'lucide-react';

interface SellerNotificationEmptyStateProps {
  type: 'empty' | 'no-results' | 'all-read';
  onClearFilters?: () => void;
}

export function SellerNotificationEmptyState({ type, onClearFilters }: SellerNotificationEmptyStateProps) {
  if (type === 'no-results') {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            We couldn't find any notifications matching your current filters.
          </p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === 'all-read') {
    return (
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">You're all caught up!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You have no unread notifications at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Bell className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          When you receive updates about your listings, enquiries, or account, they will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
