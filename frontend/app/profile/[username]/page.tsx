'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, UserPlus, UserMinus, Ban, Cake } from 'lucide-react';
import { blockServices, type BlockedUser } from '@/services/blockServices';
import {
  PostCard as FeedPostCard,
  PostContent as FeedPostContent,
  PostAvatar as FeedPostAvatar,
  PostAvatarText as FeedPostAvatarText,
  PostBody as FeedPostBody,
  PostHeader as FeedPostHeader,
  PostAuthorName as FeedPostAuthorName,
  PostAuthorUsername as FeedPostAuthorUsername,
  PostDivider as FeedPostDivider,
  PostDate as FeedPostDate,
  PostText as FeedPostText,
  PostMediaWrapper as FeedPostMediaWrapper,
  PostMedia as FeedPostMedia,
} from '@/components/FeedTab/FeedTab.styles';
import {
  UserProfileLabels,
  PageContainer,
  Header,
  HeaderContent,
  BackButton,
  HeaderInfo,
  HeaderTitle,
  HeaderSubtitle,
  Container,
  LoadingContainer,
  LoadingText,
  ProfileCard,
  CoverImage,
  ProfileContent,
  ProfileHeader,
  ProfileHeaderLeft,
  Avatar,
  AvatarText,
  DisplayName,
  Username,
  FollowButton,
  Bio,
  MetaInfo,
  MetaItem,
  Stats,
  Stat,
  StatValue,
  StatLabel,
  PostsSection,
  PostsTitle,
  EmptyCard,
  EmptyText,
  BlockButton,
  BirthdayBanner,
  BirthdayContent,
  BlockedMessage,
} from './profile.styles';
import { UserProfile, Post } from './types/types';

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);

  return <UserProfileContent username={username} />;
}

function UserProfileContent({ username }: { username: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['userProfile', username],
    enabled: !!username,
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`${apiUrl}/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      return response.json();
    },
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ['userPosts', username],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`${apiUrl}/posts/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load posts');
      return response.json();
    },
    enabled: !!username,
  });

  const { data: blockedUsers = [] } = useQuery<BlockedUser[]>({
    queryKey: ['blocked-users'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return blockServices.fetchBlockedUsers(token);
    },
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`${apiUrl}/users/${userId}/${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const handleFollowToggle = () => {
    if (!profile || followMutation.isPending) return;

    followMutation.mutate({
      userId: profile.id,
      isFollowing: profile.isFollowing ?? false,
    });
  };

  const blockMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      await blockServices.blockUser(token, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      await blockServices.unblockUser(token, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
    },
  });

  if (profileLoading) {
    return (
      <LoadingContainer>
        <LoadingText>{UserProfileLabels.loadingProfile}</LoadingText>
      </LoadingContainer>
    );
  }

  if (!profile) {
    return (
      <LoadingContainer>
        <LoadingText>{UserProfileLabels.userNotFound}</LoadingText>
      </LoadingContainer>
    );
  }

  const isOwnProfile = user?.uid === profile.id;
  const isBlocked = blockedUsers.some((b) => b.id === profile.id);

  const birthDateValue = profile.birthDate ? new Date(profile.birthDate) : null;
  const today = new Date();
  const isBirthdayToday =
    !!birthDateValue &&
    birthDateValue.getMonth() === today.getMonth() &&
    birthDateValue.getDate() === today.getDate();

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderInfo>
            <HeaderTitle>{profile.displayName || profile.username}</HeaderTitle>
            <HeaderSubtitle>
              {profile.postsCount || 0} {UserProfileLabels.postsLabel}
            </HeaderSubtitle>
          </HeaderInfo>
        </HeaderContent>
      </Header>

      <Container>
        <ProfileCard>
          <CoverImage
            style={
              profile.coverUrl
                ? {
                    backgroundImage: `url("${profile.coverUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          />

          <ProfileContent>
            <ProfileHeader>
              <ProfileHeaderLeft>
                <Avatar>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <AvatarText>{(profile.displayName || username)[0]?.toUpperCase()}</AvatarText>
                  )}
                </Avatar>

                <DisplayName>{profile.displayName || username}</DisplayName>
                <Username>@{username}</Username>
              </ProfileHeaderLeft>

              {!isOwnProfile && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!isBlocked && (
                    <FollowButton
                      onClick={handleFollowToggle}
                      $isFollowing={profile.isFollowing || false}
                      disabled={followMutation.isPending}
                    >
                      {profile.isFollowing ? (
                        <>
                          <UserMinus size={16} />
                          {UserProfileLabels.unfollowButton}
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          {UserProfileLabels.followButton}
                        </>
                      )}
                    </FollowButton>
                  )}
                  <BlockButton
                    onClick={() =>
                      isBlocked
                        ? unblockMutation.mutate(profile.id)
                        : blockMutation.mutate(profile.id)
                    }
                    disabled={blockMutation.isPending || unblockMutation.isPending}
                  >
                    <Ban size={16} />
                    {isBlocked ? 'Unblock' : 'Block'}
                  </BlockButton>
                </div>
              )}
            </ProfileHeader>

            {isBirthdayToday && (
              <BirthdayBanner>
                <BirthdayContent>
                  <Cake size={18} />
                  <span>
                    {isOwnProfile
                      ? 'Today is your birthday – let your friends celebrate with you!'
                      : `Today is @${profile.username}'s birthday.`}
                  </span>
                </BirthdayContent>
              </BirthdayBanner>
            )}

            {isBlocked ? (
              <BlockedMessage>
                You blocked @{username}. Their profile details and posts are hidden.
              </BlockedMessage>
            ) : (
              <>
                {profile.bio && <Bio>{profile.bio}</Bio>}

                <MetaInfo>
                  <MetaItem>
                    <Calendar size={16} />
                    <span>
                      {UserProfileLabels.joinedLabel}{' '}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </MetaItem>
                  {profile.birthDate && profile.isMutualFollower && (
                    <MetaItem>
                      <Calendar size={16} />
                      <span>Birthday: {new Date(profile.birthDate).toLocaleDateString()}</span>
                    </MetaItem>
                  )}
                </MetaInfo>

                <Stats>
                  <Stat>
                    <StatValue>{profile.followingCount || 0}</StatValue>
                    <StatLabel>{UserProfileLabels.followingLabel}</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{profile.followersCount || 0}</StatValue>
                    <StatLabel>{UserProfileLabels.followersLabel}</StatLabel>
                  </Stat>
                </Stats>
              </>
            )}
          </ProfileContent>
        </ProfileCard>

        {!isBlocked && (
          <PostsSection>
            <PostsTitle>{UserProfileLabels.postsTitle}</PostsTitle>

            {posts.length === 0 ? (
              <EmptyCard>
                <EmptyText>{UserProfileLabels.noPostsYet}</EmptyText>
              </EmptyCard>
            ) : (
              posts.map((post) => (
                <FeedPostCard key={post.id}>
                  <FeedPostContent>
                    <FeedPostAvatar>
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.username}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <FeedPostAvatarText>
                          {(profile.displayName || profile.username)[0]?.toUpperCase()}
                        </FeedPostAvatarText>
                      )}
                    </FeedPostAvatar>

                    <FeedPostBody>
                      <FeedPostHeader>
                        <FeedPostAuthorName>
                          {profile.displayName || profile.username}
                        </FeedPostAuthorName>
                        <FeedPostAuthorUsername>@{profile.username}</FeedPostAuthorUsername>
                        <FeedPostDivider>·</FeedPostDivider>
                        <FeedPostDate>{new Date(post.createdAt).toLocaleDateString()}</FeedPostDate>
                      </FeedPostHeader>

                      {post.content && <FeedPostText>{post.content}</FeedPostText>}

                      {(post.imageUrl || post.gifUrl) && (
                        <FeedPostMediaWrapper>
                          <FeedPostMedia
                            src={post.gifUrl || post.imageUrl || ''}
                            alt="Post media"
                          />
                        </FeedPostMediaWrapper>
                      )}
                    </FeedPostBody>
                  </FeedPostContent>
                </FeedPostCard>
              ))
            )}
          </PostsSection>
        )}
      </Container>
    </PageContainer>
  );
}
