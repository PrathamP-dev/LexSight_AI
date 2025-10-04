'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LegalMindLogo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="size-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Google</title>
    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.6 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c1.74 0 3.23.67 4.38 1.62l2.35-2.35C17.65 1.58 15.3.8 12.48.8 7.2.8 3.18 4.9 3.18 10.12s4.02 9.32 9.3 9.32c2.8 0 5.1-1 6.8-2.68 1.8-1.7 2.4-4.2 2.4-6.42 0-1.12-.12-2.2-.36-3.28H12.48z" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn('google', { callbackUrl: '/home' });
    } catch (error) {
      console.error('Google sign-up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: 'Failed to sign up with Google. Please try again.',
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Sign in the user
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Account created but sign-in failed. Please try signing in.');
      }

      toast({
        title: 'Account Created',
        description: 'Welcome to LegalMind!',
      });

      router.push('/home');
      router.refresh();
    } catch (error) {
      console.error('Sign-up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dark-veil"></div>
      <div className="relative flex min-h-screen w-full items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-sm shadow-xl border-2 border-primary/10 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center items-center gap-3 mb-2">
              <LegalMindLogo className="h-9 w-9 text-primary" />
              <CardTitle className="font-headline text-4xl">LegalMind</CardTitle>
            </Link>
            <CardDescription>Create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="w-full font-headline"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Sign up with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleEmailSignUp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-headline"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
