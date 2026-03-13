'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { feedServices } from '@/components/FeedTab/services/feedServices';
import { followServices, type FollowUser } from '@/services/followServices';

type SuggestedUser = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  location?: string | null;
  followersCount?: number | null;
};

const ROTATION_INTERVAL_MS = 5500;

export function SuggestedFollowersCard() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: rawSuggestions = [],
    isLoading: suggestionsLoading,
    isError,
  } = useQuery<SuggestedUser[]>({
    queryKey: ['suggested-followers'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      // Leverage the existing mentions suggestion endpoint, which already
      // respects mutual followers and blocking rules, as a good basis
      // for "people you may want to follow".
      return feedServices.fetchMentionSuggestions(token, '');
    },
    enabled: !!user,
  });

  const { data: following = [], isLoading: followingLoading } = useQuery<FollowUser[]>({
    queryKey: ['following', 'me', 'for-suggestions'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return followServices.fetchFollowing(token);
    },
    enabled: !!user,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    // Kitty Bot is a product bot, not a real user,
    // so we never want to show it in "Suggested to follow".
    const base = rawSuggestions.filter(
      (u) => u.id !== 'kitty-bot' && u.username.toLowerCase() !== 'kittybot',
    );

    if (!base.length) return [];

    const followingIds = new Set(following.map((f) => f.id));
    const currentUserId = user?.uid;

    const scored = base
      .filter((u) => !followingIds.has(u.id) && u.id !== currentUserId)
      .map((u) => {
        const score = (u.followersCount ?? 0) * 2 + (u.location ? 5 : 0);
        return { user: u, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.user).slice(0, 10);
  }, [rawSuggestions, following, user?.uid]);

  const hasSuggestions = suggestions.length > 0;
  const isLoading = suggestionsLoading || followingLoading;

  useEffect(() => {
    if (!hasSuggestions) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [hasSuggestions, suggestions.length]);

  useEffect(() => {
    if (activeIndex >= suggestions.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, suggestions.length]);

  const currentSuggestion = suggestions[activeIndex];

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.95rem 1rem',
        borderRadius: '1rem',
        border: '1px solid rgba(var(--border), 0.7)',
        background: 'rgba(var(--card), 0.98)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          marginBottom: '0.6rem',
        }}
      >
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'rgb(var(--foreground))',
          }}
        >
          Suggested to follow
        </span>
        <span
          style={{
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          Based on your followers, activity and interests.
        </span>
      </div>

      {isLoading && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          Loading suggestions...
        </p>
      )}

      {isError && !isLoading && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          We couldn&apos;t load suggestions right now.
        </p>
      )}

      {!isLoading && !isError && !hasSuggestions && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          No suggestions yet. Interact with more posts and people to get better recommendations.
        </p>
      )}

      {!isLoading && !isError && hasSuggestions && currentSuggestion && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <button
            type="button"
            onClick={() => router.push(`/profile/${currentSuggestion.username}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: '999px',
                background: 'rgb(var(--accent))',
                overflow: 'hidden',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'rgb(var(--primary))',
              }}
            >
              {currentSuggestion.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentSuggestion.avatarUrl}
                  alt={currentSuggestion.username}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '999px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>
                  {(currentSuggestion.displayName || currentSuggestion.username)[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.05rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'rgb(var(--foreground))',
                }}
              >
                {currentSuggestion.displayName || currentSuggestion.username}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'rgb(var(--muted-foreground))',
                }}
              >
                @{currentSuggestion.username}
              </span>
              {currentSuggestion.location && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgb(var(--muted-foreground))',
                  }}
                >
                  {currentSuggestion.location}
                </span>
              )}
            </div>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginTop: '0.1rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'rgb(var(--muted-foreground))',
              }}
            >
              Suggested for you · {activeIndex + 1} of {suggestions.length}
            </span>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {suggestions.map((u, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={u.username}
                    style={{
                      width: isActive ? '0.8rem' : '0.5rem',
                      height: '0.3rem',
                      borderRadius: '999px',
                      border: 'none',
                      background: isActive
                        ? 'rgb(var(--primary))'
                        : 'rgba(var(--muted-foreground), 0.4)',
                      opacity: isActive ? 1 : 0.55,
                      transition: 'all 150ms ease-out',
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
