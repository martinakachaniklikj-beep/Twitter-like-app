'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from 'lucide-react';
import {
  Container,
  ProfileCard,
  CoverImage,
  ProfileContent,
  ProfileHeader,
  ProfileHeaderLeft,
  Avatar,
  AvatarText,
  DisplayName,
  Username,
  EditButton,
  EditForm,
  InputGroup,
  Label,
  Input,
  Textarea,
  SaveButton,
  Bio,
  MetaInfo,
  MetaItem,
  Stats,
  Stat,
  StatValue,
  StatLabel,
  PostsSection,
  PostsTitle,
  LoadingCard,
  LoadingText,
  EmptyCard,
  EmptyText,
  PostCard,
  PostText,
  PostMeta,
  PostMetaItem,
  PostMetaDivider,
} from './ProfileTab.styles';
import { UserProfile, Post, UpdateProfileForm } from './types';
import { profileLabels } from './utils/labels';
import { formatDate } from './utils/utils';
import { profileServices } from './services/profileServices';

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => profileServices.fetchProfile(token!),
    enabled: !!token,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['userPosts', user?.username],
    queryFn: () => profileServices.fetchUserPosts(token!, user!.username),
    enabled: !!user?.username && !!token,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileForm) => profileServices.updateProfile(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const onSubmit = (data: UpdateProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleEditClick = () => {
    if (isEditing) {
      setIsEditing(false);
      reset();
    } else {
      setIsEditing(true);
      reset({
        displayName: profile?.displayName || '',
        bio: profile?.bio || '',
      });
    }
  };

  if (profileLoading) {
    return (
      <LoadingCard>
        <LoadingText>{profileLabels.loadingProfile}</LoadingText>
      </LoadingCard>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <CoverImage />

        <ProfileContent>
          <ProfileHeader>
            <ProfileHeaderLeft>
              <Avatar>
                <AvatarText>{user?.username[0].toUpperCase()}</AvatarText>
              </Avatar>

              <DisplayName>{profile?.displayName || user?.username}</DisplayName>
              <Username>@{user?.username}</Username>
            </ProfileHeaderLeft>

            <EditButton onClick={handleEditClick}>
              {isEditing ? profileLabels.cancel : profileLabels.editProfile}
            </EditButton>
          </ProfileHeader>

          {isEditing ? (
            <EditForm onSubmit={handleSubmit(onSubmit)}>
              <InputGroup>
                <Label>{profileLabels.displayName}</Label>
                <Input type="text" {...register('displayName')} />
              </InputGroup>

              <InputGroup>
                <Label>{profileLabels.bio}</Label>
                <Textarea rows={3} {...register('bio')} />
              </InputGroup>

              <SaveButton type="submit" disabled={isSubmitting}>
                {profileLabels.save}
              </SaveButton>
            </EditForm>
          ) : (
            <>
              {profile?.bio && <Bio>{profile.bio}</Bio>}

              <MetaInfo>
                <MetaItem>
                  <Calendar size={16} />
                  <span>
                    {profileLabels.joinedDate} {formatDate(profile?.createdAt || '')}
                  </span>
                </MetaItem>
              </MetaInfo>

              <Stats>
                <Stat>
                  <StatValue>{profile?.followingCount || 0}</StatValue>
                  <StatLabel>{profileLabels.following}</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{profile?.followersCount || 0}</StatValue>
                  <StatLabel>{profileLabels.followers}</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{profile?.postsCount || 0}</StatValue>
                  <StatLabel>{profileLabels.posts}</StatLabel>
                </Stat>
              </Stats>
            </>
          )}
        </ProfileContent>
      </ProfileCard>

      <PostsSection>
        <PostsTitle>{profileLabels.posts}</PostsTitle>

        {postsLoading ? (
          <LoadingCard>
            <LoadingText>{profileLabels.loadingPosts}</LoadingText>
          </LoadingCard>
        ) : posts.length === 0 ? (
          <EmptyCard>
            <EmptyText>{profileLabels.noPosts}</EmptyText>
          </EmptyCard>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id}>
              <PostText>{post.content}</PostText>
              {post.imageUrl && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      maxHeight: '500px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
              <PostMeta>
                <PostMetaItem>{formatDate(post.createdAt)}</PostMetaItem>
                <PostMetaDivider>·</PostMetaDivider>
                <PostMetaItem>
                  {post.likesCount || 0} {profileLabels.likes}
                </PostMetaItem>
                <PostMetaDivider>·</PostMetaDivider>
                <PostMetaItem>
                  {post.repliesCount || 0} {profileLabels.replies}
                </PostMetaItem>
              </PostMeta>
            </PostCard>
          ))
        )}
      </PostsSection>
    </Container>
  );
}
