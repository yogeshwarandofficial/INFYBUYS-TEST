import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SellerListing } from '@/store/useSellerStore';
import { useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SellerListingStatusBadge } from './SellerListingStatusBadge';
import { DeleteListingDialog } from './DeleteListingDialog';
import { ArchiveListingDialog } from './ArchiveListingDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Pencil,
  Copy,
  Trash2,
  Archive,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  BarChart3,
  MessageSquare,
  CheckCircle,
  RotateCcw,
  Send,
} from 'lucide-react';

interface SellerListingCardProps {
  listing: SellerListing;
  view?: 'grid' | 'list';
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
};

export function SellerListingCard({ listing, view = 'grid' }: SellerListingCardProps) {
  const navigate = useNavigate();
  const { submitListing, markListingAsSold, restoreListing, duplicateListing } =
    useSellerStore();
  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const isList = view === 'list';

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

    if (status === 'sold' || status === 'archived') {
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

  if (isList) {
    return (
      <>
        <Card className="overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] rounded-2xl shadow-sm shadow-blue-900/5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 group">
          <div className="flex items-start sm:items-center gap-4 p-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted shrink-0">
              {(() => {
                const coverMedia = listing.media?.find((m: any) => m.id === listing.coverMediaId);
                const firstPhoto = listing.media?.find((m: any) => m.type === 'PHOTO');
                const heroUrl = coverMedia?.url || firstPhoto?.url || listing.image;

                return heroUrl ? (
                  <img
                    src={heroUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F6F8FC] flex items-center justify-center rounded-lg">
                    <DollarSign className="w-6 h-6 text-[#94A3B8]" />
                  </div>
                );
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-[15px] text-[#111827] truncate group-hover:text-[#2563EB] transition-colors">{listing.title}</h3>
                <SellerListingStatusBadge status={listing.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#94A3B8]" /> {listing.location}
                </span>
                <span className="flex items-center gap-1 font-medium text-[#2563EB]">
                  <DollarSign className="w-3 h-3" /> {formatPrice(listing.askingPrice)}
                </span>
                {listing.revenue && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#94A3B8]" /> Rev: {formatPrice(listing.revenue)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#94A3B8]" /> {listing.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#94A3B8]" /> {listing.enquiries} enquiries
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Listing actions">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">{menuItems()}</DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
        <DeleteListingDialog
          listing={listing}
          open={showDelete}
          onOpenChange={setShowDelete}
        />
        <ArchiveListingDialog
          listing={listing}
          open={showArchive}
          onOpenChange={setShowArchive}
        />
      </>
    );
  }

  return (
    <>
      <Card className="overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] rounded-2xl shadow-sm shadow-blue-900/5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col group">
        <div className="aspect-video relative overflow-hidden bg-[#F6F8FC] rounded-t-2xl">
          {(() => {
            const coverMedia = listing.media?.find((m: any) => m.id === listing.coverMediaId);
            const firstPhoto = listing.media?.find((m: any) => m.type === 'PHOTO');
            const heroUrl = coverMedia?.url || firstPhoto?.url || listing.image;

            return heroUrl ? (
              <img src={heroUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-[#F6F8FC] flex items-center justify-center">
                <DollarSign className="w-10 h-10 text-[#94A3B8]" />
              </div>
            );
          })()}
          <div className="absolute top-2 left-2">
            <SellerListingStatusBadge status={listing.status} />
          </div>
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 shadow-sm"
                  aria-label="Listing actions"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">{menuItems()}</DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader className="pb-2 pt-4 px-5">
          <h3 className="font-semibold text-base leading-snug line-clamp-2 text-[#111827] group-hover:text-[#2563EB] transition-colors">{listing.title}</h3>
          <p className="text-[13px] text-[#64748B] flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" /> {listing.location}
          </p>
        </CardHeader>

        <CardContent className="px-5 pb-3 flex-1">
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#64748B]">Asking Price</p>
              <p className="font-bold text-[#2563EB]">{formatPrice(listing.askingPrice)}</p>
            </div>
            {listing.revenue && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#64748B]">Revenue</p>
                <p className="font-semibold text-[#111827]">{formatPrice(listing.revenue)}</p>
              </div>
            )}
          </div>
          <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed">{listing.description}</p>
        </CardContent>

        <CardFooter className="px-5 pb-4 pt-3 flex items-center justify-between border-t border-[#E5E9F2] mt-auto bg-white/50">
          <div className="flex items-center gap-3.5 text-[11px] font-medium text-[#64748B]">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#94A3B8]" /> {listing.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#94A3B8]" /> {listing.enquiries}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />{' '}
              {new Date(listing.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-3 bg-white border-[#E5E9F2] hover:bg-slate-50 text-[#111827] rounded-lg shadow-sm"
            onClick={() => navigate(`/seller/listings/${listing.id}`)}
          >
            View
          </Button>
        </CardFooter>
      </Card>

      <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
      <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
    </>
  );
}
