'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blockServices, type BlockedUser } from '@/services/blockServices';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import {
  ButtonRow,
  Card,
  Container,
  Form,
  Input,
  InputGroup,
  Label,
  Message,
  ThemeOptionsGrid,
  ThemeOptionCard,
  ThemeOptionDescription,
  ThemeOptionName,
  ThemeSwatch,
  ThemeSwatchRow,
  PrimaryButton,
  SecondaryButton,
  TabsHeader,
  TabList,
  TabButton,
  Title,
} from './SettingsTab.styles';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

interface BirthDateFormValues {
  birthDate: string;
}

interface ProfileFormValues {
  displayName: string;
  bio: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function SettingsTab() {
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const { theme, setTheme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'themes'>('profile');

  const [birthDateMessage, setBirthDateMessage] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const {
    data: blockedUsers = [],
    isLoading: blockedLoading,
    isError: blockedError,
  } = useQuery<BlockedUser[]>({
    queryKey: ['blocked-users'],
    queryFn: async () => {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        throw new Error('Not authenticated');
      }
      return blockServices.fetchBlockedUsers(idToken);
    },
    enabled: !!user && activeTab === 'security',
  });

  const unblockMutation = useMutation({
    mutationFn: async (blockedUserId: string) => {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        throw new Error('Not authenticated');
      }
      await blockServices.unblockUser(idToken, blockedUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
    },
  });

  const {
    register: registerBirthDate,
    handleSubmit: handleSubmitBirthDate,
    reset: resetBirthDate,
    formState: { isSubmitting: isSubmittingBirthDate },
  } = useForm<BirthDateFormValues>({
    defaultValues: {
      birthDate: profile?.birthDate ? new Date(profile.birthDate).toISOString().slice(0, 10) : '',
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: profile?.displayName ?? '',
      bio: profile?.bio ?? '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmitBirthDate = async (values: BirthDateFormValues) => {
    setBirthDateMessage(null);
    setBirthDateError(null);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();
      const payload: { birthDate?: string | null } = {};

      if (values.birthDate) {
        payload.birthDate = new Date(values.birthDate).toISOString();
      } else {
        payload.birthDate = null;
      }

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update date of birth');
      }

      await refreshProfile();

      setBirthDateMessage('Date of birth updated successfully.');
    } catch (error: any) {
      setBirthDateError(error?.message ?? 'Failed to update date of birth.');
    }
  };

  const onSubmitProfile = async (values: ProfileFormValues) => {
    setProfileMessage(null);
    setProfileError(null);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: values.displayName,
          bio: values.bio,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await refreshProfile();
      setProfileMessage('Profile information updated successfully.');
    } catch (error: any) {
      setProfileError(error?.message ?? 'Failed to update profile.');
    }
  };

  const onSubmitPassword = async (values: PasswordFormValues) => {
    setPasswordMessage(null);
    setPasswordError(null);

    if (values.newPassword !== values.confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        throw new Error('Not authenticated');
      }

      const credential = EmailAuthProvider.credential(currentUser.email, values.currentPassword);

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, values.newPassword);

      resetPassword();
      setPasswordMessage('Password updated successfully.');
    } catch (error: any) {
      const message =
        error?.code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : (error?.message ?? 'Failed to update password.');
      setPasswordError(message);
    }
  };

  return (
    <Container>
      <TabsHeader>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, security and app appearance.
          </p>
        </div>
        <TabList>
          <TabButton
            type="button"
            $active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </TabButton>
          <TabButton
            type="button"
            $active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            Security
          </TabButton>
          <TabButton
            type="button"
            $active={activeTab === 'themes'}
            onClick={() => setActiveTab('themes')}
          >
            Themes
          </TabButton>
        </TabList>
      </TabsHeader>

      {activeTab === 'profile' && (
        <Card>
          <Title>Profile details</Title>

          <Form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <InputGroup>
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" type="text" {...registerProfile('displayName')} />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" type="text" {...registerProfile('bio')} />
            </InputGroup>

            <ButtonRow>
              <PrimaryButton type="submit" disabled={isSubmittingProfile}>
                Save
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => {
                  resetProfile({
                    displayName: profile?.displayName ?? '',
                    bio: profile?.bio ?? '',
                  });
                  setProfileMessage(null);
                  setProfileError(null);
                }}
              >
                Reset
              </SecondaryButton>
            </ButtonRow>

            {profileMessage && <Message $variant="success">{profileMessage}</Message>}
            {profileError && <Message $variant="error">{profileError}</Message>}
          </Form>

          <hr className="border-border/60" />

          <Form onSubmit={handleSubmitBirthDate(onSubmitBirthDate)}>
            <InputGroup>
              <Label htmlFor="birthDate">Date of birth</Label>
              <Input id="birthDate" type="date" {...registerBirthDate('birthDate')} />
            </InputGroup>

            <ButtonRow>
              <PrimaryButton type="submit" disabled={isSubmittingBirthDate}>
                Save
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => {
                  resetBirthDate({
                    birthDate: profile?.birthDate
                      ? new Date(profile.birthDate).toISOString().slice(0, 10)
                      : '',
                  });
                  setBirthDateMessage(null);
                  setBirthDateError(null);
                }}
              >
                Reset
              </SecondaryButton>
            </ButtonRow>

            {birthDateMessage && <Message $variant="success">{birthDateMessage}</Message>}
            {birthDateError && <Message $variant="error">{birthDateError}</Message>}
          </Form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <Title>Security</Title>

          <Form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <InputGroup>
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...registerPassword('currentPassword', { required: true })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...registerPassword('newPassword', { required: true })}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                {...registerPassword('confirmNewPassword', { required: true })}
              />
            </InputGroup>

            <ButtonRow>
              <PrimaryButton type="submit" disabled={isSubmittingPassword}>
                Change password
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => {
                  resetPassword();
                  setPasswordMessage(null);
                  setPasswordError(null);
                }}
              >
                Clear
              </SecondaryButton>
            </ButtonRow>

            {passwordMessage && <Message $variant="success">{passwordMessage}</Message>}
            {passwordError && <Message $variant="error">{passwordError}</Message>}
          </Form>

          <hr className="border-border/60" />

          <div>
            <h3 className="text-sm font-semibold text-foreground">Blocked users</h3>
            {blockedLoading && (
              <p className="mt-1 text-sm text-muted-foreground">Loading blocked accounts…</p>
            )}
            {blockedError && !blockedLoading && (
              <p className="mt-1 text-sm text-red-500">Failed to load blocked accounts.</p>
            )}
            {!blockedLoading && !blockedError && blockedUsers.length === 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                You haven&apos;t blocked any accounts. When you block someone, they&apos;ll appear
                here and you can choose to unblock them.
              </p>
            )}
            {!blockedLoading && !blockedError && blockedUsers.length > 0 && (
              <ul className="mt-3 space-y-2">
                {blockedUsers.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {b.displayName || b.username}
                      </span>
                      <span className="text-xs text-muted-foreground">@{b.username}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => unblockMutation.mutate(b.id)}
                      className="text-xs px-3 py-1 rounded-full border border-border text-foreground hover:bg-accent disabled:opacity-60"
                      disabled={unblockMutation.isPending}
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'themes' && (
        <Card>
          <Title>Themes</Title>

          <p className="text-sm text-muted-foreground">
            Switch between light and dark themes, and pick a color style that feels right for you.
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs text-muted-foreground">
              Quick toggle between light and dark
            </span>
          </div>

          <ThemeOptionsGrid>
            {[
              {
                id: 'light' as Theme,
                name: 'Standard light',
                description: 'Clean neutral look for daytime.',
              },
              {
                id: 'dark' as Theme,
                name: 'Standard dark',
                description: 'Balanced dark mode with indigo accents.',
              },
              {
                id: 'sakura' as Theme,
                name: 'Pink Sakura',
                description: 'Soft blossom-inspired pinks.',
              },
              {
                id: 'matcha' as Theme,
                name: 'Green Matcha',
                description: 'Calm matcha-toned greens.',
              },
              {
                id: 'starry' as Theme,
                name: 'Starry night',
                description: 'Deep navy sky with bright stars.',
              },
            ].map((preset) => (
              <ThemeOptionCard
                key={preset.id}
                type="button"
                $active={theme === preset.id}
                onClick={() => setTheme(preset.id)}
              >
                <ThemeOptionName>{preset.name}</ThemeOptionName>
                <ThemeOptionDescription>{preset.description}</ThemeOptionDescription>
                <ThemeSwatchRow>
                  <ThemeSwatch $tone="background" />
                  <ThemeSwatch $tone="primary" />
                  <ThemeSwatch $tone="accent" />
                </ThemeSwatchRow>
              </ThemeOptionCard>
            ))}
          </ThemeOptionsGrid>
        </Card>
      )}
    </Container>
  );
}
