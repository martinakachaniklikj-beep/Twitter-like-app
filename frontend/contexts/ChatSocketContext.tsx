'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import type { ApiMessage } from '@/services/chatServices';

const socketUrl =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : '';

interface ChatSocketContextType {
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (
    conversationId: string,
    content: string,
  ) => Promise<{ ok?: boolean; error?: string; message?: ApiMessage }>;
  onMessageNew: (cb: (message: ApiMessage) => void) => () => void;
}

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Set<(message: ApiMessage) => void>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !user || !socketUrl) return;

    const connect = async () => {
      const token = await user.getIdToken();
      const socket = io(socketUrl, {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      socket.on('message:new', (message: ApiMessage) => {
        listenersRef.current.forEach((cb) => cb(message));
      });

      socketRef.current = socket;
    };

    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, user?.uid]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:join', { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:leave', { conversationId });
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      return new Promise<{ ok?: boolean; error?: string; message?: ApiMessage }>((resolve) => {
        if (!socketRef.current) {
          resolve({ error: 'Not connected' });
          return;
        }
        socketRef.current.emit(
          'message:send',
          { conversationId, content },
          (res: { ok?: boolean; error?: string; message?: ApiMessage }) => {
            resolve(res ?? {});
          },
        );
      });
    },
    [],
  );

  const onMessageNew = useCallback((cb: (message: ApiMessage) => void) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  }, []);

  const value: ChatSocketContextType = {
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    onMessageNew,
  };

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) throw new Error('useChatSocket must be used within ChatSocketProvider');
  return ctx;
}
