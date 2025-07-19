'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { LogIn, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = useSupabaseClient();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Successful signup
      setIsSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      }
      // Note: If successful, user will be redirected to Google and then back to the app
    } catch (err) {
      setError('An error occurred during Google signup');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background py-8 text-foreground md:py-16">
        <Container>
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center md:min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                  We&apos;ve sent a confirmation link to{' '}
                  <span className="font-medium">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium">Next steps:</p>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
                    <li>Check your email inbox</li>
                    <li>Click the confirmation link</li>
                    <li>Return here to sign in</li>
                  </ol>
                </div>
                <div className="text-center text-sm">
                  Already confirmed?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 text-foreground md:py-16">
      <Container>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center md:min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Join the community and start sharing your AI video art
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive" role="alert">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email || !password || !username}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign Up with Google
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}