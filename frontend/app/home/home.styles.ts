import styled from 'styled-components';

export const HomeLabels = {
  appTitle: 'Twitter',
  logoutButton: 'Logout',
  logoutButtonShort: 'Logout',
  feedTab: 'Feed',
  profileTab: 'Profile',
  loggedInAs: 'Logged in as',
  loading: 'Loading...',
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 3fr;
  }
`;

export const Sidebar = styled.aside``;

export const SidebarCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 1rem;
  position: sticky;
  top: 5rem;
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
  transition: all 0.3s;
  font-weight: 500;

  background: ${props => props.$active ? 'rgb(var(--primary))' : 'transparent'};
  color: ${props => props.$active ? 'rgb(var(--primary-foreground))' : 'rgb(var(--foreground))'};

  &:hover {
    background: ${props => props.$active ? 'rgb(var(--primary))' : 'rgb(var(--accent))'};
  }
`;

export const UserInfo = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--border));
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

export const Main = styled.main``;

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
