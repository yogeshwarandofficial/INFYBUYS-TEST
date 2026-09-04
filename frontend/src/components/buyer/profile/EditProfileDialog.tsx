import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBuyerProfile, useUpdateBuyerProfile, useUploadAvatar } from '@/hooks/useBuyerProfile';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is too short').max(20, 'Phone number is too long').optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
  buyerType: z.enum(['Individual', 'Corporate', 'Private Equity', 'Search Fund']),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { data: profile } = useBuyerProfile();
  const updateProfileMutation = useUpdateBuyerProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      location: '',
      bio: '',
      buyerType: 'Corporate',
      website: '',
      linkedin: '',
    },
  });

  const buyerType = watch('buyerType');

  // Reset form when dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        bio: profile.bio || '',
        buyerType: profile.buyerType as any || 'Corporate',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  }, [open, profile, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (avatarFile) {
        await uploadAvatarMutation.mutateAsync(avatarFile);
      }
      await updateProfileMutation.mutateAsync(data);
      toast.success('Profile updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const isSubmitting = updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your professional information and contact details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          
          <div className="flex flex-col space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border bg-muted flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">{profile?.fullName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
                {avatarPreview && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Max size: 5MB. Formats: JPEG, PNG, WebP.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register('fullName')} aria-invalid={!!errors.fullName} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register('phone')} aria-invalid={!!errors.phone} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} aria-invalid={!!errors.location} />
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register('company')} aria-invalid={!!errors.company} />
              {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" {...register('jobTitle')} aria-invalid={!!errors.jobTitle} />
              {errors.jobTitle && <p className="text-sm text-destructive">{errors.jobTitle.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="buyerType">Buyer Type</Label>
              <Select
                value={buyerType}
                onValueChange={(value) => setValue('buyerType', value as ProfileFormValues['buyerType'])}
              >
                <SelectTrigger id="buyerType" aria-label="Select buyer type">
                  <SelectValue placeholder="Select buyer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Search Fund">Search Fund</SelectItem>
                </SelectContent>
              </Select>
              {errors.buyerType && <p className="text-sm text-destructive">{errors.buyerType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website (URL)</Label>
              <Input id="website" placeholder="https://" {...register('website')} aria-invalid={!!errors.website} />
              {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (URL)</Label>
              <Input id="linkedin" placeholder="https://" {...register('linkedin')} aria-invalid={!!errors.linkedin} />
              {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="bio">Bio / Investment Criteria</Label>
            <Textarea
              id="bio"
              className="min-h-[100px]"
              {...register('bio')}
              aria-invalid={!!errors.bio}
            />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
