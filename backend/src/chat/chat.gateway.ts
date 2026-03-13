import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { MessageService } from '../message/message.service';

const CONVERSATION_ROOM_PREFIX = 'conversation:';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket.io',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly socketToUserId = new Map<string, string>();

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly messageService: MessageService,
  ) {}

  afterInit() {
    this.logger.log('Chat WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    const token =
      client.handshake?.auth?.token ?? client.handshake?.query?.token;

    if (!token) {
      this.logger.warn(`Socket ${client.id} connected without token`);
      client.disconnect();
      return;
    }

    try {
      const decoded = await this.firebaseService.verifyToken(token);
      const userId = decoded.uid;
      this.socketToUserId.set(client.id, userId);
      (client as Socket & { userId: string }).userId = userId;
      this.logger.log(`Socket ${client.id} authenticated as ${userId}`);
    } catch (err) {
      this.logger.warn(`Socket ${client.id} invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.socketToUserId.delete(client.id);
    this.logger.log(`Socket ${client.id} disconnected`);
  }

  private getUserId(client: Socket): string | null {
    return (
      this.socketToUserId.get(client.id) ??
      (client as Socket & { userId?: string }).userId ??
      null
    );
  }

  @SubscribeMessage('conversation:join')
  async handleConversationJoin(
    client: Socket,
    payload: { conversationId: string },
  ) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const room = `${CONVERSATION_ROOM_PREFIX}${payload.conversationId}`;
    client.join(room);
  }

  @SubscribeMessage('conversation:leave')
  handleConversationLeave(client: Socket, payload: { conversationId: string }) {
    const room = `${CONVERSATION_ROOM_PREFIX}${payload.conversationId}`;
    client.leave(room);
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    payload: { conversationId: string; isTyping: boolean },
  ) {
    const userId = this.getUserId(client);
    if (!userId) return;
    const { conversationId, isTyping } = payload;
    if (!conversationId) return;

    const room = `${CONVERSATION_ROOM_PREFIX}${conversationId}`;
    client.to(room).emit('typing', {
      conversationId,
      userId,
      isTyping: !!isTyping,
    });
  }

  @SubscribeMessage('message:send')
  async handleMessageSend(
    client: Socket,
    payload: { conversationId: string; content: string },
  ) {
    const userId = this.getUserId(client);
    if (!userId) return { error: 'Unauthorized' };

    const { conversationId, content } = payload;
    if (!conversationId || !content?.trim()) {
      return { error: 'conversationId and content required' };
    }

    try {
      const message = await this.messageService.create(
        conversationId,
        userId,
        content.trim(),
      );
      const room = `${CONVERSATION_ROOM_PREFIX}${conversationId}`;
      this.server.to(room).emit('message:new', message);
      return { ok: true, message };
    } catch (err) {
      this.logger.warn(`message:send failed: ${err}`);
      return {
        error: err instanceof Error ? err.message : 'Failed to send message',
      };
    }
  }
}
