import styled from 'styled-components';

export const TrendingCard = styled.div`
  margin-top: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid darkgray;
  background: rgba(var(--card), 0.98);
  backdrop-filter: blur(16px);
`;

export const TrendingHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.6rem;
`;

export const TrendingTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const TrendingSubtitle = styled.span`
  font-size: 0.8rem;
  color: rgb(var(--muted-foreground));
`;

export const ScopeToggle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.6rem;
  padding: 0.12rem;
  border-radius: 999px;
  background: rgba(var(--background), 0.9);
  border: 1px solid rgba(var(--accent), 0.55);
`;

export const ScopeButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 0.14rem 0.7rem;
  font-size: 0.78rem;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? 'rgba(var(--primary), 0.14)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'rgb(var(--primary))' : 'rgb(var(--foreground))'};
  transition: background-color 0.15s ease, color 0.15s ease;
`;

export const HashtagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const InfoText = styled.span`
  font-size: 0.8rem;
  color: rgb(var(--muted-foreground));
`;

export const HelperText = styled.p`
  margin-top: 0.7rem;
  font-size: 0.78rem;
  color: rgb(var(--muted-foreground));
`;

export const HashtagChip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  border: ${({ $active }) =>
    $active
      ? '1px solid rgb(var(--primary))'
      : '1px solid rgba(var(--border), 0.9)'};
  padding: 0.18rem 0.7rem;
  font-size: 0.78rem;
  background: ${({ $active }) =>
    $active ? 'rgba(var(--primary), 0.12)' : 'rgba(var(--background), 0.9)'};
  color: ${({ $active }) =>
    $active ? 'rgb(var(--primary))' : 'rgb(var(--foreground))'};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;
`;

