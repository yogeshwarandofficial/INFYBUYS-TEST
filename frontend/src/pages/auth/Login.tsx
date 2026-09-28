import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm as useHookForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { useGoogleLogin } from '@react-oauth/google';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserStore();

  const from = location.state?.from?.pathname || '/';
  const sessionExpired = location.state?.expired;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.login(data.email, data.password);
      setUser(res.user, res.token);
      // Backend is the gatekeeper: if login succeeded, the user is authorised.
      if (res.user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true, state: { justLoggedIn: true } });
      }
    } catch (err: any) {
      const message = err.message || err.response?.data?.message || '';
      if (message === 'Email not verified') {
        // Backend enforces verification — redirect to OTP page regardless of any frontend flag.
        navigate('/verify-email', { state: { email: data.email } });
      } else {
        setError(message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await authService.googleLogin(tokenResponse.access_token);
        setUser(res.user, res.token);
        // Google users are auto-verified by the backend (Google has verified their email).
        if (res.user.roles?.some((r: string) => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true, state: { justLoggedIn: true } });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google login was cancelled or failed');
    }
  });

  return (
    <div className="auth-form-single">
      <Seo title="Login | InfyBuys" description="Login to your InfyBuys account" />

      {/* Heading */}
      <h1 className="auth-form-title">Welcome back</h1>
      <p className="auth-form-subtitle">Enter your credentials to access your account</p>

      {/* Session expired alert */}
      {sessionExpired && (
        <Alert className="mb-5 border-warning bg-warning/10 text-warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      )}

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium hover:underline"
              style={{ color: '#2563EB' }}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={!!errors.password}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center space-x-2">
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>

        {/* Sign In */}
        <Button
          type="submit"
          className="auth-sign-in-btn"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <AuthDivider />

      {/* Google */}
      <SocialLoginButton
        provider="Google"
        disabled={isLoading}
        className="auth-google-btn"
        onClick={() => googleLogin()}
      />

      {/* Sign up */}
      <p className="mt-6 text-center text-sm" style={{ color: '#040031ff' }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: '#0051ffff' }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
