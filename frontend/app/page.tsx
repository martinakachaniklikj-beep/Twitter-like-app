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
import SeasonalLogo from '@/components/SeasonalLogo/SeasonalLogo';

import {
  PageWrapper,
  TopRightControls,
  SkipLink,
  MainLayout,
  LogoSection,
  LogoWrapper,
  LogoInner,
  HeroSection,
  HeroTextBlock,
  HeroTitle,
  HeroSubtitle,
  ActionsBlock,
  LoginText,
  LoginButton
} from './page.styled';

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
    <PageWrapper>
      <TopRightControls>
        <ThemeToggle />

        {!isAuthenticated && (
          <Link href="/home" passHref>
            <SkipLink>Skip for now</SkipLink>
          </Link>
        )}
      </TopRightControls>

      <MainLayout>
        <LogoSection>
          <LogoWrapper>
            <LogoInner>
              <SeasonalLogo />
            </LogoInner>
          </LogoWrapper>
        </LogoSection>

        <HeroSection>
          <HeroTextBlock>
            <HeroTitle>Happening now</HeroTitle>

            <HeroSubtitle>
              Join X today and see what people are talking about.
            </HeroSubtitle>
          </HeroTextBlock>

          <ActionsBlock>
            <Button
              className="w-full rounded-full text-base font-semibold"
              size="lg"
              onClick={() => handleOpen('register')}
            >
              Create account
            </Button>

            <LoginText>
              Already have an account?{' '}
              <LoginButton onClick={() => handleOpen('login')}>
                Sign in
              </LoginButton>
            </LoginText>
          </ActionsBlock>
        </HeroSection>
      </MainLayout>

      <Dialog
        open={openDialog === 'register'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <DialogContent className="border border-border bg-background p-0 shadow-2xl ring-2 ring-foreground/10 sm:max-w-xl">
          <DialogTitle className="sr-only">Create your profile</DialogTitle>
          <RegisterDialogCard onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'login'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <DialogContent className="border border-border bg-background p-0 shadow-2xl ring-2 ring-foreground/10 sm:max-w-xl">
          <DialogTitle className="sr-only">Sign in</DialogTitle>
          <LoginDialogCard onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
