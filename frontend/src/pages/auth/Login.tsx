import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm as useHookForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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

      if (!res.user.verified && import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === 'true') {
        navigate('/verify-email');
      } else {
        if (res.user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
          navigate('/admin', { replace: true });
        } else if (res.user.roles?.some(r => r.toLowerCase() === 'seller')) {
          navigate(from === '/' ? '/seller' : from, { replace: true });
        } else {
          navigate(from === '/' ? '/buyer' : from, { replace: true });
        }
      }
    } catch (err: any) {
      if (
        (err.message === 'Email not verified' || err.response?.data?.message === 'Email not verified') &&
        import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === 'true'
      ) {
        localStorage.setItem('verificationEmail', data.email);
        navigate('/verify-email', { state: { email: data.email } });
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo title="Login | InfyBuys" description="Login to your InfyBuys account" />

      <AuthHeader
        title="Welcome back"
        description="Enter your credentials to access your account"
      />

      {sessionExpired && (
        <Alert className="mb-6 border-warning bg-warning/10 text-warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            placeholder="name@company.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
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
          <Label htmlFor="rememberMe" className="text-sm font-normal">Remember me</Label>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButton provider="Google" disabled={isLoading} />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
