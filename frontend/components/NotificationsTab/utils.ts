import type { ApiNotification } from '@/services/notificationServices';
import type { Filter } from './types';

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'like', label: 'Likes' },
  { id: 'comment', label: 'Comments' },
  { id: 'follow', label: 'Follows' },
  { id: 'system', label: 'System' },
];

export function formatDateTime(value: string): string {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function parseGroupInvite(notification: ApiNotification) {
  if (notification.type !== 'system') return null;
  if (!notification.message.startsWith('GROUP_INVITE|')) return null;
  const parts = notification.message.split('|');
  if (parts.length < 5) return null;
  const [, inviteId, conversationId, groupName, actorName] = parts;
  return { inviteId, conversationId, groupName, actorName };
}

