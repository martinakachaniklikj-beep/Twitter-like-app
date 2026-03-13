export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface FollowUser {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

export const followServices = {
  async fetchFollowers(token: string): Promise<FollowUser[]> {
    const res = await fetch(`${apiUrl}/users/me/followers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load followers');
    }

    return res.json();
  },

  async fetchFollowing(token: string): Promise<FollowUser[]> {
    const res = await fetch(`${apiUrl}/users/me/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load following');
    }

    return res.json();
  },
};

