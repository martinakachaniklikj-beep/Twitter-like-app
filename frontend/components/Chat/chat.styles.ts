import styled from 'styled-components';

export const ChatContainerRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid rgb(var(--border));
  border-radius: 0.75rem;
`;

export const ChatMessagesArea = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 900px) {
    padding: 0.6rem;
    gap: 0.75rem;
  }
`;

export const ChatInputRoot = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.75rem;
  border-top: 1px solid rgb(var(--border));

  @media (max-width: 900px) {
    gap: 0.25rem;
    padding: 0.5rem 0.6rem 0.55rem;
  }
`;

export const MessageBubbleRow = styled.div<{ $isOwn?: boolean }>`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  justify-content: ${(props) => (props.$isOwn ? 'flex-end' : 'flex-start')};
`;

export const MessageBubbleAvatarWrap = styled.div`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  position: relative;
`;

type ChatTheme = 'standard' | 'love' | 'friends';

export const MessageBubbleBubble = styled.div<{ $isOwn?: boolean; $theme?: ChatTheme; $status?: string }>`
  padding: 0.55rem 0.95rem;
  border-radius: 1.2rem;
  max-width: min(78%, 420px);
  font-size: 0.875rem;
  line-height: 1.35;
  word-break: break-word;
  ${(props) =>
    props.$isOwn
      ? `
    border-bottom-right-radius: 0.35rem;
    border-top-left-radius: 1.4rem;
  `
      : `
    border-bottom-left-radius: 0.35rem;
    border-top-right-radius: 1.4rem;
  `}
  background: ${({ $isOwn, $theme, $status }) => {
    // Recipient side: highlight newly received (sent but not yet read) messages in a theme-matched tint
    if (!$isOwn && $status === 'sent') {
      if ($theme === 'love') {
        return 'rgba(244, 114, 182, 0.22)'; // soft pink matching love theme
      }
      if ($theme === 'friends') {
        return 'rgba(56, 189, 248, 0.22)'; // soft sky/teal for friends theme
      }
      // standard theme: gentle amber highlight
      return 'rgba(250, 204, 21, 0.22)';
    }

    if ($theme === 'love') {
      return $isOwn
        ? 'linear-gradient(135deg, #fb7185, #ec4899)'
        : 'rgba(var(--card), 0.9)';
    }
    if ($theme === 'friends') {
      return $isOwn
        ? 'linear-gradient(135deg, #0ea5e9, #22c55e)'
        : 'rgba(var(--card), 0.9)';
    }
    return $isOwn ? 'rgb(var(--primary))' : 'rgb(var(--muted))';
  }};
  color: ${({ $isOwn, $theme }) => {
    if ($theme === 'love' || $theme === 'friends') {
      return $isOwn ? '#ffffff' : 'rgb(var(--foreground))';
    }
    return $isOwn ? 'rgb(var(--primary-foreground))' : 'rgb(var(--foreground))';
  }};
  box-shadow: ${({ $theme }) =>
    $theme === 'love'
      ? '0 2px 8px rgba(244, 114, 182, 0.35)'
      : $theme === 'friends'
      ? '0 2px 8px rgba(56, 189, 248, 0.3)'
      : '0 1px 4px rgba(15, 23, 42, 0.12)'};
  opacity: ${({ $isOwn, $status }) =>
    $isOwn && $status === 'read' ? 0.85 : 1};
`;
