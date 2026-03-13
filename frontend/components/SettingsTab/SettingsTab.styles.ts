import styled from 'styled-components';

export const Container = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TabsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const TabList = styled.div`
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 999px;
  background: rgb(var(--muted));
`;

export const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  background: transparent;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'rgb(var(--background))' : 'rgb(var(--muted-foreground))')};
  background: ${({ $active }) => ($active ? 'rgb(var(--foreground))' : 'transparent')};
  transition:
    background 0.15s ease,
    color 0.15s ease;
`;

export const Card = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--foreground));
  margin-bottom: 1rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--foreground));
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--input));
  border-radius: 0.5rem;
  color: rgb(var(--foreground));

  &:focus {
    outline: none;
    ring: 2px solid rgb(var(--primary));
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const PrimaryButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: transparent;
  color: rgb(var(--foreground));
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgb(var(--accent));
  }
`;

export const Message = styled.p<{ $variant: 'success' | 'error' }>`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${({ $variant }) =>
    $variant === 'success'
      ? 'rgb(34 197 94)' // green-500
      : 'rgb(248 113 113)'}; // red-400
`;

export const ThemeOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const ThemeOptionCard = styled.button<{ $active: boolean }>`
  border-radius: 0.75rem;
  padding: 0.9rem 0.85rem;
  border: 1px solid ${({ $active }) => ($active ? 'rgb(var(--primary))' : 'rgb(var(--border))')};
  background: ${({ $active }) => ($active ? 'rgba(var(--primary), 0.06)' : 'rgb(var(--card))')};
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
    background: ${({ $active }) => ($active ? 'rgba(var(--primary), 0.08)' : 'rgb(var(--card))')};
  }
`;

export const ThemeOptionName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const ThemeOptionDescription = styled.span`
  font-size: 0.8rem;
  color: rgb(var(--muted-foreground));
`;

export const ThemeSwatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.1rem;
`;

export const ThemeSwatch = styled.span<{ $tone: 'primary' | 'accent' | 'background' }>`
  width: 1rem;
  height: 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.16);
  background: ${({ $tone }) =>
    $tone === 'primary'
      ? 'rgb(var(--primary))'
      : $tone === 'accent'
        ? 'rgb(var(--accent))'
        : 'rgb(var(--background))'};
`;
