import { UserProfile, UpdateProfileForm, Post } from '../types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export const profileServices = {
  async fetchProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${apiUrl}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to load profile');
    return response.json();
  },

  async fetchUserPosts(token: string, username: string): Promise<Post[]> {
    const response = await fetch(`${apiUrl}/posts/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to load posts');
    return response.json();
  },

  async updateProfile(token: string, data: UpdateProfileForm): Promise<UserProfile> {
    const response = await fetch(`${apiUrl}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
};
