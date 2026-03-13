import type { Post } from '@/components/FeedTab/types';

export interface SavedCollection {
  id: string;
  name: string;
  coverPost?: Post | null;
}

export interface SavedTabProps {
  searchQuery?: string;
}

