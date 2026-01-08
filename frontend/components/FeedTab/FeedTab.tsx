'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, Heart, Repeat2, Image as ImageIcon, X } from 'lucide-react';
import {
  Container,
  FeedContainer,
  CreatePostCard,
  CreatePostForm,
  PostTextarea,
  PostButtonContainer,
  PostButton,
  FeedSection,
  FeedTitle,
  LoadingCard,
  LoadingText,
  EmptyCard,
  EmptyText,
  EmptySubtext,
  PostCard,
  PostContent,
  PostAvatar,
  PostAvatarText,
  PostBody,
  PostHeader,
  PostAuthorName,
  PostAuthorUsername,
  PostDivider,
  PostDate,
  PostText,
  PostActions,
  PostActionButton,
  PostActionCount,
} from './FeedTab.styles';
import { Post, Comment, CreatePostForm as CreatePostFormType } from './types';
import { feedLabels } from './utils/labels';
import { formatDate, readFileAsDataURL } from './utils/utils';
import { feedServices } from './services/feedServices';

export default function FeedTab() {
  const { token, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', commentModalPost?.id],
    queryFn: () => feedServices.fetchComments(token!, commentModalPost!.id),
    enabled: !!commentModalPost && !!token,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePostFormType>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => feedServices.fetchFeed(token!, pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: true,
  });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostFormType) =>
      feedServices.createPost(token!, data.content, imageUrl || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      reset();
      setImageUrl('');
    },
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      isLiked ? feedServices.unlikePost(token!, postId) : feedServices.likePost(token!, postId),
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousData = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
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
        queryClient.setQueryData(['feed'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      feedServices.createComment(token!, postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['comments', commentModalPost?.id] });
      setCommentText('');
    },
  });

  const repostMutation = useMutation({
    mutationFn: ({
      postId,
      isReposted,
      content,
      imageUrl,
    }: {
      postId: string;
      isReposted: boolean;
      content?: string;
      imageUrl?: string;
    }) =>
      isReposted
        ? feedServices.unrepostPost(token!, postId)
        : feedServices.repostPost(token!, postId, content, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const onSubmit = (data: CreatePostFormType) => {
    if (data.content.trim()) {
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

  return (
    <Container>
      <FeedContainer>
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
              </div>
              <PostButton type="submit" disabled={isSubmitting}>
                {feedLabels.postButton}
              </PostButton>
            </PostButtonContainer>
          </CreatePostForm>
        </CreatePostCard>

        <FeedSection>
          <FeedTitle>{feedLabels.feedTitle}</FeedTitle>

          {isLoading ? (
            <LoadingCard>
              <LoadingText>{feedLabels.loadingPosts}</LoadingText>
            </LoadingCard>
          ) : posts.length === 0 ? (
            <EmptyCard>
              <EmptyText>{feedLabels.noPosts}</EmptyText>
              <EmptySubtext>{feedLabels.noPostsSubtitle}</EmptySubtext>
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
                      {post.authorUsername === user?.username
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

                    {(post.isRepost ? post.originalPostImageUrl : post.imageUrl) && (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={post.isRepost ? post.originalPostImageUrl : post.imageUrl}
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

                    <PostActions>
                      <PostActionButton onClick={() => setCommentModalPost(post)}>
                        <MessageSquare size={16} />
                        <PostActionCount>{post.repliesCount || 0}</PostActionCount>
                      </PostActionButton>

                      {post.authorId !== user?.id && (
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setCommentModalPost(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--card-background, white)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {feedLabels.replyTo} @{commentModalPost.authorUsername}
              </h3>
              <button
                onClick={() => setCommentModalPost(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div
              style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: 'var(--hover-color, #f7f7f7)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                <strong>
                  {commentModalPost.authorDisplayName || commentModalPost.authorUsername}
                </strong>
                <span style={{ color: '#536471', marginLeft: '4px' }}>
                  @{commentModalPost.authorUsername}
                </span>
              </div>
              <div>{commentModalPost.content}</div>
            </div>

            {comments.length > 0 && (
              <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
                  {feedLabels.comments} ({comments.length})
                </h4>
                {comments.map((comment: Comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: 'var(--hover-color, #f7f7f7)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                      <strong>{comment.user.displayName || comment.user.username}</strong>
                      <span style={{ color: '#536471', marginLeft: '4px' }}>
                        @{comment.user.username}
                      </span>
                      <span style={{ color: '#536471', marginLeft: '8px', fontSize: '12px' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px' }}>{comment.content}</div>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={feedLabels.writeReply}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '16px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <PostButton
                onClick={() =>
                  commentMutation.mutate({ postId: commentModalPost.id, content: commentText })
                }
                disabled={!commentText.trim() || commentMutation.isPending}
                type="button"
              >
                {commentMutation.isPending ? feedLabels.replying : feedLabels.reply}
              </PostButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
