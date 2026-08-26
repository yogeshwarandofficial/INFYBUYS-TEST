import { useMemo } from 'react';

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return score;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  }, [password]);

  const getStrengthColor = (index: number) => {
    if (index >= strength) return 'bg-muted';
    if (strength <= 1) return 'bg-destructive';
    if (strength === 2) return 'bg-warning';
    if (strength === 3) return 'bg-info';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${getStrengthColor(index)}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-right">{getStrengthText()}</p>
    </div>
  );
}
