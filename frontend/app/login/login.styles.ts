import styled from 'styled-components';

export const LoginLabels = {
  title: 'Welcome Back',
  subtitle: 'Sign in to your account',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  submitButton: 'Sign In',
  submittingButton: 'Signing in...',
  noAccount: "Don't have an account? ",
  signUpLink: 'Sign up',
} as const;

export const Container = styled.div`
  min-height: 100vh;
  background: rgb(var(--background));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

export const ThemeToggleWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

export const CardWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
`;

export const Card = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  color: rgb(var(--foreground));
`;

export const Subtitle = styled.p`
  text-align: center;
  color: rgb(var(--muted-foreground));
  margin-bottom: 1.5rem;
`;

export const ErrorBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgb(220, 38, 38);
  border-radius: 0.5rem;
  font-size: 0.875rem;

  .dark & {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.8);
    color: rgb(252, 165, 165);
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--foreground));
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--input));
  border-radius: 0.5rem;
  color: rgb(var(--foreground));
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(var(--primary));
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
`;

export const FooterText = styled.span`
  color: rgb(var(--muted-foreground));
`;

export const FooterLink = styled.a`
  color: rgb(var(--primary));
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;
