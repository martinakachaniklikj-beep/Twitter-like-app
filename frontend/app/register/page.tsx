'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import {
  RegisterLabels,
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
} from './register.styles';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [error, setError] = useState('');
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const password = watch('password');

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
      await registerUser(data.email, data.username, data.password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <Container>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>

      <CardWrapper>
        <Card>
          <Title>{RegisterLabels.title}</Title>
          <Subtitle>{RegisterLabels.subtitle}</Subtitle>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Label htmlFor="username">{RegisterLabels.usernameLabel}</Label>
              <Input
                id="username"
                type="text"
                placeholder={RegisterLabels.usernamePlaceholder}
                {...registerField('username', { required: true })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">{RegisterLabels.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={RegisterLabels.emailPlaceholder}
                {...registerField('email', { required: true })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">{RegisterLabels.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={RegisterLabels.passwordPlaceholder}
                {...registerField('password', { required: true, minLength: 6 })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">{RegisterLabels.confirmPasswordLabel}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={RegisterLabels.confirmPasswordPlaceholder}
                {...registerField('confirmPassword', { required: true })}
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? RegisterLabels.submittingButton : RegisterLabels.submitButton}
            </SubmitButton>
          </Form>

          <Footer>
            <FooterText>{RegisterLabels.haveAccount}</FooterText>
            <FooterLink as={Link} href="/login">
              {RegisterLabels.signInLink}
            </FooterLink>
          </Footer>
        </Card>
      </CardWrapper>
    </Container>
  );
}
