'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { LogOut } from 'lucide-react';
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
  SearchAboveFeed,
  MainScroll,
  SearchSidebar,
  SearchSidebarCard,
  LoadingContainer,
  LoadingText,
} from './home.styles';
import type { Tab } from './types';
import { TAB_CONFIG } from './types';
import { ChatContainer } from '@/components/Chat/chat-container';

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
                {TAB_CONFIG.map(({ id, label, Icon }) => (
                  <TabButton
                    key={id}
                    $active={activeTab === id}
                    onClick={() => setActiveTab(id)}
                    title={label}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </TabButton>
                ))}
              </TabsContainer>

              <UserInfo>
                <UserInfoLabel>{HomeLabels.loggedInAs}</UserInfoLabel>
                <UserInfoUsername>@{user?.displayName}</UserInfoUsername>
                <UserInfoEmail>{user?.email}</UserInfoEmail>
              </UserInfo>
            </SidebarCard>
          </Sidebar>

          <Main>
            <SearchAboveFeed>
              <SearchBar />
            </SearchAboveFeed>
            <MainScroll>
              {activeTab === 'feed' && <FeedTab />}
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'messages' && (
                <div className="flex flex-col h-[70vh] min-h-[420px]">
                  <ChatContainer />
                </div>
              )}
              {activeTab !== 'feed' && activeTab !== 'profile' && activeTab !== 'messages' && (
                <div style={{ padding: '1.5rem', color: 'rgb(var(--muted-foreground))' }}>
                  {TAB_CONFIG.find((t) => t.id === activeTab)?.label} — Coming soon
                </div>
              )}
            </MainScroll>
          </Main>

          <SearchSidebar>
            <SearchSidebarCard>
              <SearchBar />
            </SearchSidebarCard>
          </SearchSidebar>
        </Grid>
      </MainContent>
    </Container>
  );
}
