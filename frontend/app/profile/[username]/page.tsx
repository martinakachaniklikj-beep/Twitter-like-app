'use client';

import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, UserPlus, UserMinus } from 'lucide-react';
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
  PostCard,
  PostText,
  PostMeta,
  PostMetaItem,
  PostMetaDivider,
} from './profile.styles';

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
}

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
          <CoverImage />

          <ProfileContent>
            <ProfileHeader>
              <ProfileHeaderLeft>
                <Avatar>
                  <AvatarText>{username[0].toUpperCase()}</AvatarText>
                </Avatar>

                <DisplayName>{profile.displayName || username}</DisplayName>
                <Username>@{username}</Username>
              </ProfileHeaderLeft>

              {!isOwnProfile && (
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
            </ProfileHeader>

            {profile.bio && <Bio>{profile.bio}</Bio>}

            <MetaInfo>
              <MetaItem>
                <Calendar size={16} />
                <span>
                  {UserProfileLabels.joinedLabel} {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </MetaItem>
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
          </ProfileContent>
        </ProfileCard>

        <PostsSection>
          <PostsTitle>{UserProfileLabels.postsTitle}</PostsTitle>

          {posts.length === 0 ? (
            <EmptyCard>
              <EmptyText>{UserProfileLabels.noPostsYet}</EmptyText>
            </EmptyCard>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id}>
                <PostText>{post.content}</PostText>
                <PostMeta>
                  <PostMetaItem>{new Date(post.createdAt).toLocaleDateString()}</PostMetaItem>
                  <PostMetaDivider>·</PostMetaDivider>
                  <PostMetaItem>
                    {post.likesCount || 0} {UserProfileLabels.likesLabel}
                  </PostMetaItem>
                  <PostMetaDivider>·</PostMetaDivider>
                  <PostMetaItem>
                    {post.repliesCount || 0} {UserProfileLabels.repliesLabel}
                  </PostMetaItem>
                </PostMeta>
              </PostCard>
            ))
          )}
        </PostsSection>
      </Container>
    </PageContainer>
  );
}
