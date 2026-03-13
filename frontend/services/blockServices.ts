const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface BlockedUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  blockedAt: string;
}

export const blockServices = {
  async blockUser(token: string, userId: string): Promise<void> {
    const res = await fetch(`${apiUrl}/blocks/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to block user');
    }
  },

  async fetchBlockedUsers(token: string): Promise<BlockedUser[]> {
    const res = await fetch(`${apiUrl}/blocks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load blocked users');
    }

    return res.json();
  },

  async unblockUser(token: string, userId: string): Promise<void> {
    const res = await fetch(`${apiUrl}/blocks/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to unblock user');
    }
  },
};

