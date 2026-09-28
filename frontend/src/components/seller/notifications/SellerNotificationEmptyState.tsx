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
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
          <SearchX className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold mb-1 text-slate-900">No notifications found</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          We couldn't find any notifications matching your current filters.
        </p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  if (type === 'all-read') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 bg-blue-50/50 rounded-xl flex items-center justify-center mb-3">
          <CheckCircle className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="text-base font-semibold mb-1 text-slate-900">You're all caught up!</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          You have no unread notifications at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
        <Bell className="w-5 h-5 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold mb-1 text-slate-900">No notifications</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        When you receive updates about your listings, enquiries, or account, they will appear here.
      </p>
    </div>
  );
}
