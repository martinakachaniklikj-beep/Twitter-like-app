'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
} from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RegisterFormData, RegisterDialogCardProps } from './types';

export function RegisterDialogCard({ onSuccess }: RegisterDialogCardProps) {
  const [error, setError] = useState('');
  const {
    register: registerField,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();

  const { register: registerUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setError('');

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await registerUser(data.email, data.password, data.username);
      onSuccess?.();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <Card className="w-full border border-border bg-white shadow-2xl dark:bg-zinc-900">
      <CardHeader>
        <CardTitle>Create your profile</CardTitle>
        <CardDescription>
          Sign up in just a few steps to start posting.
        </CardDescription>
        {error && (
          <p className="mt-2 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldContent>
                <FieldTitle>Username</FieldTitle>
                <FieldDescription>
                  This is how others will see you on X.
                </FieldDescription>
                <Input
                  id="username"
                  type="text"
                  placeholder="your_handle"
                  autoComplete="username"
                  {...registerField('username', { required: true })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldTitle>Email</FieldTitle>
                <FieldDescription>
                  We&apos;ll send confirmations and updates here.
                </FieldDescription>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...registerField('email', { required: true })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldTitle>Password</FieldTitle>
                <FieldDescription>Use at least 6 characters.</FieldDescription>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...registerField('password', {
                    required: true,
                    minLength: 6,
                  })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldTitle>Confirm password</FieldTitle>
                <FieldDescription>
                  Re-enter your password to confirm.
                </FieldDescription>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...registerField('confirmPassword', { required: true })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldError errors={error ? [{ message: error }] : []} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full rounded-full text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating profile…' : 'Create profile'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center space-x-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

