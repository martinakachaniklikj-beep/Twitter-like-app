import styled from 'styled-components';

export const Container = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ProfileCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const CoverImage = styled.div`
  height: 8rem;
  background: linear-gradient(to right, rgba(var(--primary), 0.2), rgba(var(--primary), 0.4));
`;

export const ProfileContent = styled.div`
  padding: 1.5rem;
`;

export const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const ProfileHeaderLeft = styled.div`
  flex: 1;
`;

export const Avatar = styled.div`
  width: 5rem;
  height: 5rem;
  margin-top: -3.5rem;
  margin-bottom: 0.75rem;
  border-radius: 9999px;
  background: rgb(var(--card));
  border: 4px solid rgb(var(--card));
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarText = styled.span`
  font-size: 1.875rem;
  font-weight: bold;
  color: rgb(var(--primary));
`;

export const DisplayName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(var(--foreground));
`;

export const Username = styled.p`
  color: rgb(var(--muted-foreground));
`;

export const EditButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  background: transparent;
  color: rgb(var(--foreground));
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: rgb(var(--accent));
  }
`;

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--foreground));
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--input));
  border-radius: 0.5rem;
  color: rgb(var(--foreground));

  &:focus {
    outline: none;
    ring: 2px solid rgb(var(--primary));
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgb(var(--background));
  border: 1px solid rgb(var(--input));
  border-radius: 0.5rem;
  color: rgb(var(--foreground));
  resize: none;

  &:focus {
    outline: none;
    ring: 2px solid rgb(var(--primary));
  }
`;

export const SuggestionsList = styled.ul`
  margin-top: 0.25rem;
  max-height: 10rem;
  overflow-y: auto;
  background: rgb(var(--background));
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  list-style: none;
  padding: 0.25rem 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  z-index: 10;
`;

export const SuggestionItem = styled.li`
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(var(--foreground));
  cursor: pointer;

  &:hover {
    background: rgb(var(--accent));
  }
`;

export const SaveButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Bio = styled.p`
  color: rgb(var(--foreground));
  margin-top: 0.75rem;
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const Stat = styled.div``;

export const StatValue = styled.span`
  font-weight: bold;
  color: rgb(var(--foreground));
`;

export const StatLabel = styled.span`
  color: rgb(var(--muted-foreground));
  margin-left: 0.25rem;
`;

export const PostsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PostsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: rgb(var(--foreground));
`;

export const LoadingCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
`;

export const LoadingText = styled.p`
  color: rgb(var(--muted-foreground));
`;

export const EmptyCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
`;

export const EmptyText = styled.p`
  color: rgb(var(--muted-foreground));
`;

export const PostCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 1rem;
`;

export const PostText = styled.p`
  color: rgb(var(--foreground));
  margin-bottom: 0.75rem;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const PostMetaItem = styled.span``;

export const PostMetaDivider = styled.span``;
