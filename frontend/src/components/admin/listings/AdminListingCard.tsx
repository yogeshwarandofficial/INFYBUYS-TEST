import type { AdminListing } from '../../../store/useAdminStore';
import { ListingCard } from '../../shared/ListingCard';
import { AdminListingVerificationBadge } from './AdminListingStatusBadge';
import { AdminListingActions } from './AdminListingActions';
import { useNavigate } from 'react-router';

interface AdminListingCardProps {
  listing: AdminListing;
}

export function AdminListingCard({ listing }: AdminListingCardProps) {
  const navigate = useNavigate();

  const topRightAction = (
    <div className="flex gap-2 items-center bg-white/90 p-1 rounded-md shadow-sm" onClick={(e) => e.stopPropagation()}>
      <AdminListingVerificationBadge isVerified={listing.isVerified} />
      <AdminListingActions listing={listing} />
    </div>
  );

  return (
    <div
      onClick={() => navigate(`/admin/listings/${listing.id}`)}
      className="cursor-pointer group"
    >
      <ListingCard
        listing={{
          ...listing,
          askingPrice: listing.price,
          status: listing.status,
        }}
        showFavoriteButton={false}
        topRightAction={topRightAction}
        showPerformance={true}
        className="h-full"
      />
    </div>
  );
}
