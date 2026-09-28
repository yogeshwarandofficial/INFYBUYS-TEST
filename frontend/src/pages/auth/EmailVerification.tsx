import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MailOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { Seo } from '@/components/shared/Seo';
import { authService } from '@/services/auth.service';

export default function EmailVerification() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const { status } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? null;

  // If already authenticated, redirect away
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await authService.resendVerificationEmail(email);
      setSuccess(res.message || 'Verification email has been resent successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No email address provided. Please register or login.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Seo title="Verify Email | InfyBuys" description="Verify your email address for InfyBuys" />

      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <MailOpen className="w-8 h-8 text-primary" />
        </div>

        <AuthHeader
          title="Verify your email"
          description={`We've sent a verification link to ${email}. Please check your inbox and click the link to verify your account.`}
        />

        {error && (
          <Alert variant="destructive" className="mb-6 text-left w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-success bg-success/10 text-success text-left">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 w-full">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </Button>

          <Button variant="ghost" className="w-full text-muted-foreground" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
