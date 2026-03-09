import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { id: true, content: true, createdAt: true, senderId: true },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    return participants.map((p) => {
      const conv = p.conversation;
      const otherParticipants = conv.participants.filter((x) => x.userId !== userId);
      const lastMessage = conv.messages[0] ?? null;
      return {
        id: conv.id,
        type: conv.type,
        updatedAt: conv.updatedAt,
        participants: conv.participants.map((x) => ({
          userId: x.user.id,
          username: x.user.username,
          displayName: x.user.displayName,
          avatarUrl: x.user.avatarUrl,
        })),
        otherParticipants,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : null,
      };
    });
  }

  async findOne(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
            },
          },
        },
      },
    });

    if (!participant) {
      throw new NotFoundException('Conversation not found');
    }

    const conv = participant.conversation;
    return {
      id: conv.id,
      type: conv.type,
      updatedAt: conv.updatedAt,
      participants: conv.participants.map((p) => ({
        userId: p.user.id,
        username: p.user.username,
        displayName: p.user.displayName,
        avatarUrl: p.user.avatarUrl,
      })),
    };
  }

  /** Get or create a direct conversation between two users. */
  async getOrCreateDirect(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new ForbiddenException('Cannot create conversation with yourself');
    }

    const myParticipations = await this.prisma.conversationParticipant.findMany({
      where: { userId, conversation: { type: 'direct' } },
      include: { conversation: true },
    });

    for (const p of myParticipations) {
      const count = await this.prisma.conversationParticipant.count({
        where: { conversationId: p.conversationId },
      });
      if (count !== 2) continue;
      const other = await this.prisma.conversationParticipant.findFirst({
        where: { conversationId: p.conversationId, userId: otherUserId },
      });
      if (other) {
        return this.findOne(p.conversationId, userId);
      }
    }

    const otherExists = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });
    if (!otherExists) {
      throw new NotFoundException('User not found');
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'direct',
        participants: {
          create: [
            { userId },
            { userId: otherUserId },
          ],
        },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
        },
      },
    });

    return {
      id: conversation.id,
      type: conversation.type,
      updatedAt: conversation.updatedAt,
      participants: conversation.participants.map((p) => ({
        userId: p.user.id,
        username: p.user.username,
        displayName: p.user.displayName,
        avatarUrl: p.user.avatarUrl,
      })),
    };
  }
}
