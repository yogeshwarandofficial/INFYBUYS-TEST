import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBuyerStore, type BuyerProfile } from '@/store/useBuyerStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is too short').max(20, 'Phone number is too long').optional().or(z.literal('')),
  company: z.string().min(2, 'Company is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  location: z.string().min(2, 'Location is required'),
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
  const { profile, updateProfile } = useBuyerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (open) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        bio: profile.bio || '',
        buyerType: profile.buyerType || 'Corporate',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
      });
    }
  }, [open, profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      updateProfile(data as Partial<BuyerProfile>);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 600);
  };

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
