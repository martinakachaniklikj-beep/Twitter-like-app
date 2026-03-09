'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, Heart, Repeat2, Image as ImageIcon, X } from 'lucide-react';
import {
  CommentAuthor,
  CommentContent,
  CommentDate,
  CommentHeader,
  CommentInputContainer,
  CommentItem,
  CommentsSection,
  CommentsSectionTitle,
  CommentUsername,
  Container,
  CreatePostCard,
  CreatePostForm,
  EmptyCard,
  EmptySubtext,
  EmptyText,
  FeedContainer,
  FeedSection,
  FeedTabButton,
  FeedTabsRow,
  LoadingCard,
  LoadingText,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  OriginalPostAuthor,
  OriginalPostCard,
  OriginalPostContent,
  OriginalPostHeader,
  OriginalPostUsername,
  PostActionButton,
  PostActionCount,
  PostActions,
  PostAuthorName,
  PostAuthorUsername,
  PostAvatar,
  PostAvatarText,
  PostBody,
  PostButton,
  PostButtonContainer,
  PostCard,
  PostContent,
  PostDate,
  PostDivider,
  PostHeader,
  PostText,
  PostTextarea,
} from './FeedTab.styles';
import { Post, Comment, CreatePostForm as CreatePostFormType } from './types';
import { feedLabels } from './utils/labels';
import { formatDate, readFileAsDataURL } from './utils/utils';
import { feedServices } from './services/feedServices';

export default function FeedTab() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gifUrl, setGifUrl] = useState('');
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [gifResults, setGifResults] = useState<
    { id: string; title: string; previewUrl: string; originalUrl: string }[]
  >([]);
  const [isSearchingGifs, setIsSearchingGifs] = useState(false);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [feedType, setFeedType] = useState<'for_you' | 'following'>('for_you');

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', commentModalPost?.id],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token || !commentModalPost) throw new Error('Not authenticated');
      return feedServices.fetchComments(token, commentModalPost.id);
    },
    enabled: !!commentModalPost && !!user,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePostFormType>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['feed', feedType],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return feedServices.fetchFeed(token, pageParam, 10, feedType);
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: true,
  });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostFormType) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return feedServices.createPost(
        token,
        data.content,
        imageUrl || undefined,
        gifUrl || undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      reset();
      setImageUrl('');
      setGifUrl('');
      setGifResults([]);
      setGifSearchTerm('');
      setIsGifPickerOpen(false);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return isLiked ? feedServices.unlikePost(token, postId) : feedServices.likePost(token, postId);
    },
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed', feedType] });
      const previousData = queryClient.getQueryData(['feed', feedType]);

      queryClient.setQueryData(['feed', feedType], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !isLiked,
                    likesCount: isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
                  }
                : post,
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['feed', feedType], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return feedServices.createComment(token, postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['comments', commentModalPost?.id] });
      setCommentText('');
    },
  });

  const repostMutation = useMutation({
    mutationFn: async ({
      postId,
      isReposted,
      content,
      imageUrl,
      gifUrl,
    }: {
      postId: string;
      isReposted: boolean;
      content?: string;
      imageUrl?: string;
      gifUrl?: string;
    }) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return isReposted
        ? feedServices.unrepostPost(token, postId)
        : feedServices.repostPost(token, postId, content, imageUrl, gifUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const onSubmit = (data: CreatePostFormType) => {
    if (data.content.trim() || imageUrl || gifUrl) {
      createPostMutation.mutate(data);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setImageUrl(dataUrl);
      } catch (error) {
        alert(feedLabels.selectImageFile);
      }
    }
  };

  const handleGifSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = gifSearchTerm.trim();
    if (!term) return;

    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    if (!apiKey) {
      console.error('GIPHY API key is not configured');
      return;
    }

    try {
      setIsSearchingGifs(true);
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
          term,
        )}&limit=24&rating=pg-13`,
      );
      const json = await response.json();
      const items =
        json?.data?.map((item: any) => ({
          id: item.id as string,
          title: (item.title as string) || 'GIF',
          previewUrl:
            (item.images?.fixed_height_small_still?.url as string) ||
            (item.images?.fixed_height_small?.url as string) ||
            (item.images?.downsized_still?.url as string) ||
            (item.images?.downsized?.url as string),
          originalUrl:
            (item.images?.original?.url as string) ||
            (item.images?.downsized_large?.url as string) ||
            (item.images?.downsized?.url as string),
        })) ?? [];
      setGifResults(items.filter((g: any) => g.previewUrl && g.originalUrl));
    } catch (error) {
      console.error('Failed to search GIFs', error);
    } finally {
      setIsSearchingGifs(false);
    }
  };

  return (
    <Container>
      <FeedContainer>
        <FeedTabsRow>
          <FeedTabButton
            $active={feedType === 'for_you'}
            onClick={() => setFeedType('for_you')}
            type="button"
          >
            {feedLabels.forYouTab}
          </FeedTabButton>
          <FeedTabButton
            $active={feedType === 'following'}
            onClick={() => setFeedType('following')}
            type="button"
          >
            {feedLabels.followingTab}
          </FeedTabButton>
        </FeedTabsRow>
        <CreatePostCard>
          <CreatePostForm onSubmit={handleSubmit(onSubmit)}>
            <PostTextarea
              placeholder={feedLabels.createPostPlaceholder}
              rows={3}
              {...register('content', { required: true })}
            />
            {imageUrl && (
              <div style={{ position: 'relative', margin: '10px 0' }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {gifUrl && (
              <div style={{ position: 'relative', margin: '10px 0' }}>
                <img
                  src={gifUrl}
                  alt="Selected GIF"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setGifUrl('')}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <PostButtonContainer>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color, #1d9bf0)',
                  }}
                  title={feedLabels.addImage}
                >
                  <ImageIcon size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsGifPickerOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color, #1d9bf0)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                  title="Add GIF"
                >
                  GIF
                </button>
              </div>
              <PostButton type="submit" disabled={isSubmitting}>
                {feedLabels.postButton}
              </PostButton>
            </PostButtonContainer>
          </CreatePostForm>
        </CreatePostCard>

        <FeedSection>
          {isLoading ? (
            <LoadingCard>
              <LoadingText>{feedLabels.loadingPosts}</LoadingText>
            </LoadingCard>
          ) : posts.length === 0 ? (
            <EmptyCard>
              <EmptyText>
                {feedType === 'following'
                  ? feedLabels.followingEmpty
                  : feedLabels.noPosts}
              </EmptyText>
              <EmptySubtext>
                {feedType === 'following'
                  ? feedLabels.followingEmptySubtitle
                  : feedLabels.noPostsSubtitle}
              </EmptySubtext>
            </EmptyCard>
          ) : (
            posts.map((post: Post) => (
              <PostCard
                key={`${post.isRepost ? 'repost' : 'post'}-${post.id}-${post.authorId || ''}`}
              >
                {post.isRepost && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '8px',
                      paddingLeft: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Repeat2 size={14} />
                    <span
                      onClick={() => router.push(`/profile/${post.authorUsername}`)}
                      style={{ cursor: 'pointer', fontWeight: 500 }}
                    >
                      {post.authorUsername === user?.displayName
                        ? feedLabels.youReposted
                        : post.authorUsername}
                    </span>
                    <span>{feedLabels.reposted}</span>
                  </div>
                )}
                <PostContent>
                  <PostAvatar
                    onClick={() => router.push(`/profile/${post.authorUsername}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <PostAvatarText>{post.authorUsername[0].toUpperCase()}</PostAvatarText>
                  </PostAvatar>

                  <PostBody>
                    <PostHeader>
                      <PostAuthorName
                        onClick={() => router.push(`/profile/${post.authorUsername}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {post.authorDisplayName || post.authorUsername}
                      </PostAuthorName>
                      <PostAuthorUsername
                        onClick={() =>
                          router.push(
                            `/profile/${post.isRepost ? post.originalAuthorUsername : post.authorUsername}`,
                          )
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        @{post.isRepost ? post.originalAuthorUsername : post.authorUsername}
                      </PostAuthorUsername>
                      <PostDivider>·</PostDivider>
                      <PostDate>{formatDate(post.createdAt)}</PostDate>
                    </PostHeader>

                    <PostText>{post.isRepost ? post.originalPostContent : post.content}</PostText>

                    {(post.isRepost ? post.originalPostGifUrl : post.gifUrl) ||
                    (post.isRepost ? post.originalPostImageUrl : post.imageUrl) ? (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={
                            (post.isRepost ? post.originalPostGifUrl : post.gifUrl) ||
                            (post.isRepost ? post.originalPostImageUrl : post.imageUrl)
                          }
                          alt="Post media"
                          style={{
                            width: '100%',
                            borderRadius: '12px',
                            maxHeight: '500px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    ) : null}

                    <PostActions>
                      <PostActionButton onClick={() => setCommentModalPost(post)}>
                        <MessageSquare size={16} />
                        <PostActionCount>{post.repliesCount || 0}</PostActionCount>
                      </PostActionButton>

                      {post.authorId !== user?.uid && (
                        <PostActionButton
                          onClick={() =>
                            repostMutation.mutate({
                              postId: post.isRepost ? post.originalPostId! : post.id,
                              isReposted: post.isReposted,
                              content: post.content,
                              imageUrl: post.imageUrl,
                            })
                          }
                          disabled={repostMutation.isPending}
                          style={{ opacity: repostMutation.isPending ? 0.6 : 1 }}
                        >
                          <Repeat2 size={16} color={post.isReposted ? '#00ba7c' : 'currentColor'} />
                          <PostActionCount
                            style={{ color: post.isReposted ? '#00ba7c' : 'inherit' }}
                          >
                            {post.repostsCount || 0}
                          </PostActionCount>
                        </PostActionButton>
                      )}

                      <PostActionButton
                        onClick={() =>
                          likeMutation.mutate({ postId: post.id, isLiked: post.isLiked })
                        }
                        disabled={likeMutation.isPending}
                        style={{ opacity: likeMutation.isPending ? 0.6 : 1 }}
                      >
                        <Heart
                          size={16}
                          fill={post.isLiked ? 'red' : 'none'}
                          color={post.isLiked ? 'red' : 'currentColor'}
                        />
                        <PostActionCount style={{ color: post.isLiked ? 'red' : 'inherit' }}>
                          {post.likesCount || 0}
                        </PostActionCount>
                      </PostActionButton>
                    </PostActions>
                  </PostBody>
                </PostContent>
              </PostCard>
            ))
          )}
          {hasNextPage && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <PostButton
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                type="button"
              >
                {isFetchingNextPage ? feedLabels.loading : feedLabels.loadMore}
              </PostButton>
            </div>
          )}
        </FeedSection>
      </FeedContainer>

      {commentModalPost && (
        <ModalOverlay onClick={() => setCommentModalPost(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {feedLabels.replyTo} @{commentModalPost.authorUsername}
              </ModalTitle>
              <ModalCloseButton onClick={() => setCommentModalPost(null)}>
                <X size={24} />
              </ModalCloseButton>
            </ModalHeader>

            <OriginalPostCard>
              <OriginalPostHeader>
                <OriginalPostAuthor>
                  {commentModalPost.authorDisplayName || commentModalPost.authorUsername}
                </OriginalPostAuthor>
                <OriginalPostUsername>
                  @{commentModalPost.authorUsername}
                </OriginalPostUsername>
              </OriginalPostHeader>
              <OriginalPostContent>{commentModalPost.content}</OriginalPostContent>
            </OriginalPostCard>

            {comments.length > 0 && (
              <CommentsSection>
                <CommentsSectionTitle>
                  {feedLabels.comments} ({comments.length})
                </CommentsSectionTitle>
                {comments.map((comment: Comment) => (
                  <CommentItem key={comment.id}>
                    <CommentHeader>
                      <CommentAuthor>
                        {comment.user.displayName || comment.user.username}
                      </CommentAuthor>
                      <CommentUsername>@{comment.user.username}</CommentUsername>
                      <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentItem>
                ))}
              </CommentsSection>
            )}

            <PostTextarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={feedLabels.writeReply}
              style={{
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
            <CommentInputContainer>
              <PostButton
                onClick={() =>
                  commentMutation.mutate({ postId: commentModalPost.id, content: commentText })
                }
                disabled={!commentText.trim() || commentMutation.isPending}
                type="button"
              >
                {commentMutation.isPending ? feedLabels.replying : feedLabels.reply}
              </PostButton>
            </CommentInputContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {isGifPickerOpen && (
        <ModalOverlay onClick={() => setIsGifPickerOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Select a GIF</ModalTitle>
              <ModalCloseButton onClick={() => setIsGifPickerOpen(false)}>
                <X size={24} />
              </ModalCloseButton>
            </ModalHeader>

            <form
              onSubmit={handleGifSearch}
              style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                value={gifSearchTerm}
                onChange={(e) => setGifSearchTerm(e.target.value)}
                placeholder="Search GIFs"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgb(var(--input))',
                  background: 'rgb(var(--background))',
                  color: 'rgb(var(--foreground))',
                }}
              />
              <PostButton type="submit" disabled={isSearchingGifs}>
                {isSearchingGifs ? feedLabels.loading : 'Search'}
              </PostButton>
            </form>

            {gifResults.length === 0 && !isSearchingGifs ? (
              <div style={{ color: 'rgb(var(--muted-foreground))', fontSize: '0.875rem' }}>
                Try searching for a reaction like &quot;happy&quot; or &quot;wow&quot;.
              </div>
            ) : null}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '8px',
                maxHeight: '320px',
                overflowY: 'auto',
                marginTop: '0.5rem',
              }}
            >
              {gifResults.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => {
                    setGifUrl(gif.originalUrl);
                    setIsGifPickerOpen(false);
                  }}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  title={gif.title}
                >
                  <img
                    src={gif.previewUrl}
                    alt={gif.title}
                    style={{
                      width: '100%',
                      borderRadius: '0.5rem',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
