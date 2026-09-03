import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Archive, LayoutDashboard } from 'lucide-react';

type EmptyVariant = 'no-conversations' | 'no-results' | 'no-archived';

interface SellerEmptyMessagesProps {
  variant: EmptyVariant;
  onClearFilters?: () => void;
}

const CONTENT: Record<EmptyVariant, {
  icon: React.ElementType;
  title: string;
  description: string;
}> = {
  'no-conversations': {
    icon: MessageSquare,
    title: 'No Conversations Yet',
    description: 'When buyers reach out about your listings, conversations will appear here. Make sure your listings are active to attract interested buyers.',
  },
  'no-results': {
    icon: Search,
    title: 'No Matching Conversations',
    description: 'No conversations match your current search or filters. Try adjusting your search term or clearing the filters.',
  },
  'no-archived': {
    icon: Archive,
    title: 'No Archived Conversations',
    description: 'Conversations you archive will appear here. Archiving keeps your inbox tidy without losing valuable communication history.',
  },
};

export function SellerEmptyMessages({ variant, onClearFilters }: SellerEmptyMessagesProps) {
  const content = CONTENT[variant];
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F6F8FC] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#94A3B8]" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-[#111827]">{content.title}</h2>
      <p className="text-sm text-[#64748B] max-w-sm mb-6">{content.description}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {variant === 'no-results' && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        {variant === 'no-conversations' && (
          <Button asChild variant="outline">
            <Link to="/seller/listings">
              <LayoutDashboard className="w-4 h-4 mr-2" aria-hidden="true" />
              Manage Listings
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link to="/seller">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
