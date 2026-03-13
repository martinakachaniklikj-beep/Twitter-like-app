"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useChatSocket } from "@/contexts/ChatSocketContext";
import { chatServices, type ApiMessage } from "@/services/chatServices";
import type { Message, ChatAttachment, MessageContentPayload } from "./types";
import { parseMessageContent } from "./utilities/utility";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export { parseMessageContent } from "./utilities/utility";

const MAX_MESSAGE_TEXT_LENGTH = 2000;
const MAX_ATTACHMENTS_PER_MESSAGE = 5;
// 50 MB per attachment
const MAX_ATTACHMENT_SIZE_BYTES = 50 * 1024 * 1024;
// 200 MB total across all attachments
const MAX_TOTAL_ATTACHMENTS_SIZE_BYTES = 200 * 1024 * 1024;

function apiMessageToMessage(m: ApiMessage): Message {
  const { text, attachments } = parseMessageContent(m.content);
  return {
    id: m.id,
    text,
    senderId: m.senderId,
    conversationId: m.conversationId,
    createdAt: m.createdAt,
    status: m.status as Message["status"],
    attachments,
  };
}

async function uploadChatFile(file: File, userId: string): Promise<ChatAttachment> {
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : undefined;
  const path = `chat/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext ? `.${ext}` : ""}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(snapshot.ref);
  return {
    url,
    type: file.type,
    name: file.name,
    size: file.size,
  };
}

export function useChat(conversationId: string | null) {
  const { user } = useAuth();
  const {
    joinConversation,
    leaveConversation,
    sendMessage: socketSend,
    onMessageNew,
    onTyping,
  } = useChatSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const currentUserId = user?.uid ?? undefined;
  const hasMoreRef = useRef(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId || !user) {
      setMessages([]);
      hasMoreRef.current = true;
      return;
    }

    let cancelled = false;
    setLoading(true);
    hasMoreRef.current = true;

    user.getIdToken().then((token) => {
      chatServices
        .getMessages(token, conversationId)
        .then((list) => {
          if (!cancelled) {
            setMessages(list.map(apiMessageToMessage));
          }
        })
        .catch(() => {
          if (!cancelled) setMessages([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [conversationId, user?.uid]);

  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId, joinConversation, leaveConversation]);

  useEffect(() => {
    const unsub = onMessageNew((apiMsg) => {
      if (apiMsg.conversationId !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === apiMsg.id)) return prev;
        return [...prev, apiMessageToMessage(apiMsg)];
      });
      // Refresh conversations so the sidebar shows the latest message and timestamp
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
    return unsub;
  }, [conversationId, onMessageNew, queryClient]);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const unsub = onTyping((data) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === currentUserId) return;
      setIsOtherTyping(!!data.isTyping);
    });

    return () => {
      unsub();
      setIsOtherTyping(false);
    };
  }, [conversationId, currentUserId, onTyping]);

  const markMessagesReadOptimistic = useCallback(() => {
    if (!conversationId || !currentUserId) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === conversationId &&
        m.senderId !== currentUserId &&
        m.status === "sent"
          ? { ...m, status: "read" }
          : m
      )
    );
  }, [conversationId, currentUserId]);

  const sendMessage = useCallback(
    async (text: string, files?: File[]) => {
      const trimmed = text.trim();
      const hasFiles = Array.isArray(files) && files.length > 0;
      if (!trimmed && !hasFiles) return;
      if (!currentUserId || !conversationId) return;

      if (trimmed.length > MAX_MESSAGE_TEXT_LENGTH) {
        console.warn(
          `Message is too long. Maximum length is ${MAX_MESSAGE_TEXT_LENGTH} characters.`
        );
        return;
      }

      const allFiles = Array.isArray(files) ? files : [];
      if (allFiles.length > MAX_ATTACHMENTS_PER_MESSAGE) {
        console.warn(
          `Too many attachments. Maximum is ${MAX_ATTACHMENTS_PER_MESSAGE} per message.`
        );
        return;
      }

      const validFiles = allFiles.filter((file) => {
        const isSupported =
          file.type.startsWith("image/") ||
          file.type.startsWith("video/") ||
          file.type.startsWith("audio/");
        const isWithinSize = file.size <= MAX_ATTACHMENT_SIZE_BYTES;
        return isSupported && isWithinSize;
      });

      const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_ATTACHMENTS_SIZE_BYTES) {
        console.warn(
          `Attachments are too large in total. Maximum is ${(MAX_TOTAL_ATTACHMENTS_SIZE_BYTES / (1024 * 1024)).toFixed(
            0
          )} MB per message.`
        );
        return;
      }

      const optimisticAttachments: ChatAttachment[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        size: file.size,
      }));

      const tempId = `temp-${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        text: trimmed,
        senderId: currentUserId,
        conversationId,
        createdAt: new Date().toISOString(),
        status: "sending",
        attachments: optimisticAttachments.length ? optimisticAttachments : undefined,
      };
      setMessages((prev) => [...prev, optimistic]);

      let attachments: ChatAttachment[] = [];
      try {
        if (validFiles.length) {
          attachments = await Promise.all(
            validFiles.map((file) => uploadChatFile(file, currentUserId)),
          );
        }
      } catch {
        // If upload fails, remove optimistic message and abort send
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      const payload: MessageContentPayload = {
        text: trimmed,
        attachments: attachments.length ? attachments : undefined,
      };

      const serializedContent = JSON.stringify(payload);

      try {
        const result = await socketSend(conversationId, serializedContent);

        if (result.error) {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          return;
        }
        if (result.message) {
          // Replace optimistic message with the authoritative server message
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? apiMessageToMessage(result.message!) : m
            )
          );
        } else {
          // Fallback: just mark as sent if no message payload is returned
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, status: "sent" as const } : m
            )
          );
        }
      } catch (err) {
        console.error("Failed to send chat message", err);
        // Remove optimistic message on hard failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }
      // Ensure sidebar reflects the latest message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    [currentUserId, conversationId, socketSend, queryClient]
  );

  const loadMore = useCallback(async () => {
    if (!conversationId || !user || !hasMoreRef.current || loadingMore) return;
    const firstId = messages[0]?.id;
    if (!firstId) return;

    setLoadingMore(true);
    try {
      const token = await user.getIdToken();
      const older = await chatServices.getMessages(token, conversationId, firstId);
      if (older.length === 0) hasMoreRef.current = false;
      setMessages((prev) => [
        ...older.map(apiMessageToMessage),
        ...prev,
      ]);
    } finally {
      setLoadingMore(false);
    }
  }, [conversationId, user, messages[0]?.id, loadingMore]);

  return {
    messages,
    sendMessage,
    loadMore,
    currentUserId,
    loading,
    loadingMore,
    isOtherTyping,
    markMessagesReadOptimistic,
  };
}
