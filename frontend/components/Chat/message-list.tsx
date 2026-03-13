import { useEffect, useMemo, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message, MessageListProps } from "./types";
import { MessageBubble } from "./message-bubble";
import {
  ScrollAreaWrap,
  LoadingState,
  LoadingMore,
  MessagesInner,
  SystemMessage,
} from "./message-list.styled";

export function MessageList({
  messages,
  onLoadMore,
  currentUserId,
  loading,
  loadingMore,
  otherAvatarUrl,
  theme,
  onUserInteraction,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const uniqueMessages = useMemo(() => {
    const seen = new Set<string>();
    return messages.filter((m: Message) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    if (!loading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [uniqueMessages.length, loading]);

  if (loading) {
    return (
      <LoadingState>
        Loading messages...
      </LoadingState>
    );
  }

  return (
    <ScrollAreaWrap>
      <ScrollArea
        style={{ flex: 1, minHeight: 0 }}
        onClick={onUserInteraction}
        onWheelCapture={onUserInteraction}
        onTouchMove={onUserInteraction}
      >
      {loadingMore && (
        <LoadingMore>Loading older messages...</LoadingMore>
      )}
      <MessagesInner>
        {uniqueMessages.map((msg) => {
          if (msg.text.startsWith("SYSTEM:USER_JOINED|")) {
            const name = msg.text.split("|")[1] || "Someone";
            return (
              <SystemMessage key={msg.id}>
                {name} joined the chat
              </SystemMessage>
            );
          }
          return (
            <MessageBubble
              key={msg.id}
              message={msg.text}
              attachments={msg.attachments}
              createdAt={msg.createdAt}
              status={msg.status}
              isOwn={currentUserId ? msg.senderId === currentUserId : undefined}
              avatar={otherAvatarUrl}
              theme={theme}
            />
          );
        })}
        <div ref={bottomRef} />
      </MessagesInner>
      </ScrollArea>
    </ScrollAreaWrap>
  );
}
