'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  FeedContainer,
  FeedSection,
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
  PostButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
} from '@/components/FeedTab/FeedTab.styles';
import type { Post } from '@/components/FeedTab/types';
import type { SavedCollection, SavedTabProps } from './types';
import { formatDate } from '@/components/FeedTab/utils/utils';
import { feedServices } from '@/components/FeedTab/services/feedServices';
import { Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SavedTab({ searchQuery = '' }: SavedTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [activeCollectionFilter, setActiveCollectionFilter] = useState<'all' | 'none' | string>(
    'all',
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isManagingCollection, setIsManagingCollection] = useState(false);
  const [collectionToManage, setCollectionToManage] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) {
        setSavedPosts([]);
        setCollections([]);
        return;
      }
      try {
        const token = await user.getIdToken();
        const posts = await feedServices.fetchSavedPosts(token);
        setSavedPosts(posts);
        const cols = await feedServices.fetchSavedCollections(token);
        setCollections(cols || []);
      } catch (error) {
        console.error('Failed to load saved posts', error);
        setSavedPosts([]);
        setCollections([]);
      }
    };
    void loadSaved();
  }, [user]);

  const handleToggleSave = async (post: Post) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const result = await feedServices.toggleSavedPost(token, post.id);
      if (!result.saved) {
        setSavedPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
    } catch (error) {
      console.error('Failed to remove saved post', error);
    }
  };

  const handleOpenManageCollection = (collection: { id: string; name: string }) => {
    setCollectionToManage(collection);
    setRenameValue(collection.name);
    setIsManagingCollection(true);
  };

  const handleRenameCollection = async () => {
    if (!user || !collectionToManage) return;
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === collectionToManage.name) {
      setIsManagingCollection(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const updated = await feedServices.renameSavedCollection(
        token,
        collectionToManage.id,
        trimmed,
      );

      setCollections((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, name: updated.name } : c)),
      );

      setSavedPosts((prev) =>
        prev.map((p) =>
          p.collectionName === collectionToManage.name ? { ...p, collectionName: updated.name } : p,
        ),
      );
    } catch (error) {
      console.error('Failed to rename collection', error);
    } finally {
      setIsManagingCollection(false);
      setCollectionToManage(null);
    }
  };

  const handleDeleteCollection = async () => {
    if (!user || !collectionToManage) return;

    const confirmed = window.confirm(
      'Delete this collection? Saved posts will remain but without a collection.',
    );
    if (!confirmed) return;

    try {
      const token = await user.getIdToken();
      await feedServices.deleteSavedCollection(token, collectionToManage.id);

      setCollections((prev) => prev.filter((c) => c.id !== collectionToManage.id));

      setSavedPosts((prev) =>
        prev.map((p) =>
          p.collectionName === collectionToManage.name ? { ...p, collectionName: null } : p,
        ),
      );

      if (activeCollectionFilter === collectionToManage.name) {
        setActiveCollectionFilter('all');
      }
    } catch (error) {
      console.error('Failed to delete collection', error);
    } finally {
      setIsManagingCollection(false);
      setCollectionToManage(null);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts =
    activeCollectionFilter === 'all'
      ? savedPosts
      : activeCollectionFilter === 'none'
        ? savedPosts.filter((p) => !p.collectionName)
        : savedPosts.filter((p) => p.collectionName === activeCollectionFilter);

  const searchFilteredPosts = !normalizedQuery.length
    ? filteredPosts
    : filteredPosts.filter((p) => {
        const content = (p.isRepost ? p.originalPostContent : p.content) || '';
        const author = (p.authorDisplayName || p.authorUsername || '').toString().toLowerCase();
        const collectionName = (p.collectionName || '').toString().toLowerCase();
        const haystack = `${content} ${author} ${collectionName}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });

  const hasPosts = searchFilteredPosts.length > 0;

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <div
          style={{
            width: isSidebarOpen ? '28%' : 40,
            maxWidth: isSidebarOpen ? 260 : 40,
            minWidth: isSidebarOpen ? 120 : 40,
            borderRight: '1px solid rgb(var(--border))',
            padding: '8px 4px 8px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            style={{
              alignSelf: isSidebarOpen ? 'flex-end' : 'center',
              width: 28,
              height: 28,
              borderRadius: '999px',
              border: '1px solid rgb(var(--border))',
              background: 'rgb(var(--background))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title={isSidebarOpen ? 'Collapse collections' : 'Expand collections'}
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {isSidebarOpen && (
            <>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: '0 2px',
                }}
              >
                Collections
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                  maxHeight: '100%',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveCollectionFilter('all')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '999px',
                    border:
                      activeCollectionFilter === 'all'
                        ? '2px solid var(--primary-color, #1d9bf0)'
                        : '1px solid rgb(var(--border))',
                    background:
                      activeCollectionFilter === 'all'
                        ? 'rgba(29, 155, 240, 0.08)'
                        : 'rgb(var(--background))',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                  }}
                >
                  All saved
                </button>

                {collections.map((collection) => {
                  const cover = collection.coverPost ?? null;
                  const imageSrc =
                    (cover?.isRepost ? cover.originalPostGifUrl : cover?.gifUrl) ||
                    (cover?.isRepost ? cover.originalPostImageUrl : cover?.imageUrl) ||
                    cover?.avatarUrl;

                  const isActive = activeCollectionFilter === collection.name;

                  return (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => setActiveCollectionFilter(collection.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 6px',
                        borderRadius: '12px',
                        border: isActive
                          ? '2px solid var(--primary-color, #1d9bf0)'
                          : '1px solid rgb(var(--border))',
                        background: isActive
                          ? 'rgba(29, 155, 240, 0.08)'
                          : 'rgb(var(--background))',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: 32,
                          height: 32,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #1d9bf0, #794bc4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={collection.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: '1rem',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          >
                            {collection.name[0]?.toUpperCase() ?? '#'}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                          }}
                        >
                          {collection.name}
                        </span>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenManageCollection(collection);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenManageCollection(collection);
                            }
                          }}
                          style={{
                            marginTop: 2,
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'rgb(var(--muted-foreground))',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Manage collection"
                        >
                          <MoreHorizontal size={14} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <FeedContainer style={{ flex: 1 }}>
          <FeedSection>
            {!hasPosts ? (
              <EmptyCard>
                <EmptyText>No saved posts yet</EmptyText>
                <EmptySubtext>
                  Tap the bookmark icon on any post in your feed to save it here for later.
                </EmptySubtext>
              </EmptyCard>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '12px',
                  padding: '8px 4px',
                  alignItems: 'start',
                }}
              >
                {searchFilteredPosts.map((post) => {
                  const mediaSrc =
                    (post.isRepost ? post.originalPostGifUrl : post.gifUrl) ||
                    (post.isRepost ? post.originalPostImageUrl : post.imageUrl);
                  const hasMedia = !!mediaSrc;

                  return (
                    <div
                      key={post.id}
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'rgb(var(--card))',
                        border: '1px solid rgb(var(--border))',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.08)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        ...(hasMedia
                          ? {}
                          : {
                              minHeight: 120,
                            }),
                      }}
                      title={post.isRepost ? post.originalPostContent || '' : post.content || ''}
                    >
                      {hasMedia && (
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            overflow: 'hidden',
                            background: 'rgba(15, 23, 42, 0.8)',
                            // square media area for Pinterest-like look
                            paddingBottom: '100%',
                          }}
                        >
                          <img
                            src={mediaSrc}
                            alt="Saved media"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                      <div
                        style={{
                          padding: '6px 8px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgb(var(--card))',
                          color: 'rgb(var(--foreground))',
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '999px',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {post.avatarUrl ? (
                            <img
                              src={post.avatarUrl}
                              alt={post.authorUsername}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              {(post.authorDisplayName || post.authorUsername)[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {post.authorDisplayName || post.authorUsername}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              opacity: 0.9,
                              display: '-webkit-box',
                              WebkitLineClamp: hasMedia ? 2 : 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {post.isRepost ? post.originalPostContent : post.content}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </FeedSection>
        </FeedContainer>
      </div>

      {isManagingCollection && collectionToManage && (
        <ModalOverlay
          onClick={() => {
            setIsManagingCollection(false);
            setCollectionToManage(null);
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Manage collection</ModalTitle>
              <ModalCloseButton
                onClick={() => {
                  setIsManagingCollection(false);
                  setCollectionToManage(null);
                }}
              >
                <MoreHorizontal size={20} />
              </ModalCloseButton>
            </ModalHeader>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label
                  htmlFor="collection-name"
                  style={{ fontSize: '0.8rem', color: 'rgb(var(--muted-foreground))' }}
                >
                  Collection name
                </label>
                <input
                  id="collection-name"
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid rgb(var(--input))',
                    background: 'rgb(var(--background))',
                    color: 'rgb(var(--foreground))',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleDeleteCollection}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  background: 'rgba(239, 68, 68, 0.06)',
                  color: 'rgb(239, 68, 68)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Delete collection
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsManagingCollection(false);
                  setCollectionToManage(null);
                }}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '999px',
                  border: '1px solid rgb(var(--border))',
                  background: 'rgb(var(--background))',
                  color: 'rgb(var(--foreground))',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <PostButton
                type="button"
                onClick={handleRenameCollection}
                disabled={!renameValue.trim()}
              >
                Save changes
              </PostButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
