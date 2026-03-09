const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export const feedServices = {
  async fetchFeed(
    token: string,
    page: number = 1,
    limit: number = 10,
    type: 'for_you' | 'following' = 'for_you',
  ) {
    const response = await fetch(
      `${apiUrl}/posts/feed?page=${page}&limit=${limit}&type=${type}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error('Failed to load feed');
    return response.json();
  },

  async createPost(token: string, content: string, imageUrl?: string, gifUrl?: string) {
    const response = await fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, imageUrl, gifUrl }),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  async likePost(token: string, postId: string) {
    const response = await fetch(`${apiUrl}/likes/${postId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to like post');
    return response.json();
  },

  async unlikePost(token: string, postId: string) {
    const response = await fetch(`${apiUrl}/likes/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to unlike post');
    return response.json();
  },

  async fetchComments(token: string, postId: string) {
    const response = await fetch(`${apiUrl}/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    return response.json();
  },

  async createComment(token: string, postId: string, content: string) {
    const response = await fetch(`${apiUrl}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  async repostPost(
    token: string,
    postId: string,
    content?: string,
    imageUrl?: string,
    gifUrl?: string,
  ) {
    const response = await fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ originalPostId: postId, content, imageUrl, gifUrl }),
    });
    if (!response.ok) throw new Error('Failed to repost');
    return response.json();
  },

  async unrepostPost(token: string, originalPostId: string) {
    const response = await fetch(`${apiUrl}/posts/unrepost/${originalPostId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to unrepost');
  },
};
