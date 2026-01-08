'use client';

import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import Link from 'next/link';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Twitter
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated && (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user?.username}!</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Twitter</h1>
            <p className="text-muted-foreground mb-6">
              A modern Twitter-like application built with Next.js and NestJS
            </p>

            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors font-semibold"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
