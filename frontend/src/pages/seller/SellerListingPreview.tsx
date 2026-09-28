import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { DeleteListingDialog } from '@/components/seller/listings/DeleteListingDialog';
import { ArchiveListingDialog } from '@/components/seller/listings/ArchiveListingDialog';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Eye,
  MessageSquare,
  Pencil,
  CheckCircle,
  RotateCcw,
  Archive,
  Trash2,
  Send,
  Copy,
  Clock,
  Image as ImageIcon,
  FileText,
  ListFilter,
  TrendingUp,
  Tag
} from 'lucide-react';

const formatPrice = (price: any) => {
  if (price == null || price === '') return '-';
  const num = Number(price);
  if (isNaN(num)) return '-';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const splitPrice = (price: any) => {
  if (price == null || price === '') return { value: '-', suffix: '' };
  const num = Number(price);
  if (isNaN(num)) return { value: '-', suffix: '' };
  if (num >= 1_000_000) {
    return { value: `$${(num / 1_000_000).toFixed(2)}`, suffix: 'M' };
  }
  if (num >= 1_000) {
    return { value: `$${(num / 1_000).toFixed(0)}`, suffix: 'K' };
  }
  return { value: `$${num.toLocaleString()}`, suffix: '' };
};

export default function SellerListingPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, submitListing, markListingAsSold, markListingAsActive, restoreListing, duplicateListing } =
    useSellerStore();

  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="p-12 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-sm text-slate-500">The listing you are looking for does not exist or has been removed.</p>
        <Link
          to="/seller/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Listings
        </Link>
      </div>
    );
  }

  const handleDuplicate = () => {
    const newId = duplicateListing(listing.id);
    if (newId) navigate(`/seller/listings/${newId}/edit`);
  };

  const coverUrl =
    listing.media?.find((m: any) => m.id === listing.coverMediaId)?.url ||
    listing.media?.[0]?.url ||
    listing.image ||
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200';

  const isVideo =
    coverUrl.toLowerCase().endsWith('.mp4') ||
    coverUrl.toLowerCase().endsWith('.webm') ||
    coverUrl.toLowerCase().endsWith('.mov');

  const priceParts = splitPrice(listing.askingPrice);

  const renderStatusBadge = () => {
    const status = (listing.status || 'draft').toLowerCase();

    if (status === 'active') {
      return (
        <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">Active</span>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">Pending Review</span>
        </div>
      );
    }

    if (status === 'sold') {
      return (
        <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-full flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-xs font-bold text-rose-700 tracking-wide uppercase">Sold</span>
        </div>
      );
    }

    if (status === 'archived') {
      return (
        <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Archived</span>
        </div>
      );
    }

    return (
      <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Draft</span>
      </div>
    );
  };

  return (
    <>
      <Seo title={`${listing.title} | InfyBuys Seller`} description={listing.description?.slice(0, 160)} />

      <div className="max-w-[1200px] mx-auto space-y-8 pb-16">
        {/* Page Header & Action Bar (Integrated) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-up">
          <div className="flex items-start gap-4">
            <Link
              to="/seller/listings"
              className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all shrink-0 cursor-pointer shadow-sm"
              aria-label="Back to listings"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                  {listing.title}
                </h1>
                {renderStatusBadge()}
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last updated: {new Date(listing.updatedAt || listing.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Modern Action Bar */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 self-start md:self-auto flex-wrap">
            {listing.status !== 'sold' && listing.status !== 'archived' && (
              <Link
                to={`/seller/listings/${listing.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-all group cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Edit</span>
              </Link>
            )}

            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            <button
              type="button"
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span>Duplicate</span>
            </button>

            {listing.status === 'draft' && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => submitListing(listing.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all group cursor-pointer"
                >
                  <Send className="w-4 h-4 text-blue-500 transition-colors" />
                  <span>Submit for Review</span>
                </button>
              </>
            )}

            {listing.status === 'active' && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => markListingAsSold(listing.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all group cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-blue-500 transition-colors" />
                  <span>Mark as Sold</span>
                </button>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => setShowArchive(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all group cursor-pointer"
                >
                  <Archive className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Archive</span>
                </button>
              </>
            )}

            {listing.status === 'pending' && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => setShowArchive(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all group cursor-pointer"
                >
                  <Archive className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Archive</span>
                </button>
              </>
            )}

            {listing.status === 'sold' && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => markListingAsActive(listing.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-all group cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 transition-colors" />
                  <span>Mark as Active</span>
                </button>
              </>
            )}

            {listing.status === 'archived' && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => restoreListing(listing.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all group cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  <span>Restore as Draft</span>
                </button>
              </>
            )}

            {(listing.status === 'draft' || listing.status === 'archived') && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all group cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-500 transition-colors" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Media & Description) */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up delay-100">
            {/* Cinematic Media Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden group relative">
              <div className="w-full aspect-video md:aspect-[21/9] lg:aspect-video relative overflow-hidden bg-slate-100">
                {isVideo ? (
                  <video
                    src={coverUrl}
                    controls
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                ) : (
                  <img
                    src={coverUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                )}

                {/* Subtle inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Floating label on image */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-white/20 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">Cover Media</span>
                </div>
              </div>
            </div>

            {/* About Business Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">About This Business</h2>
              </div>

              <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {listing.description}
              </div>
            </div>
          </div>

          {/* Right Column (Financials & Details) */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up delay-200">
            {/* High-Impact Financials Card */}
            <div className="bg-slate-900 bg-pan bg-gradient-to-br from-slate-900 via-[#1e293b] to-blue-950 rounded-[24px] shadow-[0_20px_40px_-15px_rgba(30,58,138,0.5)] border border-slate-700 p-8 relative overflow-hidden text-white">
              {/* Glowing Background Orb */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

              <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-2">
                Asking Price
              </h3>

              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-5xl font-extrabold text-white tracking-tight">
                  {priceParts.value}
                </span>
                {priceParts.suffix && (
                  <span className="text-2xl font-bold text-blue-400">{priceParts.suffix}</span>
                )}
              </div>

              <div className="h-px w-full bg-slate-700/50 mb-6" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Annual Revenue</p>
                  <p className="text-lg font-bold text-white">
                    {listing.revenue != null ? formatPrice(listing.revenue) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Annual Profit</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {listing.profit != null ? formatPrice(listing.profit) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Details Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-blue-600" />
                Listing Details
              </h3>

              <ul className="space-y-3 pt-1">
                <li className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" /> Category
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                    {listing.category}
                  </span>
                </li>

                {listing.subCategory && (
                  <li className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" /> Sub-Category
                    </span>
                    <span className="text-sm font-bold text-slate-900 text-right">{listing.subCategory}</span>
                  </li>
                )}

                <li className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Location
                  </span>
                  <span className="text-sm font-bold text-slate-900 text-right uppercase">{listing.location}</span>
                </li>

                {listing.establishedYear && (
                  <li className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> Established
                    </span>
                    <span className="text-sm font-bold text-slate-900">{listing.establishedYear}</span>
                  </li>
                )}

                {listing.employees !== undefined && (
                  <li className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" /> Employees
                    </span>
                    <span className="text-sm font-bold text-slate-900">{listing.employees}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Performance Metrics Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Performance
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors group">
                  <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                  <p className="text-2xl font-extrabold text-slate-900">{listing.views || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
                    Total Views
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors group">
                  <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                  <p className="text-2xl font-extrabold text-slate-900">{listing.enquiries || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
                    Enquiries
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Created</span>
                  <span className="text-slate-700 font-semibold">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Last Updated</span>
                  <span className="text-slate-700 font-semibold">
                    {new Date(listing.updatedAt || listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteListingDialog listing={listing} open={showDelete} onOpenChange={setShowDelete} />
      <ArchiveListingDialog listing={listing} open={showArchive} onOpenChange={setShowArchive} />
    </>
  );
}
