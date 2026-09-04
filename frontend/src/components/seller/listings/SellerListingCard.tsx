import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SellerListing } from '@/store/useSellerStore';
import { useSellerStore } from '@/store/useSellerStore';
import { ListingCard } from '@/components/shared/ListingCard';
import { DeleteListingDialog } from './DeleteListingDialog';
import { ArchiveListingDialog } from './ArchiveListingDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Pencil,
  Copy,
  Trash2,
  Archive,
  MoreHorizontal,
  CheckCircle,
  RotateCcw,
  Send,
} from 'lucide-react';

interface SellerListingCardProps {
  listing: SellerListing;
  view?: 'grid' | 'list';
}

export function SellerListingCard({ listing, view = 'grid' }: SellerListingCardProps) {
  const navigate = useNavigate();
  const { submitListing, markListingAsSold, markListingAsActive, restoreListing, duplicateListing } =
    useSellerStore();
  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const handleDuplicate = () => {
    const newId = duplicateListing(listing.id);
    if (newId) navigate(`/seller/listings/${newId}/edit`);
  };

  const menuItems = () => {
    const items: React.ReactNode[] = [];
    const { status } = listing;

    items.push(
      <DropdownMenuItem key="view" onClick={() => navigate(`/seller/listings/${listing.id}`)}>
        <Eye className="w-4 h-4 mr-2" /> View Preview
      </DropdownMenuItem>
    );

    if (status !== 'sold' && status !== 'archived') {
      items.push(
        <DropdownMenuItem key="edit" onClick={() => navigate(`/seller/listings/${listing.id}/edit`)}>
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </DropdownMenuItem>
      );
    }

    items.push(
      <DropdownMenuItem key="dup" onClick={handleDuplicate}>
        <Copy className="w-4 h-4 mr-2" /> Duplicate
      </DropdownMenuItem>
    );

    items.push(<DropdownMenuSeparator key="sep1" />);

    if (status === 'draft') {
      items.push(
        <DropdownMenuItem key="submit" onClick={() => submitListing(listing.id)}>
          <Send className="w-4 h-4 mr-2" /> Submit for Review
        </DropdownMenuItem>
      );
    }

    if (status === 'active') {
      items.push(
        <DropdownMenuItem key="sold" onClick={() => markListingAsSold(listing.id)}>
          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Mark as Sold
        </DropdownMenuItem>
      );
      items.push(
        <DropdownMenuItem key="archive" onClick={() => setShowArchive(true)}>
          <Archive className="w-4 h-4 mr-2" /> Archive
        </DropdownMenuItem>
      );
    }

    if (status === 'pending') {
      items.push(
        <DropdownMenuItem key="archive" onClick={() => setShowArchive(true)}>
          <Archive className="w-4 h-4 mr-2" /> Archive
        </DropdownMenuItem>
      );
    }

    if (status === 'sold') {
      items.push(
        <DropdownMenuItem key="active" onClick={() => markListingAsActive(listing.id)}>
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Mark as Active
        </DropdownMenuItem>
      );
    }

    if (status === 'archived') {
      items.push(
        <DropdownMenuItem key="restore" onClick={() => restoreListing(listing.id)}>
          <RotateCcw className="w-4 h-4 mr-2" /> Restore as Draft
        </DropdownMenuItem>
      );
    }

    if (status === 'draft' || status === 'archived') {
      items.push(<DropdownMenuSeparator key="sep2" />);
      items.push(
        <DropdownMenuItem
          key="delete"
          className="text-destructive focus:text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      );
    }

    return items;
  };

  const topRightAction = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full shadow-sm bg-white/90 hover:bg-white text-[#111827]"
          aria-label="Listing actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{menuItems()}</DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <ListingCard
        listing={listing}
        variant={view === 'list' ? 'list' : 'latest'}
        showFavoriteButton={false}
        topRightAction={topRightAction}
        showPerformance={true}
        isSeller={true}
      />
      <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
      <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
    </>
  );
}
