export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export type NotificationKind = 'like' | 'comment' | 'follow' | 'system';

export interface ApiNotification {
  id: string;
  type: NotificationKind | string;
  message: string;
  createdAt: string;
  readAt: string | null;
}

export const notificationServices = {
  async fetchNotifications(token: string, type?: NotificationKind | 'all'): Promise<ApiNotification[]> {
    const params = new URLSearchParams();
    if (type && type !== 'all') {
      params.set('type', type);
    }

    const res = await fetch(`${apiUrl}/notifications${params.toString() ? `?${params.toString()}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load notifications');
    }

    return res.json();
  },

  async fetchUnreadCount(token: string): Promise<number> {
    const res = await fetch(`${apiUrl}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load notification unread count');
    }

    const data = await res.json();
    return typeof data.count === 'number' ? data.count : 0;
  },

  async markAllAsRead(token: string): Promise<void> {
    const res = await fetch(`${apiUrl}/notifications/mark-read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to mark notifications as read');
    }
  },

  async markOneAsRead(token: string, id: string): Promise<void> {
    const res = await fetch(`${apiUrl}/notifications/${id}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  async deleteOne(token: string, id: string): Promise<void> {
    const res = await fetch(`${apiUrl}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete notification');
    }
  },
};

