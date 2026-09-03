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
      <Card className="overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] border-dashed rounded-2xl shadow-sm shadow-blue-900/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[#F6F8FC] rounded-2xl flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-[#111827]">No notifications found</h3>
          <p className="text-sm text-[#64748B] max-w-sm mb-6">
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
      <Card className="overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] border-dashed rounded-2xl shadow-sm shadow-blue-900/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-[#111827]">You're all caught up!</h3>
          <p className="text-sm text-[#64748B] max-w-sm">
            You have no unread notifications at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] border-dashed rounded-2xl shadow-sm shadow-blue-900/5">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-[#F6F8FC] rounded-2xl flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-[#94A3B8]" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#111827]">No notifications</h3>
        <p className="text-sm text-[#64748B] max-w-sm">
          When you receive updates about your listings, enquiries, or account, they will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
