'use client';

import ThemeToggle from '@/components/Theme/ThemeToggle';
import { RegisterDialogCard } from '@/components/auth/RegisterDialogCard';

import {
  PageWrapper,
  ThemeToggleWrapper,
  ContentContainer,
  ImageSection,
  ImagePlaceholder,
  AuthSection,
  HeadingBlock,
  Heading,
  SubHeading,
} from './register.styles';
import { RegisterLabels } from './types/types';

export default function RegisterPage() {
  return (
    <PageWrapper>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>

      <ContentContainer>
        {/* Left side – image placeholder */}
        <ImageSection>
          <ImagePlaceholder>{RegisterLabels.imagePlaceholder}</ImagePlaceholder>
        </ImageSection>

        {/* Right side – heading + auth card */}
        <AuthSection>
          <HeadingBlock>
            <Heading>{RegisterLabels.title}</Heading>
            <SubHeading>{RegisterLabels.subtitle2}</SubHeading>
          </HeadingBlock>

          <RegisterDialogCard />
        </AuthSection>
      </ContentContainer>
    </PageWrapper>
  );
}
