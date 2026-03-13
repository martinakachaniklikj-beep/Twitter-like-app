import styled from "styled-components";

export const SidebarRoot = styled.div`
  width: 20rem;
  border-right: 1px solid rgb(var(--border));
`;

export const SidebarTitle = styled.div`
  padding: 1rem;
  font-weight: bold;
  font-size: 1.125rem;
`;

export const ChatItem = styled.div`
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.15s;
  &:hover {
    background: var(--muted);
  }
`;

export const ChatItemName = styled.div`
  font-weight: 500;
`;

export const ChatItemPreview = styled.div`
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;
