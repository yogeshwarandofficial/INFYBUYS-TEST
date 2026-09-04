import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';

export function ProfileCompletion() {
  const { data: profile } = useBuyerProfile();

  if (!profile) return null;

  const calculateCompletion = () => {
    let score = 0;
    const totalFields = 8;

    if (profile.fullName) score += 1;
    if (profile.email) score += 1;
    if (profile.phone) score += 1;
    if (profile.avatarUrl) score += 1;
    if (profile.company) score += 1;
    if (profile.location) score += 1;
    if (profile.bio) score += 1;
    if (profile.linkedin || profile.website) score += 1;

    return Math.round((score / totalFields) * 100);
  };

  const completion = calculateCompletion();

  const steps = [
    { label: 'Basic Information', done: !!profile.fullName && !!profile.email },
    { label: 'Professional Details', done: !!profile.company && !!profile.jobTitle },
    { label: 'Profile Picture', done: !!profile.avatarUrl },
    { label: 'Bio & Links', done: !!profile.bio && (!!profile.linkedin || !!profile.website) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Profile Completion</span>
          <span className="text-primary font-bold">{completion}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={completion} className="h-2" />

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
