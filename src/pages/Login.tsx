import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Film, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many requests')) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background/95 dark:bg-[radial-gradient(ellipse_at_center,var(--primary)/0.02,transparent_70%)]">
      <SEO
        title="Log In - MovieHub"
        description="Sign in to your MovieHub account to continue recommending and voting on movies."
        keywords="login, sign in, movie community"
        url="https://moviehub.example.com/auth/login"
      />
      <div className="w-full max-w-md p-8 space-y-8 bg-card dark:bg-background rounded-xl border border-border/50 dark:border-border/70 shadow-2xl dark:shadow-none">
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="relative">
              <Film className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform dark:text-primary/90" />
              <div className="absolute -inset-2 bg-gradient-primary rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity dark:bg-primary/30" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:bg-gradient-secondary transition-all dark:bg-primary/90">
              MovieHub
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground/90">Welcome back</h1>
          <p className="text-muted-foreground dark:text-muted-foreground/80">
            Enter your credentials to login
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="text-center text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground dark:text-foreground/90">Email</Label>
            <Input
              id="email"
              placeholder="email@example.com"
              required
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`focus-visible:ring-2 focus-visible:ring-primary/50 border-border/80 dark:bg-background/95 dark:border-border/60 dark:focus-visible:ring-primary/70 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground dark:text-foreground/90">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`focus-visible:ring-2 focus-visible:ring-primary/50 border-border/80 dark:bg-background/95 dark:border-border/60 dark:focus-visible:ring-primary/70 ${errors.password ? 'border-destructive pr-10' : 'pr-10'}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground dark:text-muted-foreground/80">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="font-medium text-primary hover:text-primary/80 hover:underline dark:text-primary/90 dark:hover:text-primary/70"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}