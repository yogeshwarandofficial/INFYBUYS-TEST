import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OTPInputType } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';

export default function OTPVerification() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Register page via router state
  const email: string | undefined = location.state?.email;

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

  // Countdown timer for resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect to register if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = async (data: OTPInputType) => {
    if (!email) return;
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      await authService.verifyOTP(email, data.otp);
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true, state: { email } });
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid verification code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    try {
      setIsResending(true);
      setError(null);
      setSuccess(null);
      await authService.resendOTP(email);
      setSuccess('A new verification code has been sent to your email.');
      setCountdown(60);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to resend code. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <>
      <Seo title="Verify Email | InfyBuys" description="Verify your email address" />

      {/* Email icon */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
      </div>

      <AuthHeader
        title="Check your email"
        description={`We've sent a 6-digit verification code to`}
      />

      {/* Show the email prominently */}
      <p className="text-center font-semibold text-sm mb-6" style={{ color: '#2563EB' }}>
        {email}
      </p>

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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || otpValue.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-muted-foreground mb-2">Didn't receive a code?</p>
        <Button
          variant="link"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="p-0 h-auto"
        >
          {isResending
            ? 'Sending...'
            : countdown > 0
              ? `Resend code in ${countdown}s`
              : 'Resend code now'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/register"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Register
        </Link>
      </div>
    </>
  );
}
