import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SellerListing } from '@/store/useSellerStore';
import { useSellerStore } from '@/store/useSellerStore';
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
  CheckCircle,
  RotateCcw,
  Send,
  MapPin,
  ArrowRight,
  Eye as ViewsIcon,
  MessageSquare
} from 'lucide-react';

interface SellerListingCardProps {
  listing: SellerListing;
  view?: 'grid' | 'list';
}

const formatPrice = (price: any) => {
  if (price == null || price === '') return '-';
  const num = Number(price);
  if (isNaN(num)) return '-';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

function formatTimeAgo(dateString?: string) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';
  const now = new Date();
  const diffInMs = Math.max(0, now.getTime() - date.getTime());
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `Added ${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Added ${diffInDays}d ago`;
  if (diffInDays < 30) return `Added ${Math.floor(diffInDays / 7)}w ago`;
  return `Added ${Math.floor(diffInDays / 30)}mo ago`;
}

export function SellerListingCard({ listing, view = 'grid' }: SellerListingCardProps) {
  const navigate = useNavigate();
  const {
    submitListing,
    markListingAsSold,
    markListingAsActive,
    restoreListing,
    duplicateListing,
  } = useSellerStore();
  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = duplicateListing(listing.id);
    if (newId) navigate(`/seller/listings/${newId}/edit`);
  };

  const handleNavigate = () => {
    navigate(`/seller/listings/${listing.id}`);
  };

  const coverUrl =
    listing.media?.find((m: any) => m.id === listing.coverMediaId)?.url ||
    listing.media?.[0]?.url ||
    listing.image ||
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800';

  const isVideo =
    coverUrl.toLowerCase().endsWith('.mp4') ||
    coverUrl.toLowerCase().endsWith('.webm') ||
    coverUrl.toLowerCase().endsWith('.mov');

  const renderStatusBadge = () => {
    const status = (listing.status || 'draft').toLowerCase();

    if (status === 'active') {
      return (
        <div className="backdrop-blur-md bg-white/90 border border-white/20 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Active</span>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="backdrop-blur-md bg-white/90 border border-white/20 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Pending</span>
        </div>
      );
    }

    if (status === 'sold') {
      return (
        <div className="backdrop-blur-md bg-white/90 border border-white/20 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Sold</span>
        </div>
      );
    }

    if (status === 'archived') {
      return (
        <div className="backdrop-blur-md bg-white/90 border border-white/20 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Archived</span>
        </div>
      );
    }

    return (
      <div className="backdrop-blur-md bg-white/90 border border-white/20 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400" />
        </span>
        <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Draft</span>
      </div>
    );
  };

  const menuItems = () => {
    const items: React.ReactNode[] = [];
    const { status } = listing;

    items.push(
      <DropdownMenuItem
        key="view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/seller/listings/${listing.id}`);
        }}
      >
        <Eye className="w-4 h-4 mr-2" /> View Preview
      </DropdownMenuItem>
    );

    if (status !== 'sold' && status !== 'archived') {
      items.push(
        <DropdownMenuItem
          key="edit"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/seller/listings/${listing.id}/edit`);
          }}
        >
          <Pencil className="w-4 h-4 mr-2" /> Edit Listing
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
        <DropdownMenuItem
          key="submit"
          onClick={(e) => {
            e.stopPropagation();
            submitListing(listing.id);
          }}
        >
          <Send className="w-4 h-4 mr-2" /> Submit for Review
        </DropdownMenuItem>
      );
    }

    if (status === 'active') {
      items.push(
        <DropdownMenuItem
          key="sold"
          onClick={(e) => {
            e.stopPropagation();
            markListingAsSold(listing.id);
          }}
        >
          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Mark as Sold
        </DropdownMenuItem>
      );
      items.push(
        <DropdownMenuItem
          key="archive"
          onClick={(e) => {
            e.stopPropagation();
            setShowArchive(true);
          }}
        >
          <Archive className="w-4 h-4 mr-2" /> Archive
        </DropdownMenuItem>
      );
    }

    if (status === 'pending') {
      items.push(
        <DropdownMenuItem
          key="archive"
          onClick={(e) => {
            e.stopPropagation();
            setShowArchive(true);
          }}
        >
          <Archive className="w-4 h-4 mr-2" /> Archive
        </DropdownMenuItem>
      );
    }

    if (status === 'sold') {
      items.push(
        <DropdownMenuItem
          key="active"
          onClick={(e) => {
            e.stopPropagation();
            markListingAsActive(listing.id);
          }}
        >
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Mark as Active
        </DropdownMenuItem>
      );
    }

    if (status === 'archived') {
      items.push(
        <DropdownMenuItem
          key="restore"
          onClick={(e) => {
            e.stopPropagation();
            restoreListing(listing.id);
          }}
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Restore as Draft
        </DropdownMenuItem>
      );
    }

    if (status === 'draft' || status === 'archived') {
      items.push(<DropdownMenuSeparator key="sep2" />);
      items.push(
        <DropdownMenuItem
          key="delete"
          className="text-red-600 focus:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowDelete(true);
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      );
    }

    return items;
  };

  const actionDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-8 h-8 rounded-full backdrop-blur-md bg-white/90 border border-white/20 shadow-sm flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-colors z-10 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Listing options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-1 z-50">
        {menuItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // List View Rendering
  if (view === 'list') {
    return (
      <>
        <div
          onClick={handleNavigate}
          className="group relative bg-white rounded-[20px] border border-slate-200/70 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_0_20px_rgba(59,130,246,0.05)] hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center p-4 gap-5 cursor-pointer"
        >
          {/* Image */}
          <div className="relative h-44 md:h-32 w-full md:w-48 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            {isVideo ? (
              <video src={coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            ) : (
              <img src={coverUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            )}
            <div className="absolute top-2.5 left-2.5">{renderStatusBadge()}</div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{listing.category}</span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate uppercase">
                    {listing.title}
                  </h3>
                </div>
                <div className="md:hidden">{actionDropdown}</div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-slate-500">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                <p className="text-[10px] font-bold tracking-wider uppercase truncate">{listing.location}</p>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-2">{listing.description}</p>
            </div>

            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 font-semibold">
              <span>{formatTimeAgo(listing.createdAt)}</span>
              <span className="flex items-center gap-1"><ViewsIcon className="w-3 h-3" /> {listing.views || 0} views</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {listing.enquiries || 0} enquiries</span>
            </div>
          </div>

          {/* Financials & Actions */}
          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:border-l md:border-slate-100 md:pl-6 shrink-0">
            <div className="text-left md:text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asking Price</p>
              <p className="text-base font-extrabold text-slate-900">{formatPrice(listing.askingPrice)}</p>
              {listing.revenue != null && (
                <p className="text-xs font-bold text-blue-600">Rev: {formatPrice(listing.revenue)}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">{actionDropdown}</div>
              <button
                type="button"
                className="text-[13px] font-bold text-blue-600 flex items-center gap-1 group/btn hover:text-blue-700 cursor-pointer"
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
        <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
      </>
    );
  }

  // Grid View Rendering
  return (
    <>
      <div
        onClick={handleNavigate}
        className="group relative bg-white rounded-[24px] border border-slate-200/80 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_0_20px_rgba(59,130,246,0.05)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
      >
        {/* Card Header / Image Area */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 shrink-0">
          {isVideo ? (
            <video
              src={coverUrl}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={coverUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          )}

          {/* Overlay Gradient for better badge contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20 pointer-events-none" />

          {/* Status Badges */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            {renderStatusBadge()}
          </div>

          {/* Action Menu Button */}
          <div className="absolute top-3.5 right-3.5">
            {actionDropdown}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Title & Location */}
          <div className="mb-4">
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate uppercase">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <p className="text-xs font-bold tracking-wider uppercase truncate">
                {listing.location}
              </p>
            </div>
          </div>

          {/* Financials Dashboard Style Block */}
          <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden mb-5 border border-slate-100">
            <div className="bg-slate-50 p-3 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Asking Price
              </p>
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                {formatPrice(listing.askingPrice)}
              </p>
            </div>
            <div className="bg-slate-50 p-3 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Revenue
              </p>
              <p className="text-base sm:text-lg font-extrabold text-blue-600">
                {formatPrice(listing.revenue)}
              </p>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-5 flex-1">
            {listing.description}
          </p>

          {/* Footer Action */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
            <span className="text-xs font-semibold text-slate-400">
              {formatTimeAgo(listing.createdAt)}
            </span>
            <button
              type="button"
              className="text-sm font-bold text-blue-600 flex items-center gap-1.5 group/btn cursor-pointer hover:text-blue-700 transition-colors"
            >
              View Details
              <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
      <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
    </>
  );
}
