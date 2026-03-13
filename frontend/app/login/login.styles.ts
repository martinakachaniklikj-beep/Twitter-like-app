'use client';

import styled from "styled-components";

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: var(--background);
  color: var(--foreground);
`;

export const ThemeToggleWrapper = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 10;
`;

export const ContentContainer = styled.div`
  margin: 0 auto;
  display: flex;
  width: 100%;
  max-width: 72rem;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2.5rem 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const BrandingSection = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export const BrandingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

export const SubHeading = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--muted-foreground);
`;

export const AuthCardWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
`;
