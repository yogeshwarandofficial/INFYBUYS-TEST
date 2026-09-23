import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Send, Check, Trash2 } from 'lucide-react';
import { type ListingMedia } from '@/types/api';
import { useSellerStore } from '@/store/useSellerStore';

export const CATEGORIES = [
  'Technology', 'E-commerce', 'Food & Beverage', 'Professional Services',
  'Manufacturing', 'Education', 'Healthcare', 'Real Estate', 'Retail',
  'Transportation', 'Media & Entertainment', 'Finance', 'Agriculture', 'Other',
];

// Use string-based form schema for React Hook Form compatibility, convert on submit
export const listingFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  askingPrice: z.string().min(1, 'Asking price is required').refine(v => parseFloat(v) > 0, 'Must be greater than 0'),
  revenue: z.string().optional(),
  profit: z.string().optional(),
  establishedYear: z.string().optional(),
  employees: z.string().optional(),
  ndaRequired: z.boolean().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  image: z.any().optional(), // Can be a File or URL string
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
  isLoading,
  submitLabel = 'Publish Listing',
  listingId,
  media = [],
  coverMediaId,
}: SellerListingFormProps) {
  const { setCoverMedia, deleteMedia } = useSellerStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      image: '',
      customCategory: '',
      ...defaultValues,
    },
  });

  const category = watch('category');

  // Save draft ignores validation errors
  const handleSaveDraft = () => {
    const raw = watch();
    onSaveDraft(raw);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => alert(`Form validation failed: ${Object.keys(errors).join(', ')}`))} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Business Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Profitable SaaS Platform with 500+ customers"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="title-error" className="text-xs text-destructive" role="alert">{errors.title.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <Select
                value={category}
                onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
              >
                <SelectTrigger id="category" aria-invalid={!!errors.category} aria-label="Category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive" role="alert">{errors.category.message}</p>
              )}
            </div>

            {category === 'Other' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="customCategory">Please specify category <span className="text-destructive">*</span></Label>
                <Input
                  id="customCategory"
                  placeholder="e.g. Cryptocurrency"
                  {...register('customCategory')}
                />
                {errors.customCategory && (
                  <p className="text-xs text-destructive" role="alert">{errors.customCategory.message}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="subCategory">Sub-Category</Label>
              <Input
                id="subCategory"
                placeholder="e.g. B2B, Specialized Retail"
                {...register('subCategory')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
            <Input
              id="location"
              placeholder="e.g. Austin, TX or Remote (US)"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'location-error' : undefined}
              {...register('location')}
            />
            {errors.location && (
              <p id="location-error" className="text-xs text-destructive" role="alert">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              placeholder="Describe the business, its history, strengths, growth potential..."
              rows={5}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'desc-error' : undefined}
              {...register('description')}
            />
            {errors.description && (
              <p id="desc-error" className="text-xs text-destructive" role="alert">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="askingPrice">Asking Price (USD) <span className="text-destructive">*</span></Label>
              <Input
                id="askingPrice"
                type="number"
                placeholder="e.g. 500000"
                min={0}
                aria-invalid={!!errors.askingPrice}
                aria-describedby={errors.askingPrice ? 'price-error' : undefined}
                {...register('askingPrice')}
              />
              {errors.askingPrice && (
                <p id="price-error" className="text-xs text-destructive" role="alert">{errors.askingPrice.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="revenue">Annual Revenue (USD)</Label>
              <Input id="revenue" type="number" placeholder="e.g. 350000" min={0} {...register('revenue')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profit">Annual Profit (USD)</Label>
              <Input id="profit" type="number" placeholder="e.g. 120000" min={0} {...register('profit')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="establishedYear">Year Established</Label>
              <Input
                id="establishedYear"
                type="number"
                placeholder="e.g. 2018"
                min={1900}
                max={new Date().getFullYear()}
                {...register('establishedYear')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input id="employees" type="number" placeholder="e.g. 12" min={0} {...register('employees')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cover Image / Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="image">Upload Media</Label>
              <Input
                id="image"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                aria-invalid={!!errors.image}
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  
                  if (listingId) {
                    // Upload instantly if editing
                    for (const file of files) {
                      const type = file.type.startsWith('video') ? 'VIDEO' : 'PHOTO';
                      await useSellerStore.getState().uploadListingMedia(listingId, file, type);
                    }
                  } else {
                    // Save in form state for create mode
                    setValue('image', files, { shouldValidate: true });
                  }
                  e.target.value = ''; // Reset input to allow selecting the same files again
                }}
              />
              {errors.image && (
                <p className="text-xs text-destructive" role="alert">{errors.image?.message as string}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload a cover image or video for your listing. Max size 50MB.
              </p>
            </div>

            {watch('image') && (
              <div className="mt-4">
                <Label className="mb-2 block">New Media Preview</Label>
                <div className="rounded-md border overflow-hidden bg-muted/30 max-w-sm">
                  {(() => {
                    const mediaVal = watch('image');
                    let isVideo = false;
                    let mediaUrl = '';

                    if (Array.isArray(mediaVal) && mediaVal.length > 0) {
                      const firstFile = mediaVal[0];
                      if (firstFile instanceof File) {
                        isVideo = firstFile.type.startsWith('video/');
                        mediaUrl = URL.createObjectURL(firstFile);
                      }
                    } else if (mediaVal instanceof File) {
                      isVideo = mediaVal.type.startsWith('video/');
                      mediaUrl = URL.createObjectURL(mediaVal);
                    } else if (typeof mediaVal === 'string' && mediaVal) {
                      // Guess based on URL or string content for existing media
                      isVideo = mediaVal.toLowerCase().includes('.mp4') ||
                               mediaVal.toLowerCase().includes('.webm') ||
                               mediaVal.toLowerCase().includes('.mov') ||
                               mediaVal.includes('video');
                      mediaUrl = mediaVal;
                    }

                    if (!mediaUrl) return null;

                    return isVideo ? (
                      <video src={mediaUrl} controls className="w-full h-auto max-h-64 object-contain" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                    );
                  })()}
                </div>
              </div>
            )}

            {media && media.length > 0 && (
              <div className="mt-8 space-y-4">
                <Separator />
                <Label className="block text-base">Uploaded Media</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {media.map((m, idx) => (
                    <div key={m.id} className="relative rounded-md border overflow-hidden bg-muted flex flex-col">
                      <div className="h-40 flex items-center justify-center">
                        {m.type === 'VIDEO' ? (
                          <video src={m.url || ''} className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.url || ''} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-3 bg-background border-t space-y-2">
                        {m.type === 'VIDEO' ? (
                          <div className="text-center font-medium text-sm text-muted-foreground py-1">VIDEO</div>
                        ) : coverMediaId === m.id ? (
                          <div className="flex items-center justify-center font-medium text-sm text-green-600 bg-green-50 py-1 rounded h-9">
                            <Check className="w-4 h-4 mr-1.5" />
                            Cover Image
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={async () => {
                              if (listingId) {
                                await setCoverMedia(listingId, m.id);
                              }
                            }}
                          >
                            Set as Cover
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={async () => {
                            if (listingId) {
                              if (confirm('Are you sure you want to delete this media?\\n\\nNote: Media changes are saved instantly! You do not need to press "Save Changes" afterwards unless you are editing other text fields.')) {
                                await deleteMedia(listingId, m.id);
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confidentiality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Confidentiality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Require NDA from buyers?</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Require buyers to accept a Non-Disclosure Agreement before they can access the seller's contact details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer w-full sm:w-auto">
                  <input
                    type="radio"
                    value="false"
                    checked={watch('ndaRequired') === false}
                    onChange={() => setValue('ndaRequired', false)}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="font-medium text-sm">No</span>
                </label>
                <label className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer w-full sm:w-auto">
                  <input
                    type="radio"
                    value="true"
                    checked={watch('ndaRequired') === true}
                    onChange={() => setValue('ndaRequired', true)}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="font-medium text-sm">Yes</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Details (Hidden until subscribed)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input id="contactName" placeholder="e.g. John Smith" {...register('contactName')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" placeholder="e.g. john@example.com" aria-invalid={!!errors.contactEmail} aria-describedby={errors.contactEmail ? 'contact-email-error' : undefined} {...register('contactEmail')} />
              {errors.contactEmail && (
                <p id="contact-email-error" className="text-xs text-destructive" role="alert">{errors.contactEmail.message as string}</p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" type="tel" placeholder="e.g. +44 0000 000000" {...register('contactPhone')} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
