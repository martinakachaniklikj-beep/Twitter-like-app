import styled from 'styled-components';

export const HomeLabels = {
  appTitle: 'Twitter',
  logoutButton: 'Logout',
  logoutButtonShort: 'Logout',
  feedTab: 'Feed',
  profileTab: 'Profile',
  notificationsTab: 'Notifications',
  settingsTab: 'Settings',
  messagesTab: 'Messages',
  bookmarksTab: 'Bookmarks',
  followersTab: 'Followers',
  exploreTab: 'Explore',
  loggedInAs: 'Logged in as',
  loading: 'Loading...',
  sidebarCollapse: 'Collapse sidebar',
  sidebarExpand: 'Expand sidebar',
} as const;

export const Container = styled.div`
  min-height: 100vh;
  background: rgb(var(--background));
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgb(var(--border));
  background: rgba(var(--card), 0.95);
  backdrop-filter: blur(10px);
`;

export const HeaderContent = styled.div`
  padding: 0.5rem 0.75rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AppTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(var(--primary));
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: rgb(var(--secondary));
  color: rgb(var(--secondary-foreground));
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: rgb(var(--accent));
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  flex: 1;
  min-width: 0;
  gap: 0;

  /* 3 columns: sidebar | main | search; sidebar expanded */
  @media (min-width: 1280px) {
    grid-template-columns: auto 1fr minmax(280px, 360px);
  }
`;

export const Sidebar = styled.aside`
  border-right: 1px solid rgb(var(--border));
`;

export const SidebarCard = styled.div`
  padding: 1rem;
  position: sticky;
  top: 5rem;
  width: 100%;
  min-width: 56px;
  transition: min-width 0.2s ease, padding 0.2s ease;

  /* Icons-only (minimized) when viewport below 1280px */
  @media (max-width: 1279px) {
    padding: 1rem 0.5rem;
    min-width: 56px;
    width: auto;
  }

  @media (min-width: 1280px) {
    padding: 1.25rem 1rem;
    min-width: 16rem;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  width: 100%;

  background: ${props => (props.$active ? 'rgb(var(--primary))' : 'transparent')};
  color: ${props => (props.$active ? 'rgb(var(--primary-foreground))' : 'rgb(var(--foreground))')};

  &:hover {
    background: ${props => (props.$active ? 'rgb(var(--primary))' : 'rgb(var(--accent))')};
  }

  /* Icons only on smaller viewports */
  @media (max-width: 1279px) {
    justify-content: center;
    padding: 0.75rem;
    width: 100%;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.2s ease, max-width 0.2s ease;
  }

  @media (max-width: 1279px) {
    span {
      opacity: 0;
      width: 0;
      max-width: 0;
      overflow: hidden;
    }
  }
`;

export const UserInfo = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--border));
  transition: opacity 0.2s ease, max-height 0.2s ease, margin 0.2s ease, padding 0.2s ease;

  @media (max-width: 1279px) {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    padding-top: 0;
    overflow: hidden;
    border: none;
  }
`;

export const UserInfoLabel = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  margin-bottom: 0.25rem;
`;

export const UserInfoUsername = styled.p`
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const UserInfoEmail = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const Main = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 1280px) {
    border-right: 1px solid rgb(var(--border));
  }
`;

export const SearchAboveFeed = styled.div`
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(var(--border));

  @media (min-width: 1280px) {
    display: none;
  }
`;

export const MainScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

export const SearchSidebar = styled.aside`
  display: none;
  min-width: 0;

  @media (min-width: 1280px) {
    display: block;
  }
`;

export const SearchSidebarCard = styled.div`
  position: sticky;
  top: 5rem;
  padding: 1rem;
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  background: rgb(var(--background));
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.p`
  color: rgb(var(--muted-foreground));
`;
