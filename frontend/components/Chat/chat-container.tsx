"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { chatServices, type ConversationListItem } from "@/services/chatServices";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useChat } from "./use-chat";
import { GroupChatDialog } from "./GroupChatDialog";
import { ChatTheme } from "./types";
import {
  getConversationDisplayName,
  getLastMessagePreview,
  shuffleArray,
} from "./utilities/utility";
import {
  Container,
  ExpandSidebarButton,
  ExpandButtonInner,
  ExpandButtonUnreadDot,
  Sidebar,
  SidebarHeader,
  SidebarHeaderActions,
  IconButton,
  SearchWrap,
  ErrorText,
  ConversationList,
  ConversationListMessage,
  ConversationItem,
  ConversationItemInner,
  AvatarGroupWrap,
  GroupAvatarLeft,
  GroupAvatarRight,
  ConversationItemContent,
  ConversationItemName,
  ConversationItemPreview,
  UnreadDot,
  ChatArea,
  ThemeArea,
  BlockedBanner,
  BlockedBannerDismiss,
  TypingIndicator,
  TypingDot,
  DirectBlockedMessage,
  EmptyState,
} from "./chat-container.styled";
import { CHAT_LABELS } from "./types";

export function ChatContainer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newChatError, setNewChatError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

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
    isOtherTyping,
    markMessagesReadOptimistic,
  } = useChat(selectedConversationId);

  const leaveGroupMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Not logged in");
      await chatServices.leaveGroup(token, conversationId);
    },
    onSuccess: (_data, conversationId) => {
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const markConversationReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Not logged in");
      await chatServices.markConversationRead(token, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleMarkReadInteraction = () => {
    if (!selectedConversationId || !user) return;

    const conv = conversations.find((c) => c.id === selectedConversationId);
    // If there is no matching conversation or it is already marked as read, skip
    if (!conv || !conv.hasUnread) return;

    // Avoid spamming the API if a request is already in flight
    if (markConversationReadMutation.isPending) return;

    // Optimistically update message statuses locally
    markMessagesReadOptimistic();

    // Optimistically clear unread badge/tint in the sidebar
    queryClient.setQueryData<ConversationListItem[] | undefined>(
      ["conversations"],
      (existing) =>
        existing?.map((conv) =>
          conv.id === selectedConversationId ? { ...conv, hasUnread: false } : conv
        ) ?? existing
    );

    // Fire-and-forget server update
    markConversationReadMutation.mutate(selectedConversationId);
  };

  useEffect(() => {
    if (!selectedConversationId || !user) return;
    handleMarkReadInteraction();
  }, [selectedConversationId, user?.uid]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p.userId !== user?.uid
  );

  const isDirectBlocked =
    !!selectedConversation &&
    selectedConversation.type === "direct" &&
    !!selectedConversation.isBlocked;

  const hasBlockedParticipantsInGroup =
    !!selectedConversation &&
    selectedConversation.type === "group" &&
    !!selectedConversation.hasBlockedParticipants;

  const [chatThemes, setChatThemes] = useState<Record<string, ChatTheme>>({});
  const [mutedConversations, setMutedConversations] = useState<Record<string, boolean>>({});
  const [dismissedGroupWarnings, setDismissedGroupWarnings] = useState<Record<string, boolean>>(
    {},
  );

  const hasAnyUnread = conversations.some((c) => c.hasUnread);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedThemes = window.localStorage.getItem("chatThemes");
      const storedMuted = window.localStorage.getItem("mutedConversations");
      if (storedThemes) {
        setChatThemes(JSON.parse(storedThemes));
      }
      if (storedMuted) {
        setMutedConversations(JSON.parse(storedMuted));
      }
    } catch {
      // ignore JSON/localStorage errors
    }
  }, []);

  const currentTheme: ChatTheme =
    selectedConversationId && chatThemes[selectedConversationId]
      ? chatThemes[selectedConversationId]
      : "standard";

  const isMuted = selectedConversationId ? !!mutedConversations[selectedConversationId] : false;

  const handleThemeChange = (theme: ChatTheme) => {
    if (!selectedConversationId) return;
    setChatThemes((prev) => {
      const next = { ...prev, [selectedConversationId]: theme };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("chatThemes", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleToggleMute = () => {
    if (!selectedConversationId) return;
    setMutedConversations((prev) => {
      const next = { ...prev, [selectedConversationId]: !prev[selectedConversationId] };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("mutedConversations", JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <Container>
      {isSidebarCollapsed && (
        <ExpandSidebarButton
          type="button"
          aria-label="Expand chat sidebar"
          onClick={() => setIsSidebarCollapsed(false)}
        >
          <ExpandButtonInner>
            <span>&gt;</span>
            {hasAnyUnread && <ExpandButtonUnreadDot />}
          </ExpandButtonInner>
        </ExpandSidebarButton>
      )}

      {!isSidebarCollapsed && (
        <Sidebar>
          <SidebarHeader>
            <span>{CHAT_LABELS.messages}</span>
            <SidebarHeaderActions>
              <IconButton
                type="button"
                aria-label="Collapse chat sidebar"
                onClick={() => setIsSidebarCollapsed(true)}
              >
                &lt;
              </IconButton>
              <IconButton
                type="button"
                aria-label="New group chat"
                onClick={() => {
                  if (!user) {
                    setNewChatError("You must be logged in to create a group.");
                    return;
                  }
                  setIsGroupDialogOpen(true);
                }}
              >
                <UserPlus size={16} />
              </IconButton>
            </SidebarHeaderActions>
          </SidebarHeader>
          <SearchWrap>
            <SearchBar
              onUserSelect={(userResult) => {
                setNewChatError(null);
                startChatMutation.mutate(userResult.username);
              }}
            />
            {newChatError && <ErrorText>{newChatError}</ErrorText>}
          </SearchWrap>
          <ConversationList>
          {conversationsLoading ? (
            <ConversationListMessage>{CHAT_LABELS.loading}</ConversationListMessage>
          ) : conversations.length === 0 ? (
            <ConversationListMessage>{CHAT_LABELS.noConversations}</ConversationListMessage>
          ) : (
            conversations.map((conv) => {
              const isDirect = conv.type === "direct";
              const isGroup = conv.type === "group";
              const otherParticipants = conv.participants.filter((p) => p.userId !== user?.uid);
              const displayName = getConversationDisplayName(conv, user?.uid);
              const isBlocked = isDirect && !!conv.isBlocked;
              const groupAvatarCandidates =
                otherParticipants.length <= 2
                  ? otherParticipants
                  : shuffleArray(otherParticipants).slice(0, 2);
              const primaryGroupUser = groupAvatarCandidates[0];
              const secondaryGroupUser = groupAvatarCandidates[1];
              const directAvatarUser = otherParticipants[0];
              const avatarUrl = isBlocked
                ? undefined
                : (directAvatarUser?.avatarUrl as string | undefined);
              const last = getLastMessagePreview(conv.lastMessage?.content);
              const isSelected = conv.id === selectedConversationId;
              const hasUnread = !!conv.hasUnread;

              return (
                <ConversationItem
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conv.id)}
                  $selected={isSelected}
                  $hasUnread={hasUnread && !isSelected}
                >
                  <ConversationItemInner>
                    {isGroup ? (
                      <AvatarGroupWrap>
                        <GroupAvatarLeft>
                          <Avatar style={{ width: "100%", height: "100%" }}>
                            <AvatarImage
                              src={(primaryGroupUser?.avatarUrl as string | undefined) ?? undefined}
                              alt={primaryGroupUser?.displayName || primaryGroupUser?.username || "User"}
                            />
                          </Avatar>
                        </GroupAvatarLeft>
                        {secondaryGroupUser && (
                          <GroupAvatarRight>
                            <Avatar style={{ width: "100%", height: "100%" }}>
                              <AvatarImage
                                src={(secondaryGroupUser.avatarUrl as string | undefined) ?? undefined}
                                alt={
                                  secondaryGroupUser.displayName ||
                                  secondaryGroupUser.username ||
                                  "User"
                                }
                              />
                            </Avatar>
                          </GroupAvatarRight>
                        )}
                      </AvatarGroupWrap>
                    ) : (
                      <Avatar style={{ width: "2.25rem", height: "2.25rem" }}>
                        <AvatarImage src={avatarUrl} alt={displayName} />
                      </Avatar>
                    )}
                    <ConversationItemContent>
                      <ConversationItemName $hasUnread={hasUnread}>
                        {displayName}
                      </ConversationItemName>
                      <ConversationItemPreview $hasUnread={hasUnread}>
                        {last}
                      </ConversationItemPreview>
                    </ConversationItemContent>
                    {hasUnread && <UnreadDot />}
                  </ConversationItemInner>
                </ConversationItem>
              );
            })
          )}
          </ConversationList>
        </Sidebar>
      )}

      <ChatArea>
        {selectedConversationId ? (
          <>
            <ChatHeader
              name={
                selectedConversation?.type === "group"
                  ? getConversationDisplayName(selectedConversation, user?.uid)
                  : otherParticipant?.displayName || otherParticipant?.username || "Chat"
              }
              avatarUrl={
                selectedConversation?.type === "group"
                  ? undefined
                  : isDirectBlocked
                  ? undefined
                  : otherParticipant?.avatarUrl ?? undefined
              }
              type={selectedConversation?.type === "group" ? "group" : "direct"}
              participants={selectedConversation?.participants ?? []}
              currentUserId={user?.uid}
              theme={currentTheme}
              onThemeChange={handleThemeChange}
              muted={isMuted}
              onToggleMute={handleToggleMute}
              onLeaveGroup={
                selectedConversation?.type === "group" && selectedConversationId
                  ? () => leaveGroupMutation.mutate(selectedConversationId)
                  : undefined
              }
              leavingGroup={leaveGroupMutation.isPending}
            />
            <ThemeArea
              $theme={currentTheme}
              onClickCapture={handleMarkReadInteraction}
            >
              {hasBlockedParticipantsInGroup && selectedConversation && !dismissedGroupWarnings[selectedConversation.id] && (
                <BlockedBanner>
                  <span>{CHAT_LABELS.groupWarning}</span>
                  <BlockedBannerDismiss
                    type="button"
                    onClick={() => {
                      if (!selectedConversation) return;
                      setDismissedGroupWarnings((prev) => ({
                        ...prev,
                        [selectedConversation.id]: true,
                      }));
                    }}
                  >
                    {CHAT_LABELS.gotIt}
                  </BlockedBannerDismiss>
                </BlockedBanner>
              )}
              <MessageList
                messages={messages}
                onLoadMore={loadMore}
                currentUserId={currentUserId}
                loading={messagesLoading}
                loadingMore={loadingMore}
                otherAvatarUrl={isDirectBlocked ? undefined : otherParticipant?.avatarUrl ?? undefined}
                theme={currentTheme}
                onUserInteraction={handleMarkReadInteraction}
              />
              {isOtherTyping && (
                <TypingIndicator>
                  <TypingDot />
                  <span>Typing…</span>
                </TypingIndicator>
              )}
              {isDirectBlocked ? (
                <DirectBlockedMessage>{CHAT_LABELS.blockedMessage}</DirectBlockedMessage>
              ) : (
                <ChatInput onSend={sendMessage} conversationId={selectedConversationId} />
              )}
            </ThemeArea>
          </>
        ) : (
          <EmptyState>{CHAT_LABELS.selectConversation}</EmptyState>
        )}
      </ChatArea>

      <GroupChatDialog
        open={isGroupDialogOpen}
        onOpenChange={setIsGroupDialogOpen}
        onCreated={(conversation) => {
          setSelectedConversationId(conversation.id);
          setNewChatError(null);
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }}
      />
    </Container>
  );
}
