import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { useGoogleLogin } from '@react-oauth/google';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, ArrowRight, Handshake, Rocket } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import './UnifiedAuth.css';

export default function UnifiedAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  
  // Decide initial mode based on route
  const isRegisterRoute = location.pathname.includes('register');
  const [isSignUpMode, setIsSignUpMode] = useState(isRegisterRoute);

  useEffect(() => {
    setIsSignUpMode(location.pathname.includes('register'));
  }, [location.pathname]);

  const toggleMode = (mode: 'login' | 'register') => {
    setIsSignUpMode(mode === 'register');
    // We navigate to keep URL in sync
    navigate(`/${mode}`);
  };

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // --- LOGIN FORM ---
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useHookForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onLogin = async (data: LoginInput) => {
    try {
      setLoginLoading(true);
      setLoginError(null);
      const res = await authService.login(data.email, data.password);
      setUser(res.user, res.token);
      if (res.user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true, state: { justLoggedIn: true } });
      }
    } catch (err: any) {
      const message = err.message || err.response?.data?.message || '';
      if (message === 'Email not verified') {
        navigate('/verify-email', { state: { email: data.email } });
      } else {
        setLoginError(message || 'An error occurred during login');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // --- REGISTER FORM ---
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    watch: watchSignup,
    formState: { errors: registerErrors },
  } = useHookForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const passwordValue = watchSignup('password');

  const onRegister = async (data: RegisterInput) => {
    try {
      setRegisterLoading(true);
      setRegisterError(null);
      await authService.register(data);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err: any) {
      setRegisterError(err.message || 'An error occurred during registration');
    } finally {
      setRegisterLoading(false);
    }
  };

  // --- GOOGLE LOGIN ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoginLoading(true);
        setRegisterLoading(true);
        const res = await authService.googleLogin(tokenResponse.access_token);
        setUser(res.user, res.token);
        if (res.user.roles?.some((r: string) => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true, state: { justLoggedIn: true } });
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Google login failed';
        setLoginError(errorMsg);
        setRegisterError(errorMsg);
      } finally {
        setLoginLoading(false);
        setRegisterLoading(false);
      }
    },
    onError: () => {
      setLoginError('Google login was cancelled or failed');
      setRegisterError('Google login was cancelled or failed');
    }
  });

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  return (
    <div className={`unified-auth-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <Seo title={isSignUpMode ? "Create Account | InfyBuys" : "Login | InfyBuys"} />
      
      <div className="forms-container">
        <div className="signin-signup-grid max-w-md mx-auto w-full">
          
          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit(onLogin)} className="auth-form sign-in-form w-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#1a202c] tracking-tight mb-1">InfyBuys</h1>
              <p className="text-xs text-[#0f44ff] font-bold uppercase tracking-wider mb-6">Acquire. Scale. Succeed.</p>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your account</p>
            </div>

            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                <input type="email" placeholder="name@company.com" {...registerLogin('email')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition" />
                {loginErrors.email && <p className="text-xs text-red-500 mt-1">{loginErrors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="text-xs font-medium text-[#0f44ff] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input type={showLoginPassword ? "text" : "password"} placeholder="••••••••" {...registerLogin('password')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition pr-10" />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && <p className="text-xs text-red-500 mt-1">{loginErrors.password.message}</p>}
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="remember" {...registerLogin('rememberMe')} className="h-4 w-4 text-[#0f44ff] focus:ring-[#0f44ff] border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember" className="ml-2 block text-xs text-gray-600 cursor-pointer">Remember me</label>
              </div>

              <button type="submit" disabled={loginLoading} className="w-full bg-[#0f44ff] hover:bg-[#0a35cc] text-white font-medium py-3 rounded-lg text-sm transition mt-4 flex justify-center items-center gap-2 shadow-md shadow-blue-500/30">
                {loginLoading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-100" />
              <span className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">OR CONTINUE WITH</span>
              <hr className="flex-grow border-gray-100" />
            </div>

            <button type="button" onClick={() => googleLogin()} disabled={loginLoading} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition flex justify-center items-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <p className="md:hidden text-center text-xs text-gray-500 mt-8">
              Don't have an account? <button type="button" onClick={() => toggleMode('register')} className="text-[#0f44ff] font-semibold hover:underline">Sign up</button>
            </p>
          </form>

          {/* SIGN UP FORM */}
          <form onSubmit={handleSignupSubmit(onRegister)} className="auth-form sign-up-form w-full flex flex-col justify-center max-h-screen overflow-y-auto pb-8">
            <div className="text-center mb-6 pt-8 md:pt-0">
              <h1 className="text-2xl font-extrabold text-[#1a202c] tracking-tight mb-1">InfyBuys</h1>
              <h2 className="text-xl font-bold text-gray-900 mt-4">Create an account</h2>
              <p className="text-sm text-gray-500 mt-1">Join thousands of founders</p>
            </div>

            {registerError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" {...registerSignup('name')} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition" />
                {registerErrors.name && <p className="text-xs text-red-500 mt-1">{registerErrors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                <input type="email" placeholder="name@company.com" {...registerSignup('email')} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition" />
                {registerErrors.email && <p className="text-xs text-red-500 mt-1">{registerErrors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" {...registerSignup('phone')} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition" />
                {registerErrors.phone && <p className="text-xs text-red-500 mt-1">{registerErrors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showRegisterPassword ? "text" : "password"} placeholder="Create a strong password" {...registerSignup('password')} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition pr-10" />
                  <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordValue && <div className="mt-1.5"><PasswordStrength password={passwordValue} /></div>}
                {registerErrors.password && <p className="text-xs text-red-500 mt-1">{registerErrors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input type={showRegisterConfirm ? "text" : "password"} placeholder="Confirm your password" {...registerSignup('confirmPassword')} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0f44ff] focus:ring-1 focus:ring-[#0f44ff] transition pr-10" />
                  <button type="button" onClick={() => setShowRegisterConfirm(!showRegisterConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showRegisterConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{registerErrors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start mt-2">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="terms" {...registerSignup('termsAccepted')} className="h-4 w-4 text-[#0f44ff] focus:ring-[#0f44ff] border-gray-300 rounded cursor-pointer" />
                </div>
                <label htmlFor="terms" className="ml-2 block text-[11px] text-gray-600 leading-tight cursor-pointer">
                  I agree to the <Link to="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="text-[#0f44ff] hover:underline">Terms of Service</Link> and <Link to="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="text-[#0f44ff] hover:underline">Privacy Policy</Link>.
                </label>
              </div>
              {registerErrors.termsAccepted && <p className="text-xs text-red-500 mt-1">{registerErrors.termsAccepted.message}</p>}

              <button type="submit" disabled={registerLoading} className="w-full bg-[#0f44ff] hover:bg-[#0a35cc] text-white font-medium py-3 rounded-lg text-sm transition mt-3 flex justify-center items-center gap-2 shadow-md shadow-blue-500/30">
                {registerLoading ? 'Creating Account...' : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-100" />
              <span className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">OR CONTINUE WITH</span>
              <hr className="flex-grow border-gray-100" />
            </div>

            <button type="button" onClick={() => googleLogin()} disabled={registerLoading} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm transition flex justify-center items-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <p className="md:hidden text-center text-xs text-gray-500 mt-6">
              Already have an account? <button type="button" onClick={() => toggleMode('login')} className="text-[#0f44ff] font-semibold hover:underline">Log in</button>
            </p>
          </form>

        </div>
      </div>

      {/* PANELS SECTION */}
      <div className="panels-container">
        <div className="panels-inner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')" }}>
          
          <div className="panel left-panel">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl max-w-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight text-white">One of us?</h3>
              <p className="text-sm text-blue-100 mb-8 leading-relaxed">
                Welcome back! If you already have an InfyBuys account, sign in to continue acquiring and scaling your business.
              </p>
              <button onClick={() => toggleMode('login')} className="px-10 py-3 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-[#0f44ff] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5">
                Sign In to Account
              </button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl max-w-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight text-white">New to InfyBuys?</h3>
              <p className="text-sm text-blue-100 mb-8 leading-relaxed">
                Join our network of elite founders. Create an account today to discover exclusive business opportunities and scale to success.
              </p>
              <button onClick={() => toggleMode('register')} className="px-10 py-3 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-[#0f44ff] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5">
                Create Account
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
