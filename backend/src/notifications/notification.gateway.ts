import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from '../firebase/firebase.service';

const USER_ROOM_PREFIX = 'user:';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket.io',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly socketToUserId = new Map<string, string>();

  constructor(private readonly firebaseService: FirebaseService) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake?.auth?.token ?? client.handshake?.query?.token;

    if (!token) {
      this.logger.warn(
        `Notifications socket ${client.id} connected without token`,
      );
      client.disconnect();
      return;
    }

    try {
      const decoded = await this.firebaseService.verifyToken(token);
      const userId = decoded.uid;
      this.socketToUserId.set(client.id, userId);
      (client as Socket & { userId: string }).userId = userId;

      const room = `${USER_ROOM_PREFIX}${userId}`;
      client.join(room);

      this.logger.log(
        `Notifications socket ${client.id} authenticated as ${userId}`,
      );
    } catch (err) {
      this.logger.warn(`Notifications socket ${client.id} invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.socketToUserId.delete(client.id);
    this.logger.log(`Notifications socket ${client.id} disconnected`);
  }

  emitNotification(userId: string, payload: unknown) {
    const room = `${USER_ROOM_PREFIX}${userId}`;
    this.server.to(room).emit('notification:new', payload);
  }
}
