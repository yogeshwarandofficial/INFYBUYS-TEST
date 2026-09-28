import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import {
  UploadCloud,
  Save,
  Send,
  Check,
  Trash2,
  ChevronDown,
  FileVideo,
  X,
  Loader2
} from 'lucide-react';
import { type ListingMedia } from '@/types/api';
import { useSellerStore } from '@/store/useSellerStore';

export const CATEGORIES = [
  'Technology & SaaS',
  'E-Commerce',
  'Retail',
  'Food & Beverage',
  'Professional Services',
  'Manufacturing',
  'Education',
  'Healthcare',
  'Real Estate',
  'Transportation',
  'Media & Entertainment',
  'Finance',
  'Agriculture',
  'Other',
];

export const listingFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  askingPrice: z
    .string()
    .min(1, 'Asking price is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Asking price must be greater than 0'),
  revenue: z.string().optional(),
  profit: z.string().optional(),
  establishedYear: z.string().optional(),
  employees: z.string().optional(),
  ndaRequired: z.boolean().optional(),
  contactName: z.string().min(2, 'Contact name is required'),
  contactEmail: z.string().email('Valid contact email is required'),
  contactPhone: z.string().optional(),
  image: z.any().optional(),
  customCategory: z.string().optional(),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

interface SellerListingFormProps {
  defaultValues?: Partial<ListingFormValues>;
  onSaveDraft: (values: ListingFormValues) => void;
  onSubmit: (values: ListingFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
  listingId?: string;
  media?: ListingMedia[];
  coverMediaId?: string;
}

export function SellerListingForm({
  defaultValues,
  onSaveDraft,
  onSubmit,
  isLoading = false,
  submitLabel = 'Submit for Review',
  listingId,
  media = [],
  coverMediaId,
}: SellerListingFormProps) {
  const { setCoverMedia, deleteMedia } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ url: string; isVideo: boolean; file: File }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      category: '',
      subCategory: '',
      location: '',
      description: '',
      askingPrice: '',
      revenue: '',
      profit: '',
      establishedYear: '',
      employees: '',
      ndaRequired: false,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      image: undefined,
      customCategory: '',
      ...defaultValues,
    },
  });

  const category = watch('category');
  const ndaRequired = watch('ndaRequired');

  // Handle preview URLs cleanup
  useEffect(() => {
    const urls = stagedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
      file,
    }));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [stagedFiles]);

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const validFiles = files.filter((f) => f.size <= 50 * 1024 * 1024); // max 50MB
    if (validFiles.length < files.length) {
      alert('Some files were ignored because they exceed the 50MB limit.');
    }

    if (listingId) {
      // Direct upload if in edit mode
      for (const file of validFiles) {
        const type = file.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
        useSellerStore.getState().uploadListingMedia(listingId, file, type);
      }
    } else {
      // Stage files for create mode
      setStagedFiles((prev) => {
        const updated = [...prev, ...validFiles];
        setValue('image', updated, { shouldValidate: true });
        return updated;
      });
    }
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue('image', updated.length > 0 ? updated : undefined, { shouldValidate: true });
      return updated;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleSaveDraftClick = () => {
    const raw = watch();
    onSaveDraft(raw);
  };

  return (
    <form id="listingForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Card 1: Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          Basic Information
        </h3>

        <div className="space-y-5">
          {/* Business Title */}
          <div>
            <div
              className={cn(
                "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                errors.title ? "border-red-400 bg-red-50/20" : "border-slate-200"
              )}
            >
              <input
                type="text"
                id="title"
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('title')}
              />
              <label
                htmlFor="title"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Business Title <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.title && (
              <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div
                className={cn(
                  "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                  errors.category ? "border-red-400 bg-red-50/20" : "border-slate-200"
                )}
              >
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setValue('category', e.target.value, { shouldValidate: true })}
                  className="peer w-full h-14 px-4 pt-5 pb-1 bg-transparent text-slate-900 focus:outline-none appearance-none cursor-pointer rounded-xl text-sm font-medium"
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <label className="absolute left-4 top-2 text-[11px] font-semibold text-slate-500 peer-focus:text-blue-600 transition-colors pointer-events-none">
                  Category <span className="text-red-500">*</span>
                </label>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.category.message}</p>
              )}
            </div>

            {/* Sub Category */}
            <div>
              <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
                <input
                  type="text"
                  id="subCategory"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                  {...register('subCategory')}
                />
                <label
                  htmlFor="subCategory"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                  Sub-Category (Optional)
                </label>
              </div>
            </div>
          </div>

          {/* Custom Category if Other */}
          {category === 'Other' && (
            <div className="animate-fade-in">
              <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
                <input
                  type="text"
                  id="customCategory"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                  {...register('customCategory')}
                />
                <label
                  htmlFor="customCategory"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                  Specify Custom Category <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <div
              className={cn(
                "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                errors.location ? "border-red-400 bg-red-50/20" : "border-slate-200"
              )}
            >
              <input
                type="text"
                id="location"
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('location')}
              />
              <label
                htmlFor="location"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Location <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.location && (
              <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.location.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div
              className={cn(
                "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                errors.description ? "border-red-400 bg-red-50/20" : "border-slate-200"
              )}
            >
              <textarea
                id="description"
                placeholder=" "
                rows={4}
                className="peer w-full px-4 pt-6 pb-2 bg-transparent text-slate-900 focus:outline-none resize-y rounded-xl text-sm font-medium min-h-[110px]"
                {...register('description')}
              />
              <label
                htmlFor="description"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Description <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.description && (
              <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Financial Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          Financial Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Asking Price */}
          <div>
            <div
              className={cn(
                "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                errors.askingPrice ? "border-red-400 bg-red-50/20" : "border-slate-200"
              )}
            >
              <input
                type="number"
                id="askingPrice"
                placeholder=" "
                min={0}
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('askingPrice')}
              />
              <label
                htmlFor="askingPrice"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Asking Price (USD) <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.askingPrice && (
              <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.askingPrice.message}</p>
            )}
          </div>

          {/* Revenue */}
          <div>
            <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <input
                type="number"
                id="revenue"
                placeholder=" "
                min={0}
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('revenue')}
              />
              <label
                htmlFor="revenue"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Annual Revenue (USD)
              </label>
            </div>
          </div>

          {/* Profit */}
          <div>
            <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <input
                type="number"
                id="profit"
                placeholder=" "
                min={0}
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('profit')}
              />
              <label
                htmlFor="profit"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Annual Profit (USD)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Business Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          Business Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <input
                type="number"
                id="establishedYear"
                placeholder=" "
                min={1800}
                max={new Date().getFullYear()}
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('establishedYear')}
              />
              <label
                htmlFor="establishedYear"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Year Established
              </label>
            </div>
          </div>

          <div>
            <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <input
                type="number"
                id="employees"
                placeholder=" "
                min={0}
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('employees')}
              />
              <label
                htmlFor="employees"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Number of Employees
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Media Upload */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <h3 className="text-base font-bold text-slate-900 mb-1">Cover Image / Video</h3>
        <p className="text-xs text-slate-500 mb-5">
          Upload cover images or video for your listing. High quality media improves buyer conversion. Max size 50MB per file.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFilesSelected(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
        />

        {/* Drag & Drop Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-300 cursor-pointer overflow-hidden text-center",
            isDragging
              ? "border-blue-500 bg-blue-50/60 scale-[0.99]"
              : "border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30"
          )}
        >
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 mb-3.5">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
            Choose Files or Drag & Drop
          </p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or MP4 up to 50MB</p>
        </div>

        {/* Staged New Media Preview */}
        {previewUrls.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selected Media ({previewUrls.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {previewUrls.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-video group"
                >
                  {item.isVideo ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStagedFile(idx);
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-slate-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {item.isVideo && (
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <FileVideo className="w-3 h-3" /> Video
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Uploaded Media (for edit mode) */}
        {media && media.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Uploaded Media ({media.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((m, idx) => (
                <div
                  key={m.id}
                  className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col shadow-sm"
                >
                  <div className="h-36 flex items-center justify-center bg-slate-900/5">
                    {m.type === 'VIDEO' ? (
                      <video src={m.url || ''} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={m.url || ''}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 space-y-2">
                    {coverMediaId === m.id ? (
                      <div className="flex items-center justify-center font-bold text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5 mr-1" /> Cover Image
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        onClick={async () => {
                          if (listingId) {
                            await setCoverMedia(listingId, m.id);
                          }
                        }}
                      >
                        Set as Cover
                      </button>
                    )}
                    <button
                      type="button"
                      className="w-full py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      onClick={async () => {
                        if (listingId) {
                          if (confirm('Are you sure you want to delete this media?')) {
                            await deleteMedia(listingId, m.id);
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card 5: Confidentiality (iOS Style Toggle) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Confidentiality</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Require buyers to accept a Non-Disclosure Agreement (NDA) before they can access contact details and confidential records.
            </p>
          </div>

          <Controller
            name="ndaRequired"
            control={control}
            render={({ field }) => (
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  id="ndaRequired"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-13 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 transition-colors duration-300 shadow-inner" />
              </label>
            )}
          />
        </div>
      </div>

      {/* Card 6: Contact Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300">
        <h3 className="text-base font-bold text-slate-900 mb-1">Contact Details</h3>
        <p className="text-xs text-slate-500 mb-6">
          {ndaRequired
            ? 'Protected by NDA. Only buyers with signed NDAs can view these details.'
            : 'Visible to verified buyers on the platform.'}
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Name */}
            <div>
              <div
                className={cn(
                  "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                  errors.contactName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                )}
              >
                <input
                  type="text"
                  id="contactName"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                  {...register('contactName')}
                />
                <label
                  htmlFor="contactName"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                  Contact Name <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.contactName && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.contactName.message}</p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <div
                className={cn(
                  "relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10",
                  errors.contactEmail ? "border-red-400 bg-red-50/20" : "border-slate-200"
                )}
              >
                <input
                  type="email"
                  id="contactEmail"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                  {...register('contactEmail')}
                />
                <label
                  htmlFor="contactEmail"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                  Contact Email <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.contactEmail && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <div className="relative group transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
              <input
                type="tel"
                id="contactPhone"
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 pb-1 bg-transparent text-slate-900 focus:outline-none rounded-xl text-sm font-medium"
                {...register('contactPhone')}
              />
              <label
                htmlFor="contactPhone"
                className="absolute left-4 top-4 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Contact Phone
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 md:-mx-8 p-4 sm:p-5 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-[800px] mx-auto flex items-center justify-between px-2 sm:px-4">
          <span className="text-xs text-red-500 font-medium">
            * Required fields
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSaveDraftClick}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Save as Draft</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center gap-2 group min-w-[170px] justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent z-0 pointer-events-none" />

              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white z-10 relative" />
                  <span className="z-10 relative">Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white z-10 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="z-10 relative">{submitLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
