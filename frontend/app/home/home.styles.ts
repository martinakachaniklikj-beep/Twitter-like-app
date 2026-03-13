import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

export const HeaderLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  border: gray solid 1px;
  background: white;
  color: rgb(55, 65, 81);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: rgb(243, 244, 246);
  }
`;

export const HeaderSearchWrapper = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
    max-width: 320px;
    width: 100%;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const Grid = styled.div<{ $hasRightSidebar: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  flex: 1;
  min-width: 0;
  gap: 0;

  /* 3 columns: sidebar | main | search; sidebar expanded */
  @media (min-width: 1280px) {
    ${({ $hasRightSidebar }) =>
      $hasRightSidebar
        ? 'grid-template-columns: auto minmax(0, 1fr) minmax(320px, 400px);'
        : 'grid-template-columns: auto minmax(0, 1fr);'}
    column-gap: ${({ $hasRightSidebar }) => ($hasRightSidebar ? '1.5rem' : '0')};
  }
`;

export const Sidebar = styled.aside`
  border-right: 1px solid rgb(var(--border));
`;

export const SidebarCard = styled.div`
  padding: 0.5rem 0.85rem;
  position: sticky;
  top: 4.25rem;
  width: 100%;
  min-width: 56px;
  transition: min-width 0.2s ease, padding 0.2s ease;

  /* Icons-only (minimized) when viewport below 1280px */
  @media (max-width: 1279px) {
    padding: 0.5rem 0.4rem;
    min-width: 56px;
    width: auto;
  }

  @media (min-width: 1280px) {
    padding: 0.85rem 0.85rem;
    min-width: 18rem;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  position: relative;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  width: 100%;

  /* Default light theme: neutral gray backgrounds so the active tab stands out without strong color */
  background: ${props =>
    props.$active ? 'rgb(209, 213, 219)' : 'transparent'}; /* gray-300 active */
  color: rgb(var(--foreground));

  &:hover {
    background: ${props =>
      props.$active ? 'rgb(156, 163, 175)' : 'rgb(243, 244, 246)'}; /* gray-500 / gray-100 */
  }

  /* Sakura theme: use soft pink-tinted backgrounds on hover/active */
  .theme-sakura & {
    background: ${props =>
      props.$active ? 'rgb(236, 72, 153)' : 'transparent'}; /* pink-500 when active */
    color: rgb(var(--foreground));

    &:hover {
      background: ${props =>
        props.$active
          ? 'rgb(236, 72, 153)' /* keep active tab solid pink on hover */
          : 'rgba(236, 72, 153, 0.3)' /* darker pink wash on hover for inactive */};
    }
  }

  /* Matcha theme: use soft green-tinted backgrounds on hover/active */
  .theme-matcha & {
    background: ${props =>
      props.$active ? 'rgb(22, 163, 74)' : 'transparent'}; /* green-600 when active */
    color: rgb(var(--foreground));

    &:hover {
      background: ${props =>
        props.$active
          ? 'rgb(22, 163, 74)' /* keep active tab solid green on hover */
          : 'rgba(22, 163, 74, 0.28)' /* deeper green wash on hover for inactive */};
    }
  }

  /* Dark theme: revert to colored primary/accent behavior for clarity */
  .dark & {
    background: ${props =>
      props.$active ? 'rgb(var(--primary))' : 'transparent'};
    color: ${props =>
      props.$active ? 'rgb(var(--primary-foreground))' : 'rgb(var(--foreground))'};

    &:hover {
      background: ${props =>
        props.$active ? 'rgb(var(--primary))' : 'rgb(var(--accent))'};
    }
  }

  /* Icons only on smaller viewports */
  @media (max-width: 1279px) {
    justify-content: center;
    padding: 0.75rem;
    width: auto;
    align-self: center;
    gap: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.2s ease, max-width 0.2s ease;
  }

  @media (max-width: 1279px) {
    span {
      display: none;
    }
  }
`;

export const UserInfo = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(var(--border));
  transition: margin 0.2s ease, padding 0.2s ease;
  position: relative;

  @media (max-width: 1279px) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
`;

export const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.4rem;

  @media (max-width: 1279px) {
    justify-content: center;
    margin-top: 0.25rem;
  }
`;

export const UserAvatar = styled.div`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgba(var(--primary), 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
`;

export const UserAvatarText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgb(var(--primary));
`;

export const UserInfoLabel = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  margin-bottom: 0.25rem;

  @media (max-width: 1279px) {
    display: none;
  }
`;

export const UserInfoUsername = styled.p`
  font-weight: 600;
  color: rgb(var(--foreground));

  @media (max-width: 1279px) {
    display: none;
  }
`;

export const UserInfoEmail = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));

  @media (max-width: 1279px) {
    display: none;
  }
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

export const TabContentShell = styled.div<{ $fullWidth?: boolean; $compactLeft?: boolean }>`
  max-width: ${props => (props.$fullWidth ? '100%' : '760px')};
  margin: ${props => (props.$compactLeft ? '10px 20px' : '10px auto')};
  padding: ${props =>
    props.$fullWidth
      ? '0 0 1.5rem'
      : props.$compactLeft
        ? '0.75rem 0 1.5rem'
        : '0.75rem 0.75rem 1.5rem'};
  box-sizing: border-box;
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
  padding: 1.25rem;
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
  overscroll-behavior: contain;
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

export const FloatingCatButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--kitty-button-bg);
  color: var(--kitty-button-fg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 200;
  opacity: 1;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  }
`;

export const UserMenu = styled.div`
  position: absolute;
  top: 50%;
  left: 2.5rem;
  transform: translateY(-50%);
  margin-left: 0.5rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.75rem;
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 150;
  min-width: 9rem;
  pointer-events: auto;
`;

export const UserMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.55rem;
  border: none;
  background: rgb(220, 38, 38); /* solid red for logout */
  color: rgb(254, 226, 226); /* soft red text instead of white */
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background: rgb(185, 28, 28); /* darker on hover */
  }

  &:active {
    transform: translateY(0.5px);
  }
`;
