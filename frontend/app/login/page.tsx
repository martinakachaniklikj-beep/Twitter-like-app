'use client';

import ThemeToggle from '@/components/Theme/ThemeToggle';
import { LoginDialogCard } from '@/components/auth/LoginDialogCard';

import {
  PageWrapper,
  ThemeToggleWrapper,
  ContentContainer,
  BrandingSection,
  BrandingText,
  Heading,
  SubHeading,
  AuthCardWrapper,
} from './login.styles';

export default function LoginPage() {
  return (
    <PageWrapper>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>

      <ContentContainer>
        <BrandingSection>
          <BrandingText>
            <Heading>Happening now</Heading>
            <SubHeading>
              Sign in to see what&apos;s happening on your timeline.
            </SubHeading>
          </BrandingText>
        </BrandingSection>

        <AuthCardWrapper>
          <LoginDialogCard />
        </AuthCardWrapper>
      </ContentContainer>
    </PageWrapper>
  );
}

