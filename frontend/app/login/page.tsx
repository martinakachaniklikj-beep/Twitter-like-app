'use client';

import ThemeToggle from '@/components/Theme/ThemeToggle';
import { LoginDialogCard } from '@/components/auth/LoginDialogCard';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-12 px-6 py-10 md:flex-row">
        {/* Left side – X branding */}
        <div className="flex w-full flex-1 flex-col items-start gap-8 md:items-start">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-3xl font-black">
            X
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Happening now
            </h1>
            <p className="text-xl font-semibold text-muted-foreground">
              Sign in to see what&apos;s happening on your timeline.
            </p>
          </div>
        </div>

        {/* Right side – auth card */}
        <div className="w-full max-w-md">
          <LoginDialogCard />
        </div>
      </div>
    </div>
  );
}
