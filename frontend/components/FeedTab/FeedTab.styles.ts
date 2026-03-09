import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 1rem 1.5rem;
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

  &::placeholder {
    color: rgb(var(--muted-foreground));
  }

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

export const FeedTabsRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(var(--border));
  padding: 0;
`;

export const FeedTabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1rem 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(var(--muted-foreground));
  cursor: pointer;
  position: relative;
  transition: color 0.2s, border-color 0.2s, font-size 0.2s, font-weight 0.2s;

  &:hover {
    color: rgb(var(--foreground));
  }

  ${({ $active }) =>
    $active &&
    `
    color: rgb(var(--foreground));
    font-weight: 700;
    font-size: 1rem;
    border-bottom-color: rgb(var(--foreground));
  `}
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: rgb(var(--card));
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
`;

export const ModalHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: rgb(var(--foreground));
  opacity: 0.9;
`;

export const ModalCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  color: rgb(var(--foreground));
  transition: background-color 0.2s;

  &:hover {
    background: rgb(var(--accent));
  }
`;

export const OriginalPostCard = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgb(var(--accent));
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
`;

export const OriginalPostHeader = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const OriginalPostAuthor = styled.strong`
  color: rgb(var(--foreground));
`;

export const OriginalPostUsername = styled.span`
  color: rgb(var(--muted-foreground));
  margin-left: 0.25rem;
`;

export const OriginalPostContent = styled.div`
  color: rgb(var(--foreground));
`;

export const CommentsSection = styled.div`
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

export const CommentsSectionTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: rgb(var(--foreground));
`;

export const CommentItem = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgb(var(--accent));
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
`;

export const CommentHeader = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

export const CommentAuthor = styled.strong`
  color: rgb(var(--foreground));
`;

export const CommentUsername = styled.span`
  color: rgb(var(--muted-foreground));
  margin-left: 0.25rem;
`;

export const CommentDate = styled.span`
  color: rgb(var(--muted-foreground));
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

export const CommentContent = styled.div`
  font-size: 0.875rem;
  color: rgb(var(--foreground));
`;

export const CommentInputContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;
