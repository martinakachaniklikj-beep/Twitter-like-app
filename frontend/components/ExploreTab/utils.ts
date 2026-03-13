import type { ExploreHistoryItem } from './types';

export const HISTORY_KEY = 'twitter-like-explore-history';

export const buildHistoryKey = (userId?: string | null) =>
  userId ? `${HISTORY_KEY}:${userId}` : HISTORY_KEY;

export function parseHistory(raw: string | null): ExploreHistoryItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ExploreHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildNextHistory(
  previous: ExploreHistoryItem[],
  user: ExploreHistoryItem,
  maxEntries = 25,
): ExploreHistoryItem[] {
  return [user, ...previous.filter((u) => u.id !== user.id)].slice(0, maxEntries);
}

