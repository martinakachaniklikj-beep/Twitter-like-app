'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { followServices } from '@/services/followServices';
import { FeedTabsRow, FeedTabButton } from '@/components/FeedTab/FeedTab.styles';
import type { FollowersList, FollowersMode, FollowersTabProps } from './types';
import {
  computeNotFollowingBack,
  filterFollowersByQuery,
  selectActiveList,
} from './utils';

export default function FollowersTab({ searchQuery = '' }: FollowersTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<FollowersMode>('following');

  const { data: followers = [], isLoading: followersLoading } = useQuery<FollowersList>({
    queryKey: ['followers', 'me'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return followServices.fetchFollowers(token);
    },
    enabled: !!user,
  });

  const { data: following = [], isLoading: followingLoading } = useQuery<FollowersList>({
    queryKey: ['following', 'me'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return followServices.fetchFollowing(token);
    },
    enabled: !!user,
  });

  const notFollowingBack = useMemo(
    () => computeNotFollowingBack(following, followers),
    [following, followers],
  );

  const activeList = selectActiveList(mode, followers, following, notFollowingBack);

  const filteredList = filterFollowersByQuery(activeList, searchQuery);

  const isLoading = followersLoading || followingLoading;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="px-1 text-lg font-semibold">Followers</h2>

      <FeedTabsRow>
        <FeedTabButton
          $active={mode === 'following'}
          type="button"
          onClick={() => setMode('following')}
        >
          Following
        </FeedTabButton>
        <FeedTabButton
          $active={mode === 'followers'}
          type="button"
          onClick={() => setMode('followers')}
        >
          Followers
        </FeedTabButton>
        <FeedTabButton
          $active={mode === 'notFollowingBack'}
          type="button"
          onClick={() => setMode('notFollowingBack')}
        >
          Not following back
        </FeedTabButton>
      </FeedTabsRow>

      {isLoading && (
        <div className="text-sm text-muted-foreground py-8 text-center">Loading followers…</div>
      )}

      {!isLoading && filteredList.length === 0 && (
        <div className="text-sm text-muted-foreground py-8 text-center">
          {mode === 'following'
            ? 'You are not following anyone yet.'
            : mode === 'followers'
              ? 'No one follows you yet.'
              : 'Everyone you follow follows you back.'}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {filteredList.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2"
          >
            <button
              type="button"
              onClick={() => router.push(`/profile/${u.username}`)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary overflow-hidden">
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.avatarUrl}
                    alt={u.username}
                    style={{ width: '100%', height: '100%', borderRadius: '9999px', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{(u.displayName || u.username)[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {u.displayName || u.username}
                </span>
                <span className="text-xs text-muted-foreground">@{u.username}</span>
                {u.bio && (
                  <span className="mt-1 line-clamp-2 text-xs text-muted-foreground/90">
                    {u.bio}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

