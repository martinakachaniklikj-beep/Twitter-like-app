"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { chatServices } from "@/services/chatServices";
import SearchBar from "@/components/SearchBar/SearchBar";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useChat, parseMessageContent } from "./use-chat";

export function ChatContainer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newChatError, setNewChatError] = useState<string | null>(null);

  const startChatMutation = useMutation({
    mutationFn: async (username: string) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Not logged in");
      const other = await chatServices.getUserByUsername(token, username.trim());
      if (!other) throw new Error("User not found");
      return chatServices.getOrCreateDirect(token, other.id);
    },
    onSuccess: (conv) => {
      setSelectedConversationId(conv.id);
      setNewChatError(null);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (err: Error) => {
      setNewChatError(err.message);
    },
  });

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) return [];
      return chatServices.listConversations(token);
    },
    enabled: !!user,
  });

  const {
    messages,
    sendMessage,
    loadMore,
    currentUserId,
    loading: messagesLoading,
    loadingMore,
  } = useChat(selectedConversationId);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p.userId !== user?.uid
  );

  return (
    <div className="flex flex-1 min-h-0">
      <aside className="w-64 sm:w-72 border-r border-border flex flex-col flex-shrink-0">
        <div className="p-4 font-bold text-lg border-b border-border">Messages</div>
        <div className="p-3 border-b border-border">
          <SearchBar
            onUserSelect={(userResult) => {
              setNewChatError(null);
              startChatMutation.mutate(userResult.username);
            }}
          />
          {newChatError && (
            <div className="mt-2 text-sm text-destructive">{newChatError}</div>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {conversationsLoading ? (
            <div className="p-4 text-muted-foreground text-sm">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm">No conversations yet.</div>
          ) : (
            conversations.map((conv) => {
              const other = conv.participants.find((p) => p.userId !== user?.uid);
              const name = other?.displayName || other?.username || "Unknown";

              let last = "No messages yet";
              if (conv.lastMessage?.content) {
                const { text, attachments } = parseMessageContent(conv.lastMessage.content);
                if (text) {
                  last = text;
                } else if (attachments && attachments.length > 0) {
                  const first = attachments[0];
                  if (first.type.startsWith("image/")) {
                    last = attachments.length > 1 ? `${attachments.length} photos` : "Photo";
                  } else if (first.type.startsWith("video/")) {
                    last = attachments.length > 1 ? `${attachments.length} videos` : "Video";
                  } else {
                    last = attachments.length > 1 ? `${attachments.length} files` : "File";
                  }
                }
              }

              const isSelected = conv.id === selectedConversationId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                    isSelected ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium truncate">{name}</div>
                  <div className="text-sm text-muted-foreground truncate">{last}</div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {selectedConversationId ? (
          <>
            <ChatHeader
              name={otherParticipant?.displayName || otherParticipant?.username || "Chat"}
              avatarUrl={otherParticipant?.avatarUrl ?? undefined}
            />
            <MessageList
              messages={messages}
              onLoadMore={loadMore}
              currentUserId={currentUserId}
              loading={messagesLoading}
              loadingMore={loadingMore}
            />
            <ChatInput onSend={sendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation or start a new chat.
          </div>
        )}
      </div>
    </div>
  );
}
