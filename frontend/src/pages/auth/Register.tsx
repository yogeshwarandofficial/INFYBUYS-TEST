import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm as useHookForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { useGoogleLogin } from '@react-oauth/google';

import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useHookForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(data);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError(null);
        // Send access token to backend via authService
        const res = await authService.googleLogin(tokenResponse.access_token);
        setUser(res.user, res.token);
        // Google users are auto-verified by the backend (Google has verified their email).
        if (res.user.roles?.some((r: string) => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true, state: { justLoggedIn: true } });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Google signup failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google signup was cancelled or failed');
    }
  });

  return (
    <div className="auth-form-single">
      <Seo title="Create Account | InfyBuys" description="Sign up for InfyBuys" />

      {/* Heading */}
      <h1 className="auth-form-title">Create an account</h1>
      <p className="auth-form-subtitle">Join thousands of founders on InfyBuys</p>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

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

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            {...register('password')}
            error={!!errors.password}
          />
          <PasswordStrength password={passwordValue} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms & Privacy */}
        <div className="flex items-start space-x-2 pt-1 pb-1">
          <Controller
            name="termsAccepted"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                id="termsAccepted"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <div className="grid gap-1 leading-none">
            <Label
              htmlFor="termsAccepted"
              className="text-sm font-normal leading-snug cursor-pointer"
              style={{ color: '#64748B' }}
            >
              I agree to the{' '}
              <Link to="/terms" className="hover:underline" style={{ color: '#2563EB' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="hover:underline" style={{ color: '#2563EB' }}>
                Privacy Policy
              </Link>
              .
            </Label>
            {errors.termsAccepted && (
              <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
            )}
          </div>
        </div>

        {/* Create Account button */}
        <Button
          type="submit"
          className="auth-sign-in-btn"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : (
            <>
              Create Account
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

      {/* Log in link */}
      <p className="mt-6 text-center text-sm" style={{ color: '#040031ff' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{ color: '#2563EB' }}
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
