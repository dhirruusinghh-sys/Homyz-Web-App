import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset, googleLogin } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success('Logged in successfully!');
      if (user.role === 'admin') {
        navigate('/dashboard/admin/dashboard');
      } else if (user.role === 'agent') {
        navigate('/dashboard/agent/dashboard');
      } else {
        navigate('/dashboard/customer/dashboard');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: LoginFormValues) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* ── Left Side (Image) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-end p-12 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" 
          alt="Modern Home" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Link to="/" className="text-4xl font-extrabold text-white tracking-tight mb-6 block">
            Homyz<span className="text-primary">.</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Discover Your <br /> Dream Property Today
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Sign in to access your saved homes, manage your listings, and connect with top real estate agents in your area.
          </p>
        </div>
      </div>

      {/* ── Right Side (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center relative p-6 sm:p-12">
        {/* Cancel Button */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full transition-all shadow-sm flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm pr-1">Cancel</span>
        </button>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              New to Homyz?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                Create a free account
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in to account'}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              <button
                type="button"
                onClick={() => {
                  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
                  const payload = btoa(JSON.stringify({
                    sub: "101010101010",
                    email: "demouser@gmail.com",
                    name: "Demo User",
                    picture: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff"
                  }));
                  const fakeToken = `${header}.${payload}.signature`;
                  dispatch(googleLogin(fakeToken));
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => dispatch(login({ email: 'admin@homyz.com', password: 'password123' }))}
                  className="w-full flex items-center justify-center py-2.5 border border-purple-200 text-xs font-semibold rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(login({ email: 'sarah@homyz.com', password: 'password123' }))}
                  className="w-full flex items-center justify-center py-2.5 border border-green-200 text-xs font-semibold rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-all"
                >
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(login({ email: 'john@example.com', password: 'password123' }))}
                  className="w-full flex items-center justify-center py-2.5 border border-orange-200 text-xs font-semibold rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all"
                >
                  Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
