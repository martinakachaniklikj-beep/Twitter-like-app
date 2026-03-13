import type { FollowersList, FollowersMode } from './types';

export function computeNotFollowingBack(
  following: FollowersList,
  followers: FollowersList,
): FollowersList {
  if (!following.length || !followers.length) return [];
  const followerIds = new Set(followers.map((f) => f.id));
  return following.filter((f) => !followerIds.has(f.id));
}

export function selectActiveList(
  mode: FollowersMode,
  followers: FollowersList,
  following: FollowersList,
  notFollowingBack: FollowersList,
): FollowersList {
  if (mode === 'followers') return followers;
  if (mode === 'following') return following;
  return notFollowingBack;
}

export function filterFollowersByQuery(list: FollowersList, rawQuery: string): FollowersList {
  const normalizedQuery = rawQuery.trim().toLowerCase();
  if (!normalizedQuery.length) return list;

  return list.filter((u) => {
    const username = u.username.toLowerCase();
    const displayName = (u.displayName ?? '').toLowerCase();
    const bio = (u.bio ?? '').toLowerCase();
    return (
      username.includes(normalizedQuery) ||
      displayName.includes(normalizedQuery) ||
      bio.includes(normalizedQuery)
    );
  });
}

