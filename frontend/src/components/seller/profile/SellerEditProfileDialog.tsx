import { useEffect } from 'react';
import { type SellerProfile, useSellerStore } from '@/store/useSellerStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  sellerType: z.enum(['broker', 'individual', 'agency']),
  yearsOfExperience: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface SellerEditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SellerProfile;
}

export function SellerEditProfileDialog({ open, onOpenChange, profile }: SellerEditProfileDialogProps) {
  const { updateSellerProfile } = useSellerStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phone: profile.phone || '',
      companyName: profile.companyName || '',
      jobTitle: profile.jobTitle || '',
      location: profile.location || '',
      sellerType: profile.sellerType,
      yearsOfExperience: profile.yearsOfExperience || '',
      bio: profile.bio || '',
      website: profile.website || '',
      linkedin: profile.linkedin || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        fullName: profile.fullName,
        phone: profile.phone || '',
        companyName: profile.companyName || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        sellerType: profile.sellerType,
        yearsOfExperience: profile.yearsOfExperience || '',
        bio: profile.bio || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
      });
    }
  }, [open, profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateSellerProfile(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your public profile information. This will be visible to buyers on the platform.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Basic Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  {errors.fullName && <p id="fullName-error" className="text-[10px] text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Business Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" {...register('companyName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" {...register('jobTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., San Francisco, CA" {...register('location')} />
                </div>
                <div className="space-y-2">
                  <Label>Seller Type</Label>
                  <Controller
                    name="sellerType"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-label="Select seller type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="broker">Broker</SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input id="yearsOfExperience" placeholder="e.g., 5+, 10 years" {...register('yearsOfExperience')} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h3>
              <div className="space-y-2">
                <Label htmlFor="bio" className={errors.bio ? "text-destructive" : ""}>Bio</Label>
                <Textarea
                  id="bio"
                  className="min-h-[100px] resize-y"
                  placeholder="Tell buyers about your expertise..."
                  {...register('bio')}
                  aria-invalid={!!errors.bio}
                  aria-describedby={errors.bio ? "bio-error" : undefined}
                />
                {errors.bio && <p id="bio-error" className="text-[10px] text-destructive">{errors.bio.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Links</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className={errors.website ? "text-destructive" : ""}>Website</Label>
                  <Input
                    id="website"
                    placeholder="https://"
                    {...register('website')}
                    aria-invalid={!!errors.website}
                    aria-describedby={errors.website ? "website-error" : undefined}
                  />
                  {errors.website && <p id="website-error" className="text-[10px] text-destructive">{errors.website.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className={errors.linkedin ? "text-destructive" : ""}>LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    {...register('linkedin')}
                    aria-invalid={!!errors.linkedin}
                    aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
                  />
                  {errors.linkedin && <p id="linkedin-error" className="text-[10px] text-destructive">{errors.linkedin.message}</p>}
                </div>
              </div>
            </div>

          </form>
        </ScrollArea>

        <div className="p-6 pt-4 border-t flex items-center justify-end gap-3 bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
