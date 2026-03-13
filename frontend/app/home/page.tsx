'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { LogOut, Cat } from 'lucide-react';
import SeasonalLogo from '@/components/SeasonalLogo/SeasonalLogo';
import SearchBar from '@/components/SearchBar/SearchBar';
import FeedTab from '@/components/FeedTab/FeedTab';
import { CreatePostDialog } from '@/components/FeedTab/CreatePostDialog';
import ProfileTab from '@/components/ProfileTab/ProfileTab';
import { HomeLabels } from './types/types';
import {
  Container,
  Header,
  HeaderContent,
  HeaderTop,
  AppTitle,
  HeaderActions,
  HeaderLogoutButton,
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
  UserInfoRow,
  UserAvatar,
  UserAvatarText,
  Main,
  SearchAboveFeed,
  MainScroll,
  TabContentShell,
  SearchSidebar,
  SearchSidebarCard,
  LoadingContainer,
  LoadingText,
  FloatingCatButton,
} from './home.styles';
import type { Tab } from './types/types';
import { TAB_CONFIG } from './types/types';
import { ChatContainer } from '@/components/Chat/chat-container';
import { KittyBotChat } from '@/components/KittyBot/KittyBotChat';
import NotificationsTab from '@/components/NotificationsTab/NotificationsTab';
import { notificationServices, type ApiNotification } from '@/services/notificationServices';
import { chatServices, type ConversationListItem } from '@/services/chatServices';
import { useChatSocket } from '@/contexts/ChatSocketContext';
import SavedTab from '@/components/SavedTab/SavedTab';
import { StocksSidebarCard } from '@/components/Stocks/StocksSidebarCard';
import { SportsSidebarCard } from '@/components/Sports/SportsSidebarCard';
import { SettingsTab } from '@/components/SettingsTab/SettingsTab';
import FollowersTab from '@/components/FollowersTab/FollowersTab';
import ExploreTab from '@/components/ExploreTab/ExploreTab';
import { AiInspirationCard } from '@/components/AI/AiInspirationCard';
import TrendingTab from '@/components/TrendingTab/TrendingTab';
import { SuggestedFollowersCard } from '@/components/FollowersTab/SuggestedFollowersCard';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <LoadingContainer>
          <LoadingText>{HomeLabels.loading}</LoadingText>
        </LoadingContainer>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const { user, profile, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isKittyFloatingOpen, setIsKittyFloatingOpen] = useState(false);
  const [initialComposeContent, setInitialComposeContent] = useState<string | undefined>(undefined);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [activeHashtagFilter, setActiveHashtagFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { onNotificationNew } = useChatSocket();

  const { data: notificationsForBadge } = useQuery<ApiNotification[]>({
    queryKey: ['notifications', 'badge'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return notificationServices.fetchNotifications(token, 'all');
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const unreadNotificationsCount =
    notificationsForBadge?.filter((n) => !n.readAt).length ?? 0;

  const { data: conversationsForBadge } = useQuery<ConversationListItem[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return chatServices.listConversations(token);
    },
    enabled: !!user,
  });

  const hasUnreadMessages =
    conversationsForBadge?.some((c) => c.hasUnread) ?? false;

  useEffect(() => {
    const unsubscribe = onNotificationNew((notification) => {
      queryClient.setQueryData<ApiNotification[] | undefined>(
        ['notifications', 'badge'],
        (prev) => {
          const current = prev ?? [];
          if (current.some((n) => n.id === notification.id)) {
            return current;
          }
          return [notification, ...current];
        },
      );
    });

    return unsubscribe;
  }, [onNotificationNew, queryClient]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const compose = searchParams.get('compose');
    if (compose) {
      setInitialComposeContent(compose);
      setIsCreatePostOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setHeaderSearchQuery('');
  }, [activeTab]);

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

  const hideRightSidebarForTabs: Tab[] = ['kittyBot', 'messages', 'settings', 'bookmarks'];
  const showRightSidebar = !hideRightSidebarForTabs.includes(activeTab);
  const showKittyFloating = showRightSidebar;
  const isFollowersTab = activeTab === 'followers';

  const openCreatePostDialog = (content?: string) => {
    if (content !== undefined) {
      setInitialComposeContent(content);
    }
    setIsCreatePostOpen(true);
  };

  const closeCreatePostDialog = () => {
    setIsCreatePostOpen(false);
    setInitialComposeContent(undefined);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderTop>
            <HeaderActions>
              <SeasonalLogo />
              <AppTitle>{HomeLabels.appTitle}</AppTitle>
            </HeaderActions>

            <HeaderActions>
              {(activeTab === 'notifications' ||
                activeTab === 'bookmarks' ||
                activeTab === 'followers') && (
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'notifications'
                      ? 'Search notifications'
                      : activeTab === 'bookmarks'
                        ? 'Search saved posts'
                        : 'Search followers'
                  }
                  style={{
                    width: '260px',
                    maxWidth: '50vw',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid rgb(var(--input))',
                    background: 'rgb(var(--background))',
                    color: 'rgb(var(--foreground))',
                    fontSize: '0.875rem',
                  }}
                />
              )}
              <HeaderLogoutButton type="button" onClick={handleLogout} title={HomeLabels.logoutButton}>
                <LogOut size={18} />
                <span>{HomeLabels.logoutButton}</span>
              </HeaderLogoutButton>
              <ThemeToggle />
            </HeaderActions>
          </HeaderTop>
        </HeaderContent>
      </Header>

      <MainContent>
        <Grid $hasRightSidebar={showRightSidebar}>
          <Sidebar>
            <SidebarCard>
              <TabsContainer>
                {TAB_CONFIG.map(({ id, label, Icon }) => (
                  <TabButton
                    key={id}
                    $active={activeTab === id}
                    onClick={() => {
                      if (id === 'createPost') {
                        openCreatePostDialog();
                        return;
                      }

                      setActiveTab(id);
                      if (id === 'notifications') {
                        queryClient.invalidateQueries({ queryKey: ['notifications'] });
                        queryClient.invalidateQueries({ queryKey: ['notifications', 'badge'] });
                      }
                    }}
                    title={label}
                  >
                    <div className="relative inline-flex items-center justify-center tab-icon-wrapper">
                      <Icon size={20} />
                      {id === 'notifications' && unreadNotificationsCount > 0 && (
                        <>
                          {/* Full pill with count on wide sidebar (desktop) */}
                          <div className="absolute -top-1 -right-1 hidden xl:flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-[5px] text-[10px] font-semibold text-white">
                            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                          </div>
                          {/* Simple red dot on minimized icon-only sidebar (mobile/tablet) */}
                          <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 xl:hidden" />
                        </>
                      )}
                      {id === 'messages' && hasUnreadMessages && (
                        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <span>{label}</span>
                  </TabButton>
                ))}
              </TabsContainer>

              <UserInfo>
                <UserInfoLabel>{HomeLabels.loggedInAs}</UserInfoLabel>
                <UserInfoRow>
                  <UserAvatar title={profile?.username ?? user?.email ?? 'Profile'}>
                    {profile?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName ?? profile.username ?? 'Profile avatar'}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '9999px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : user?.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={user.displayName ?? user.email ?? 'Profile avatar'}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '9999px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <UserAvatarText>
                        {(
                          profile?.displayName ||
                          profile?.username ||
                          user?.displayName ||
                          user?.email ||
                          'U'
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </UserAvatarText>
                    )}
                  </UserAvatar>
                  <div>
                    <UserInfoUsername>
                      @{profile?.username || profile?.displayName || user?.displayName}
                    </UserInfoUsername>
                    <UserInfoEmail>{user?.email}</UserInfoEmail>
                  </div>
                </UserInfoRow>
              </UserInfo>
            </SidebarCard>
          </Sidebar>

          <Main>
            {activeTab !== 'messages' && (
              <SearchAboveFeed>
                <SearchBar />
              </SearchAboveFeed>
            )}
            <MainScroll>
              <TabContentShell
                $fullWidth={activeTab === 'messages'}
                $compactLeft={activeTab === 'bookmarks'}
              >
                {activeTab === 'feed' && (
                  <FeedTab
                    activeHashtag={activeHashtagFilter ?? undefined}
                    onHashtagSelect={(tag) => {
                      const trimmed = tag.trim();
                      setActiveHashtagFilter(trimmed ? trimmed : null);
                    }}
                  />
                )}
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'notifications' && (
                  <NotificationsTab
                    searchQuery={headerSearchQuery}
                    onCompose={(prefill) => openCreatePostDialog(prefill)}
                  />
                )}
                {activeTab === 'bookmarks' && <SavedTab searchQuery={headerSearchQuery} />}
                {activeTab === 'settings' && <SettingsTab />}
                {activeTab === 'followers' && <FollowersTab searchQuery={headerSearchQuery} />}
                {activeTab === 'explore' && <ExploreTab />}
                {activeTab === 'kittyBot' && (
                  <div className="p-4 max-w-3xl mx-auto">
                    <KittyBotChat variant="full" />
                  </div>
                )}
                {activeTab === 'messages' && (
                  <div className="flex flex-col h-[calc(100vh-5rem)] max-h-screen">
                    <div className="flex-1 min-h-0 overflow-hidden bg-card flex">
                      <ChatContainer />
                    </div>
                  </div>
                )}
              </TabContentShell>
            </MainScroll>
          </Main>

          {showRightSidebar && (
            <SearchSidebar>
              <SearchSidebarCard>
                {(activeTab === 'feed' || activeTab === 'profile') && <SearchBar />}
                <TrendingTab
                  initialScope={isFollowersTab ? 'country' : 'global'}
                  activeHashtag={activeHashtagFilter}
                  onHashtagSelect={(tag) => {
                    const trimmed = tag.trim();
                    setActiveHashtagFilter(trimmed ? trimmed : null);
                  }}
                />
                {isFollowersTab && <SuggestedFollowersCard />}
                <AiInspirationCard />
                {!isFollowersTab && (
                  <>
                    <StocksSidebarCard />
                    <SportsSidebarCard />
                  </>
                )}
              </SearchSidebarCard>
            </SearchSidebar>
          )}
        </Grid>
      </MainContent>

      {showKittyFloating && (
        <>
          <FloatingCatButton
            aria-label="Kitty Bot chat"
            onClick={() => setIsKittyFloatingOpen((open) => !open)}
          >
            <Cat size={22} />
          </FloatingCatButton>

          {isKittyFloatingOpen && (
            <div className="fixed right-4 bottom-24 w-80 max-w-[90vw] z-[210]">
              <KittyBotChat />
            </div>
          )}
        </>
      )}

      <CreatePostDialog
        open={isCreatePostOpen}
        onClose={closeCreatePostDialog}
        initialContent={initialComposeContent}
      />
    </Container>
  );
}
