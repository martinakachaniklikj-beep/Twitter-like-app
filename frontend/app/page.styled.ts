import styled from "styled-components";

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: rgb(var(--background));
  color: rgb(var(--foreground));
`;

export const TopRightControls = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SkipLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--muted-foreground));

  &:hover {
    color: rgb(var(--primary));
  }
`;

export const MainLayout = styled.main`
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

export const LogoSection = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

export const LogoWrapper = styled.div`
  display: inline-flex;
  height: 8rem;
  width: 8rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgb(var(--border));
  background: rgb(var(--card));

  @media (min-width: 768px) {
    height: 10rem;
    width: 10rem;
  }
`;

export const LogoInner = styled.div`
  transform: scale(1.25);
`;

export const HeroSection = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const HeroTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (min-width: 640px) {
    font-size: 3rem;
  }

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--muted-foreground));
`;

export const ActionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LoginText = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const LoginButton = styled.button`
  font-weight: 600;
  color: rgb(var(--primary));

  &:hover {
    text-decoration: underline;
  }
`;
