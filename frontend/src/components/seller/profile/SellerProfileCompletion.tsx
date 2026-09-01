import { type SellerProfile } from '@/store/useSellerStore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SellerProfileCompletionProps {
  profile: SellerProfile;
}

export function SellerProfileCompletion({ profile }: SellerProfileCompletionProps) {
  const fields = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'companyName', label: 'Company' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'location', label: 'Location' },
    { key: 'bio', label: 'Bio' },
    { key: 'website', label: 'Website' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'yearsOfExperience', label: 'Experience' },
    { key: 'preferredCategories', label: 'Categories' },
    { key: 'preferredLocations', label: 'Locations' },
  ] as const;

  const filledFields = fields.filter((f) => {
    const val = profile[f.key];
    if (Array.isArray(val)) return val.length > 0;
    return val && typeof val === 'string' && val.trim() !== '';
  });

  const completionPercentage = Math.round((filledFields.length / fields.length) * 100);
  const isComplete = completionPercentage === 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Profile Completion
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isComplete
                ? 'Your profile is fully complete. Buyers can see all your details.'
                : 'Complete your profile to build trust with potential buyers.'}
            </p>
          </div>
          <span className="text-2xl font-bold">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2.5 mt-4 mb-4" />

        {!isComplete && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium mb-3">Missing information:</p>
            <div className="flex flex-wrap gap-2">
              {fields
                .filter((f) => !filledFields.includes(f))
                .map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {f.label}
                  </span>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
