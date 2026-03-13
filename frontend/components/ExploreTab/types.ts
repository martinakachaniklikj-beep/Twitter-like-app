import type { SearchResult } from '@/components/SearchBar/types';

export type ExploreHistoryItem = SearchResult & {
  historyId: string;
};

