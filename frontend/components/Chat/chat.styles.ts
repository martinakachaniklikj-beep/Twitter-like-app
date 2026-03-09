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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChatInputRoot = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid rgb(var(--border));
`;

export const MessageBubbleRow = styled.div<{ $isOwn?: boolean }>`
  display: flex;
  gap: 0.5rem;
  justify-content: ${(props) => (props.$isOwn ? 'flex-end' : 'flex-start')};
`;

export const MessageBubbleBubble = styled.div<{ $isOwn?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  max-width: 70%;
  font-size: 0.875rem;
  background: ${(props) =>
    props.$isOwn ? 'rgb(var(--primary))' : 'rgb(var(--muted))'};
  color: ${(props) =>
    props.$isOwn ? 'rgb(var(--primary-foreground))' : 'rgb(var(--foreground))'};
`;
