const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface ConversationListItem {
  id: string;
  type: string;
  updatedAt: string;
  participants: {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  }[];
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  hasUnread?: boolean;
  isBlocked?: boolean;
  blockedByMe?: boolean;
  blockedByOther?: boolean;
  hasBlockedParticipants?: boolean;
}

export interface Conversation {
  id: string;
  type: string;
  updatedAt: string;
  participants: {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  }[];
  isBlocked?: boolean;
  blockedByMe?: boolean;
  blockedByOther?: boolean;
  hasBlockedParticipants?: boolean;
}

export interface GroupInvitePayload {
  ok: boolean;
  status?: 'accepted' | 'declined';
}

export interface ApiMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: string;
  createdAt: string;
  sender: { id: string; username: string; displayName: string | null; avatarUrl: string | null };
}

export interface UserByUsername {
  id: string;
  username: string;
  displayName?: string | null;
}

export interface UnreadSummary {
  totalUnreadConversations: number;
  totalUnreadMessages: number;
}

export const chatServices = {
  async getUserByUsername(token: string, username: string): Promise<UserByUsername | null> {
    const res = await fetch(`${apiUrl}/users/${encodeURIComponent(username)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.id
      ? { id: data.id, username: data.username, displayName: data.displayName }
      : null;
  },

  async listConversations(token: string): Promise<ConversationListItem[]> {
    const res = await fetch(`${apiUrl}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load conversations');
    return res.json();
  },

  async getConversation(token: string, conversationId: string): Promise<Conversation> {
    const res = await fetch(`${apiUrl}/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load conversation');
    return res.json();
  },

  async getOrCreateDirect(token: string, otherUserId: string): Promise<Conversation> {
    const res = await fetch(`${apiUrl}/conversations/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otherUserId }),
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  },

  async createGroup(token: string, memberUserIds: string[], name?: string): Promise<Conversation> {
    const res = await fetch(`${apiUrl}/conversations/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberUserIds, name }),
    });
    if (!res.ok) throw new Error('Failed to create group conversation');
    return res.json();
  },

  async respondToGroupInvite(
    token: string,
    inviteId: string,
    action: 'accept' | 'deny',
  ): Promise<GroupInvitePayload> {
    const res = await fetch(`${apiUrl}/conversations/group-invites/${inviteId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Failed to respond to group invite');
    return res.json();
  },

  async markConversationRead(token: string, conversationId: string): Promise<void> {
    const res = await fetch(`${apiUrl}/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to mark conversation as read');
    }
  },

  async getMessages(
    token: string,
    conversationId: string,
    before?: string,
    limit = 50,
  ): Promise<ApiMessage[]> {
    const params = new URLSearchParams();
    if (before) params.set('before', before);
    params.set('limit', String(limit));
    const res = await fetch(`${apiUrl}/conversations/${conversationId}/messages?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  },

  async getUnreadSummary(token: string): Promise<UnreadSummary> {
    const res = await fetch(`${apiUrl}/conversations/unread/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load unread summary');
    return res.json();
  },

  async leaveGroup(token: string, conversationId: string): Promise<void> {
    const res = await fetch(`${apiUrl}/conversations/${conversationId}/leave`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to leave group conversation');
    }
  },
};
