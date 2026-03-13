'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Smile } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import EmojiPicker from 'emoji-picker-react';
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
  SuggestionsList,
  SuggestionItem,
} from './ProfileTab.styles';
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
import { UserProfile, Post, UpdateProfileForm, UpdateProfilePayload } from './types';
import { profileLabels } from './utils/labels';
import { formatDate } from './utils/utils';
import { profileServices } from './services/profileServices';
import { uploadAvatar, uploadCover } from '@/services/storage.service';

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return profileServices.fetchProfile(token);
    },
    enabled: !!user,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['userPosts', profile?.username],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token || !profile?.username) throw new Error('Not authenticated');
      return profileServices.fetchUserPosts(token, profile.username);
    },
    enabled: !!profile?.username && !!user,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      console.log('mutation', data);
      return profileServices.updateProfile(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    let avatarUrl = profile?.avatarUrl;
    let coverUrl = profile?.coverUrl;

    if (data.avatar && data.avatar.length > 0) {
      const file = data.avatar[0];
      avatarUrl = await uploadAvatar(file, user?.uid || '');
    }

    if (data.cover && data.cover.length > 0) {
      const file = data.cover[0];
      coverUrl = await uploadCover(file, user?.uid || '');
    }

    setAvatarPreview(null);
    setCoverPreview(null);

    updateProfileMutation.mutate({
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl,
      coverUrl,
    });
  };

  const handleEditClick = () => {
    if (isEditing) {
      setIsEditing(false);
      reset();
      setAvatarPreview(null);
      setCoverPreview(null);
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
        <CoverImage
          style={
            coverPreview || profile?.coverUrl
              ? {
                  backgroundImage: `url("${coverPreview || profile?.coverUrl || ''}")`,
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
                {avatarPreview || profile?.avatarUrl ? (
                  <img
                    src={avatarPreview || profile?.avatarUrl || ''}
                    alt="Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AvatarText>{user?.displayName?.[0]?.toUpperCase()}</AvatarText>
                )}
              </Avatar>

              <DisplayName>{profile?.displayName || user?.displayName}</DisplayName>
              <Username>@{user?.displayName}</Username>
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
                <div style={{ position: 'relative' }}>
                  <Textarea rows={3} {...register('bio')} style={{ paddingRight: '36px' }} />
                  <div
                    style={{
                      position: 'absolute',
                      right: '6px',
                      bottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgb(var(--accent))',
                          }}
                          title="Add emoji"
                        >
                          <Smile size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border border-border bg-white shadow-xl rounded-2xl">
                        <EmojiPicker
                          onEmojiClick={(emoji) => {
                            const current = getValues('bio') || '';
                            setValue('bio', `${current}${emoji.emoji}`);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </InputGroup>

              <InputGroup>
                <Label>Avatar</Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register('avatar', {
                    onChange: (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setAvatarPreview((prev) => {
                          if (prev) {
                            URL.revokeObjectURL(prev);
                          }
                          return URL.createObjectURL(file);
                        });
                      } else {
                        setAvatarPreview((prev) => {
                          if (prev) {
                            URL.revokeObjectURL(prev);
                          }
                          return null;
                        });
                      }
                    },
                  })}
                />
              </InputGroup>

              <InputGroup>
                <Label>Cover image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register('cover', {
                    onChange: (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setCoverPreview((prev) => {
                          if (prev) {
                            URL.revokeObjectURL(prev);
                          }
                          return URL.createObjectURL(file);
                        });
                      } else {
                        setCoverPreview((prev) => {
                          if (prev) {
                            URL.revokeObjectURL(prev);
                          }
                          return null;
                        });
                      }
                    },
                  })}
                />
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
            <FeedPostCard key={post.id}>
              <FeedPostContent>
                <FeedPostAvatar>
                  {avatarPreview || profile?.avatarUrl ? (
                    <img
                      src={avatarPreview || profile?.avatarUrl || ''}
                      alt="Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <FeedPostAvatarText>{user?.displayName?.[0]?.toUpperCase()}</FeedPostAvatarText>
                  )}
                </FeedPostAvatar>

                <FeedPostBody>
                  <FeedPostHeader>
                    <FeedPostAuthorName>
                      {profile?.displayName || user?.displayName}
                    </FeedPostAuthorName>
                    <FeedPostAuthorUsername>@{profile?.username}</FeedPostAuthorUsername>
                    <FeedPostDivider>·</FeedPostDivider>
                    <FeedPostDate>{formatDate(post.createdAt)}</FeedPostDate>
                  </FeedPostHeader>

                  {post.content && <FeedPostText>{post.content}</FeedPostText>}

                  {post.imageUrl && (
                    <FeedPostMediaWrapper>
                      <FeedPostMedia src={post.imageUrl} alt="Post image" />
                    </FeedPostMediaWrapper>
                  )}
                </FeedPostBody>
              </FeedPostContent>
            </FeedPostCard>
          ))
        )}
      </PostsSection>
    </Container>
  );
}
