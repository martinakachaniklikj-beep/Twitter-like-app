const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface TrendingHashtag {
  id: string;
  name: string;
  postsCount: number;
}

export interface HashtagPostsResponse<TPost = unknown> {
  data: TPost[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const hashtagServices = {
  async fetchTrending(
    token: string,
    limit = 10,
    days = 1,
    scope: 'global' | 'country' = 'global',
  ): Promise<TrendingHashtag[]> {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('days', String(days));
    if (scope) {
      params.set('scope', scope);
    }

    const response = await fetch(`${apiUrl}/hashtags/trending?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load trending hashtags');
    }

    return response.json();
  },

  async fetchPostsByHashtag<TPost = unknown>(
    token: string,
    hashtag: string,
    page = 1,
    limit = 10,
  ): Promise<HashtagPostsResponse<TPost>> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    const encoded = encodeURIComponent(hashtag.replace(/^#/, ''));

    const response = await fetch(`${apiUrl}/posts/by-hashtag/${encoded}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load posts for hashtag');
    }

    return response.json();
  },
};
