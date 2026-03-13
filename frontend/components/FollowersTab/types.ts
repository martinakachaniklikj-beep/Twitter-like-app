import type { FollowUser } from '@/services/followServices';

export type FollowersMode = 'following' | 'followers' | 'notFollowingBack';

export interface FollowersTabProps {
  searchQuery?: string;
}

export type FollowersList = FollowUser[];
