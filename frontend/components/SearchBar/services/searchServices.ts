import { SearchResult } from '../types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export const searchServices = {
  searchUsers: async (token: string, query: string): Promise<SearchResult[]> => {
    if (query.trim().length < 2) return [];

    const response = await fetch(
      `${apiUrl}/users/search?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },
};
