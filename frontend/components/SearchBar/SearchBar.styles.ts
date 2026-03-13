import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(var(--muted-foreground));
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--input));
  border-radius: 9999px;
  color: rgb(var(--foreground));

  &::placeholder {
    color: rgb(var(--muted-foreground));
  }

  &:focus {
    outline: none;
    border-color: rgb(var(--primary));
  }
`;

export const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

export const ResultItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;

  &:hover {
    background: rgb(var(--accent));
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgb(var(--border));
  }
`;

export const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgb(var(--primary) / 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AvatarText = styled.span`
  font-weight: bold;
  color: rgb(var(--primary));
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DisplayName = styled.div`
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const Username = styled.div`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const EmptyResults = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: rgb(var(--muted-foreground));
`;
