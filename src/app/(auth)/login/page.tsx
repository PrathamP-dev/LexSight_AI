'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LegalMindLogo } from '@/components/icons';

const GoogleIcon = () => (
  <svg className="size-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Google</title>
    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.6 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c1.74 0 3.23.67 4.38 1.62l2.35-2.35C17.65 1.58 15.3.8 12.48.8 7.2.8 3.18 4.9 3.18 10.12s4.02 9.32 9.3 9.32c2.8 0 5.1-1 6.8-2.68 1.8-1.7 2.4-4.2 2.4-6.42 0-1.12-.12-2.2-.36-3.28H12.48z" />
  </svg>
);

export default function LoginPage() {
  return (
    <>
      <div className="dark-veil"></div>
      <div className="relative flex min-h-screen w-full items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-sm shadow-xl border-2 border-primary/10 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center items-center gap-3 mb-2">
              <LegalMindLogo className="h-9 w-9 text-primary" />
              <CardTitle className="font-headline text-4xl">LegalMind AI</CardTitle>
            </Link>
            <CardDescription>AI-Powered Document Analysis for Legal Professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link href="/home" className="w-full">
                <Button variant="outline" className="w-full font-headline">
                  <GoogleIcon />
                  Login with Google
                </Button>
              </Link>
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Link href="/home" className="w-full">
                  <Button className="w-full font-headline">
                      Log In
                  </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
