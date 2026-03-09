import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(conversationId: string, senderId: string, content: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: senderId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Not a participant of this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      status: message.status,
      createdAt: message.createdAt,
      sender: message.sender,
    };
  }

  async findByConversation(
    conversationId: string,
    userId: string,
    before?: string,
    limit = 50,
  ) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Not a participant of this conversation');
    }

    const cursor = before
      ? await this.prisma.message.findUnique({ where: { id: before, conversationId } })
      : null;

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      take: limit,
      ...(cursor ? { cursor: { id: before! }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      status: m.status,
      createdAt: m.createdAt,
      sender: m.sender,
    })).reverse();
  }
}
