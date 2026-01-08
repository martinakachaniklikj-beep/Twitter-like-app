'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import {
  LoginLabels,
  Container,
  ThemeToggleWrapper,
  CardWrapper,
  Card,
  Title,
  Subtitle,
  ErrorBox,
  Form,
  InputGroup,
  Label,
  Input,
  SubmitButton,
  Footer,
  FooterText,
  FooterLink,
} from './login.styles';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>();

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      await login(data.email, data.password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <Container>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>

      <CardWrapper>
        <Card>
          <Title>{LoginLabels.title}</Title>
          <Subtitle>{LoginLabels.subtitle}</Subtitle>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Label htmlFor="email">{LoginLabels.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={LoginLabels.emailPlaceholder}
                {...register('email', { required: true })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">{LoginLabels.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={LoginLabels.passwordPlaceholder}
                {...register('password', { required: true })}
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? LoginLabels.submittingButton : LoginLabels.submitButton}
            </SubmitButton>
          </Form>

          <Footer>
            <FooterText>{LoginLabels.noAccount}</FooterText>
            <FooterLink as={Link} href="/register">
              {LoginLabels.signUpLink}
            </FooterLink>
          </Footer>
        </Card>
      </CardWrapper>
    </Container>
  );
}
