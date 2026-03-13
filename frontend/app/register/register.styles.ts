import styled from "styled-components";

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: rgb(var(--background));
  color: rgb(var(--foreground));
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

export const ImageSection = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ImagePlaceholder = styled.div`
  display: flex;
  height: 16rem;
  width: 100%;
  max-width: 28rem;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 1px dashed rgb(var(--border));
  background: rgba(var(--muted), 0.4);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--muted-foreground));
`;

export const AuthSection = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const HeadingBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Heading = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const SubHeading = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--muted-foreground));
`;
