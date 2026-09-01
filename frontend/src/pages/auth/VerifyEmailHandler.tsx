import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { authService } from '@/services/auth.service';

export default function VerifyEmailHandler() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await authService.verifyEmailToken(token);
        setStatus('success');
        setMessage(res.message || 'Your email has been verified successfully.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired verification link.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <>
      <Seo title="Verify Email | InfyBuys" description="Verify your email address for InfyBuys" />

      <div className="flex flex-col items-center text-center">
        {status === 'loading' && (
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {status === 'success' && (
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        )}

        {status === 'error' && (
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        )}

        <AuthHeader
          title="Email Verification"
          description={
            status === 'loading' ? 'Verifying your email...' :
            status === 'success' ? 'Email verified successfully!' :
            'Verification failed'
          }
        />

        {status === 'error' && (
          <Alert variant="destructive" className="mb-6 text-left w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="mb-6 border-success bg-success/10 text-success text-left">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 w-full">
          <Button asChild className="w-full" size="lg">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
