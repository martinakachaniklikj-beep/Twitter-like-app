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
  padding: 1rem 0.75rem 1.5rem;
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
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
  border: 1px solid rgb(var(--border));
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
  justify-content: space-between;
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
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(var(--muted-foreground));
  cursor: pointer;
  position: relative;
  transition:
    color 0.2s,
    border-color 0.2s,
    font-size 0.2s,
    font-weight 0.2s,
    background-color 0.2s;

  &:hover {
    color: rgb(var(--foreground));
    background: rgba(var(--accent), 0.15);
  }

  ${({ $active }) =>
    $active &&
    `
    color: rgb(var(--foreground));
    font-weight: 700;
    font-size: 1rem;
    border-bottom-color: rgb(var(--accent));
    background: rgba(var(--accent), 0.25);
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
  background: rgb(var(--background));
  border: 1px solid rgb(var(--border));
  border-radius: 0.85rem;
  padding: 0.9rem 1rem;
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

export const PostMediaWrapper = styled.div`
  margin-top: 0.6rem;
  border-radius: 0.9rem;
  overflow: hidden;
`;

export const PostMedia = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  background: rgb(var(--card));
  display: block;
`;

export const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: rgb(var(--muted-foreground));
  margin-top: 1rem;
`;

export const PostActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
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
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1300;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
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
    background: rgba(var(--muted-foreground), 0.1);
  }
`;

export const OriginalPostCard = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid rgb(var(--repost));
  background: rgba(120, 120, 120, 0.06);
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
  margin-bottom: 1.25rem;
  max-height: 260px;
  padding-right: 0.25rem;
  overflow-y: auto;
`;

export const CommentsSectionTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #111827;
`;

export const CommentItem = styled.div`
  /* Single unified comment style across all themes (fixed gray palette) */
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgb(39, 45, 58); /* gray-200 */
  border-radius: 0.75rem;
  border: 1px solidrgb(75, 87, 106); /* gray-300 */
`;

export const CommentHeader = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

export const CommentAuthor = styled.strong`
  color: #111827; /* gray-900 */
`;

export const CommentUsername = styled.span`
  color: #4b5563; /* gray-600 */
  margin-left: 0.25rem;
`;

export const CommentDate = styled.span`
  color: #9ca3af; /* gray-400 */
  margin-left: 0.5rem;
  font-size: 0.75rem;
`;

export const CommentContent = styled.div`
  font-size: 0.875rem;
  color: #111827; /* gray-900 */
`;

export const CommentInputContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

export const GifPickerWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const GifDropdown = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1400;
  background-color: #ffffff;
  opacity: 1;
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--border));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  padding: 1rem;
  width: min(360px, 90vw);
  max-height: min(420px, 80vh);
  display: flex;
  flex-direction: column;
`;
