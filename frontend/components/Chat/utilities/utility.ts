import type { ChatAttachment, MessageContentPayload } from "../types";
import type { ConversationListItem } from "@/services/chatServices";

export function parseMessageContent(
  content: string
): { text: string; attachments?: ChatAttachment[] } {
  try {
    const parsed = JSON.parse(content) as MessageContentPayload;
    if (parsed && typeof parsed === "object") {
      const text = typeof parsed.text === "string" ? parsed.text : "";
      const attachments = Array.isArray(parsed.attachments) ? parsed.attachments : undefined;
      if (text || attachments?.length) {
        return { text, attachments };
      }
    }
  } catch {
    // fallback to raw content
  }
  return { text: content };
}

export function getConversationDisplayName(
  conv: ConversationListItem,
  currentUserId: string | undefined
): string {
  const otherParticipants = conv.participants.filter((p) => p.userId !== currentUserId);

  if (conv.type === "group") {
    if (otherParticipants.length === 0) return "Group";
    if (otherParticipants.length === 1) {
      return otherParticipants[0].displayName || otherParticipants[0].username;
    }
    return otherParticipants
      .slice(0, 3)
      .map((p) => p.displayName || p.username)
      .join(", ");
  }

  const other = otherParticipants[0];
  return other?.displayName || other?.username || "Unknown";
}

export function getLastMessagePreview(content?: string): string {
  if (!content) return "No messages yet";

  const { text, attachments } = parseMessageContent(content);

  if (text) return text;

  if (attachments?.length) {
    const first = attachments[0];
    if (first.type.startsWith("image/")) {
      return attachments.length > 1 ? `${attachments.length} photos` : "Photo";
    }
    if (first.type.startsWith("video/")) {
      return attachments.length > 1 ? `${attachments.length} videos` : "Video";
    }
    return attachments.length > 1 ? `${attachments.length} files` : "File";
  }

  return "No messages yet";
}

export function formatMessageTime(createdAt: string | undefined): string | undefined {
  if (!createdAt) return undefined;
  return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}
