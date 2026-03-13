import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
`;

export const ExpandSidebarButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  border: 1px solid rgb(var(--border));
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s;
  &:hover {
    background: var(--muted);
  }
`;

export const ExpandButtonInner = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExpandButtonUnreadDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: rgb(239 68 68);
`;

export const Sidebar = styled.aside`
  width: 14rem;
  border-right: 1px solid rgb(var(--border));
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  @media (min-width: 640px) {
    width: 16rem;
  }
  @media (min-width: 1024px) {
    width: 18rem;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  height: 4rem;
  align-items: center;
  border-bottom: 1px solid rgb(var(--border));
  padding: 0 1rem;
  font-weight: bold;
  font-size: 1.125rem;
  justify-content: space-between;
`;

export const SidebarHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  transition: background-color 0.15s;
  &:hover {
    background: var(--muted);
  }
`;

export const SearchWrap = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid rgb(var(--border));
`;

export const ErrorText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--destructive);
`;

export const ConversationList = styled.div`
  flex: 1;
  overflow: auto;
`;

export const ConversationListMessage = styled.div`
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

export const ConversationItem = styled.button<{ $selected?: boolean; $hasUnread?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid rgb(var(--border));
  transition: background-color 0.15s;
  background: ${({ $selected, $hasUnread }) =>
    $selected ? 'var(--muted)' : $hasUnread ? 'rgba(251, 191, 36, 0.2)' : 'transparent'};
  &:hover {
    background: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const ConversationItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const AvatarGroupWrap = styled.div`
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
`;

export const GroupAvatarLeft = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--background);
  border-radius: 9999px;
  overflow: hidden;
`;

export const GroupAvatarRight = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--background);
  border-radius: 9999px;
  overflow: hidden;
`;

export const ConversationItemContent = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ConversationItemName = styled.div<{ $hasUnread?: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${({ $hasUnread }) => ($hasUnread ? 600 : 500)};
`;

export const ConversationItemPreview = styled.div<{ $hasUnread?: boolean }>`
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $hasUnread }) => ($hasUnread ? 'var(--foreground)' : 'var(--muted-foreground)')};
`;

export const UnreadDot = styled.div`
  margin-left: 0.5rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: var(--primary);
  flex-shrink: 0;
`;

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

export const ThemeArea = styled.div<{ $theme: 'standard' | 'love' | 'friends' }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: ${({ $theme }) =>
    $theme === 'love'
      ? 'linear-gradient(to bottom right, rgba(255, 241, 242, 1), rgba(255, 228, 230, 1))'
      : $theme === 'friends'
        ? 'linear-gradient(to bottom right, rgba(240, 249, 255, 1), rgba(236, 254, 255, 1))'
        : 'var(--background)'};
  .dark & {
    background: ${({ $theme }) =>
      $theme === 'love'
        ? 'linear-gradient(to bottom right, rgba(136, 19, 55, 0.4), rgba(76, 5, 25, 0.5))'
        : $theme === 'friends'
          ? 'linear-gradient(to bottom right, rgba(12, 74, 110, 0.3), rgba(6, 78, 59, 0.3))'
          : 'var(--background)'};
  }
`;

export const BlockedBanner = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: rgb(146 64 14);
  background: rgba(254, 243, 199, 0.9);
  border-bottom: 1px solid rgb(253 224 71);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  .dark & {
    color: rgb(254 243 199);
    background: rgba(120 53 15, 0.4);
    border-color: rgb(161 98 7);
  }
`;

export const BlockedBannerDismiss = styled.button`
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid rgb(253 186 116);
  background: transparent;
  transition: background 0.15s;
  &:hover {
    background: rgba(254 243 199, 0.8);
  }
  .dark & {
    border-color: rgb(127 29 29);
    &:hover {
      background: rgba(127 29 29, 0.6);
    }
  }
`;

export const TypingIndicator = styled.div`
  padding: 0 1rem 0.25rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const TypingDot = styled.span`
  display: inline-flex;
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: var(--primary);
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const DirectBlockedMessage = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  border-top: 1px solid rgb(var(--border));
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
`;
