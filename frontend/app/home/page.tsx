'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { Home as HomeIcon, User, LogOut } from 'lucide-react';
import SearchBar from '@/components/SearchBar/SearchBar';
import FeedTab from '@/components/FeedTab/FeedTab';
import ProfileTab from '@/components/ProfileTab/ProfileTab';
import {
  HomeLabels,
  Container,
  Header,
  HeaderContent,
  HeaderTop,
  AppTitle,
  HeaderActions,
  LogoutButton,
  MainContent,
  Grid,
  Sidebar,
  SidebarCard,
  TabsContainer,
  TabButton,
  UserInfo,
  UserInfoLabel,
  UserInfoUsername,
  UserInfoEmail,
  Main,
  LoadingContainer,
  LoadingText,
} from './home.styles';

type Tab = 'feed' | 'profile';

export default function HomePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('feed');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingText>{HomeLabels.loading}</LoadingText>
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderTop>
            <AppTitle>{HomeLabels.appTitle}</AppTitle>

            <HeaderActions>
              <SearchBar />
              <ThemeToggle />
              <LogoutButton onClick={handleLogout}>
                <LogOut size={16} />
                <span>{HomeLabels.logoutButton}</span>
              </LogoutButton>
            </HeaderActions>
          </HeaderTop>
        </HeaderContent>
      </Header>

      <MainContent>
        <Grid>
          <Sidebar>
            <SidebarCard>
              <TabsContainer>
                <TabButton $active={activeTab === 'feed'} onClick={() => setActiveTab('feed')}>
                  <HomeIcon size={20} />
                  <span>{HomeLabels.feedTab}</span>
                </TabButton>

                <TabButton
                  $active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={20} />
                  <span>{HomeLabels.profileTab}</span>
                </TabButton>
              </TabsContainer>

              <UserInfo>
                <UserInfoLabel>{HomeLabels.loggedInAs}</UserInfoLabel>
                <UserInfoUsername>@{user?.username}</UserInfoUsername>
                <UserInfoEmail>{user?.email}</UserInfoEmail>
              </UserInfo>
            </SidebarCard>
          </Sidebar>

          <Main>
            {activeTab === 'feed' && <FeedTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </Main>
        </Grid>
      </MainContent>
    </Container>
  );
}
