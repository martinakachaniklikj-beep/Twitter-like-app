import styled from 'styled-components';

export const UserProfileLabels = {
  loadingProfile: 'Loading profile...',
  userNotFound: 'User not found',
  postsLabel: 'posts',
  followButton: 'Follow',
  unfollowButton: 'Unfollow',
  joinedLabel: 'Joined',
  followingLabel: 'Following',
  followersLabel: 'Followers',
  postsTitle: 'Posts',
  noPostsYet: 'No posts yet',
  likesLabel: 'likes',
  repliesLabel: 'replies',
} as const;

export const PageContainer = styled.div`
  min-height: 100vh;
  background: rgb(var(--background));
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgb(var(--border));
  background: rgba(var(--card), 0.95);
  backdrop-filter: blur(12px);
`;

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const BackButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgb(var(--accent));
  }
`;

export const HeaderInfo = styled.div``;

export const HeaderTitle = styled.h1`
  font-weight: bold;
  font-size: 1.125rem;
  color: rgb(var(--foreground));
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
`;

export const Container = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  background: rgb(var(--background));
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.p`
  color: rgb(var(--muted-foreground));
`;

export const ProfileCard = styled.div`
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
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

export const FollowButton = styled.button<{ $isFollowing: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: ${props => props.$isFollowing ? '1px solid rgb(var(--border))' : 'none'};
  background: ${props => props.$isFollowing ? 'rgb(var(--secondary))' : 'rgb(var(--primary))'};
  color: ${props => props.$isFollowing ? 'rgb(var(--secondary-foreground))' : 'rgb(var(--primary-foreground))'};

  &:hover {
    opacity: 0.9;
    background: ${props => props.$isFollowing ? 'rgb(var(--accent))' : 'rgb(var(--primary))'};
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
