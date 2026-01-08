import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FeedContainer = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CreatePostCard = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgb(var(--border));
`;

export const CreatePostForm = styled.form``;

export const PostTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
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

export const PostButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
`;

export const PostButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border-radius: 9999px;
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

export const FeedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0;
`;

export const FeedTitle = styled.h2`
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
  margin-bottom: 0.5rem;
`;

export const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const PostCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  padding: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(var(--accent), 0.5);
  }
`;

export const PostContent = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const PostAvatar = styled.div`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(var(--primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PostAvatarText = styled.span`
  color: rgb(var(--primary));
  font-weight: 600;
`;

export const PostBody = styled.div`
  flex: 1;
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const PostAuthorName = styled.span`
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const PostAuthorUsername = styled.span`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const PostDivider = styled.span`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const PostDate = styled.span`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const PostText = styled.p`
  color: rgb(var(--foreground));
  margin-bottom: 0.75rem;
`;

export const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: rgb(var(--muted-foreground));
`;

export const PostActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(var(--muted-foreground));
  transition: color 0.3s;

  &:hover {
    color: rgb(var(--primary));
  }
`;

export const PostActionCount = styled.span`
  font-size: 0.875rem;
`;
