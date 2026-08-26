import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OTPInputType } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';

export default function OTPVerification() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useHookForm<OTPInputType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    }
  });

  const otpValue = watch('otp');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: OTPInputType) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      await authService.verifyOTP(data.otp);
      setSuccess('Verification successful! Redirecting...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setError(null);
    setSuccess('A new verification code has been sent.');
    setCountdown(60);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <>
      <Seo title="Verification | InfyBuys" description="Verify your account" />

      <AuthHeader
        title="Two-Step Verification"
        description="We sent a 6-digit verification code to your device."
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-success bg-success/10 text-success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 text-center">
          <OTPInput
            value={otpValue}
            onChange={(val) => setValue('otp', val)}
            error={!!errors.otp}
          />
          {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading || otpValue.length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-muted-foreground mb-2">Didn't receive a code?</p>
        <Button
          variant="link"
          onClick={handleResend}
          disabled={countdown > 0}
          className="p-0 h-auto"
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code now'}
        </Button>
      </div>
    </>
  );
}
