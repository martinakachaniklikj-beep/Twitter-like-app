import type { NotificationKind } from '@/services/notificationServices';

export type Filter = 'all' | NotificationKind;

export interface NotificationsTabProps {
  searchQuery?: string;
  onCompose?: (prefill: string) => void;
}
