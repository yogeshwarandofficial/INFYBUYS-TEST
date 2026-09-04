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
import { useSellerProfile, useUpdateSellerProfile, useUploadSellerAvatar } from '@/hooks/useSellerProfile';
import { Upload, X } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone number is too short').max(20, 'Phone number is too long').optional().or(z.literal('')),
  companyName: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
  sellerType: z.string().optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  yearsOfExperience: z.string().optional().or(z.literal('')),
  preferredCategories: z.string().optional().or(z.literal('')),
  preferredLocations: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface SellerEditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any; // Kept for prop signature compat, though we use react-query inside
}

export function SellerEditProfileDialog({ open, onOpenChange }: SellerEditProfileDialogProps) {
  const { data: profile } = useSellerProfile();
  const updateProfileMutation = useUpdateSellerProfile();
  const uploadAvatarMutation = useUploadSellerAvatar();

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
      companyName: '',
      jobTitle: '',
      location: '',
      bio: '',
      sellerType: 'broker',
      website: '',
      linkedin: '',
      yearsOfExperience: '',
      preferredCategories: '',
      preferredLocations: '',
    },
  });

  const sellerType = watch('sellerType');

  // Reset form when dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        companyName: profile.companyName || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        bio: profile.bio || '',
        sellerType: profile.sellerType || 'broker',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        preferredCategories: profile.preferredCategories?.join(', ') || '',
        preferredLocations: profile.preferredLocations?.join(', ') || '',
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

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (avatarFile) {
        await uploadAvatarMutation.mutateAsync(avatarFile);
      }

      const parsedCategories = values.preferredCategories
        ? values.preferredCategories.split(',').map((c: string) => c.trim()).filter(Boolean)
        : [];

      const parsedLocations = values.preferredLocations
        ? values.preferredLocations.split(',').map((c: string) => c.trim()).filter(Boolean)
        : [];

      await updateProfileMutation.mutateAsync({
        phone: values.phone,
        jobTitle: values.jobTitle,
        location: values.location,
        bio: values.bio,
        sellerType: values.sellerType,
        website: values.website,
        linkedin: values.linkedin,
        yearsOfExperience: values.yearsOfExperience,
        preferredCategories: parsedCategories,
        preferredLocations: parsedLocations,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your seller profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-muted-foreground uppercase">
                    {profile?.fullName?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              {(avatarPreview || profile?.avatarUrl) && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New Image
              </Button>
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" readOnly className="bg-muted text-muted-foreground" {...register('fullName')} />
                <p className="text-xs text-muted-foreground">Name is linked to your account</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" readOnly className="bg-muted text-muted-foreground" {...register('email')} />
                <p className="text-xs text-muted-foreground">Email is linked to your account</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" readOnly className="bg-muted text-muted-foreground" {...register('companyName')} />
                <p className="text-xs text-muted-foreground">Company name is linked to KYC</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerType">Seller Type</Label>
              <Select 
                value={sellerType} 
                onValueChange={(value) => setValue('sellerType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" {...register('jobTitle')} placeholder="e.g. M&A Advisor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input id="yearsOfExperience" {...register('yearsOfExperience')} placeholder="e.g. 10+" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} placeholder="e.g. London, UK" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                {...register('bio')} 
                placeholder="Tell buyers about yourself and your expertise..."
                className="h-24 resize-none"
              />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCategories">Preferred Categories (Comma separated)</Label>
              <Input id="preferredCategories" {...register('preferredCategories')} placeholder="SaaS, E-commerce, Healthcare" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredLocations">Preferred Locations (Comma separated)</Label>
              <Input id="preferredLocations" {...register('preferredLocations')} placeholder="London, New York, Remote" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input id="website" {...register('website')} placeholder="https://example.com" />
                {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                <Input id="linkedin" {...register('linkedin')} placeholder="https://linkedin.com/in/..." />
                {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending || uploadAvatarMutation.isPending}
            >
              {(updateProfileMutation.isPending || uploadAvatarMutation.isPending) ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
