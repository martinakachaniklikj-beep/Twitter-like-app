import styled from "styled-components";

export const ScrollAreaWrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const LoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
  padding: 1rem;
`;

export const LoadingMore = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

export const MessagesInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

export const SystemMessage = styled.div`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  text-align: center;
  padding: 0 0.5rem;
`;
