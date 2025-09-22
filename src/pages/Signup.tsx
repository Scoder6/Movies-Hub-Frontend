import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Film, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/hooks/useAuth';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: case 1: return 'bg-destructive';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signup(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many requests')) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background/95 dark:bg-[radial-gradient(ellipse_at_center,var(--primary)/0.02,transparent_70%)]">
      <SEO
        title="Sign Up - MovieHub"
        description="Create an account to recommend movies, vote, and join the discussion."
        keywords="sign up, create account, movie community"
        url="https://moviehub.example.com/auth/signup"
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
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground/90">Create an account</h1>
          <p className="text-muted-foreground dark:text-muted-foreground/80">
            Enter your details to get started
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="text-center text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground dark:text-foreground/90">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              required
              {...register('name')}
              className={`focus-visible:ring-2 focus-visible:ring-primary/50 border-border/80 dark:bg-background/95 dark:border-border/60 dark:focus-visible:ring-primary/70 ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
                onChange={(e) => checkPasswordStrength(e.target.value)}
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
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Password strength:</span>
                <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor().replace('bg-', 'text-') }}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                  style={{ width: `${passwordStrength * 25}%` }}
                ></div>
              </div>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                <li className={watch('password')?.length >= 8 ? 'text-green-500' : ''}>At least 8 characters</li>
                <li className={/[A-Z]/.test(watch('password') || '') ? 'text-green-500' : ''}>At least 1 uppercase letter</li>
                <li className={/[0-9]/.test(watch('password') || '') ? 'text-green-500' : ''}>At least 1 number</li>
                <li className={/[^A-Za-z0-9]/.test(watch('password') || '') ? 'text-green-500' : ''}>At least 1 special character</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground dark:text-foreground/90">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`focus-visible:ring-2 focus-visible:ring-primary/50 border-border/80 dark:bg-background/95 dark:border-border/60 dark:focus-visible:ring-primary/70 ${errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground dark:text-muted-foreground/80">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:text-primary/80 hover:underline dark:text-primary/90 dark:hover:text-primary/70"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}