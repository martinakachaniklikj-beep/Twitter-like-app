'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RegisterDialogCard } from '@/components/auth/RegisterDialogCard';
import { LoginDialogCard } from '@/components/auth/LoginDialogCard';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<'login' | 'register' | null>(null);

  const handleOpen = (type: 'login' | 'register') => {
    if (isAuthenticated) {
      router.push('/home');
      return;
    }
    setOpenDialog(type);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="absolute right-6 top-6 z-10 flex items-center gap-4">
        <ThemeToggle />
        {!isAuthenticated && (
          <Link
            href="/home"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Skip for now
          </Link>
        )}
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-12 px-6 py-10 md:flex-row">
        {/* Left – big X logo */}
        <div className="flex w-full flex-1 justify-center md:justify-start">
          <div className="inline-flex h-32 w-32 items-center justify-center rounded-full border border-border bg-card text-6xl font-black md:h-40 md:w-40 md:text-7xl">
            X
          </div>
        </div>

        {/* Right – hero copy and actions */}
        <div className="w-full max-w-md space-y-8 text-left md:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Happening now
            </h1>
            <p className="text-xl font-semibold text-muted-foreground">
              Join X today and see what people are talking about.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full rounded-full text-base font-semibold"
              size="lg"
              onClick={() => handleOpen('register')}
            >
              Create account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => handleOpen('login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>

      <Dialog
        open={openDialog === 'register'}
        onOpenChange={(open) => {
          if (!open) setOpenDialog(null);
        }}
      >
        <DialogContent className="border border-border bg-background p-0 shadow-2xl ring-2 ring-foreground/10 sm:max-w-xl">
          <DialogTitle className="sr-only">Create your profile</DialogTitle>
          <RegisterDialogCard onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'login'}
        onOpenChange={(open) => {
          if (!open) setOpenDialog(null);
        }}
      >
        <DialogContent className="border border-border bg-background p-0 shadow-2xl ring-2 ring-foreground/10 sm:max-w-xl">
          <DialogTitle className="sr-only">Sign in to X</DialogTitle>
          <LoginDialogCard onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
