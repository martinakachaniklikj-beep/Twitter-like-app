export type ChatAttachment = {
  url: string;
  type: string;
  name: string;
  size: number;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  status?: "sending" | "sent" | "delivered" | "read";
  attachments?: ChatAttachment[];
};

export type ChatTheme = "standard" | "love" | "friends";

export type ChatType = "direct" | "group";

export interface ChatContainerState {
  selectedConversationId: string | null;
  newChatError: string | null;
  isSidebarCollapsed: boolean;
  isGroupDialogOpen: boolean;
}

export interface ChatThemeMap {
  [conversationId: string]: ChatTheme;
}

export interface MutedConversationMap {
  [conversationId: string]: boolean;
}

export interface DismissedWarningsMap {
  [conversationId: string]: boolean;
}

export interface Participant {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ChatHeaderProps {
  name: string;
  avatarUrl?: string;
  theme: ChatTheme;
  onThemeChange: (theme: ChatTheme) => void;
  muted: boolean;
  onToggleMute: () => void;
  type: ChatType;
  participants: Participant[];
  currentUserId?: string;
  onLeaveGroup?: () => void;
  leavingGroup?: boolean;
}

export interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  conversationId?: string | null;
}

export interface MessageBubbleProps {
  message: string;
  attachments?: ChatAttachment[];
  avatar?: string;
  isOwn?: boolean;
  createdAt?: string;
  status?: Message["status"];
  theme?: ChatTheme;
}

export interface MessageListProps {
  messages: Message[];
  onLoadMore: () => void;
  currentUserId?: string;
  loading?: boolean;
  loadingMore?: boolean;
  otherAvatarUrl?: string;
  theme?: ChatTheme;
  onUserInteraction?: () => void;
}

export type MessageContentPayload = {
  text?: string;
  attachments?: ChatAttachment[];
};

export interface GroupChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (conversation: { id: string }) => void;
}
