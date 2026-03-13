import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../geminiAi/ai.service';
import { NotificationsService } from '../notifications/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(userId: string, postId: string, content: string) {
    const comment = await this.prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
      include: {
        user: true,
      },
    });

    // Create a notification for the post author (if not commenting on own post)
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          userId: true,
        },
      });

      if (post && post.userId !== userId) {
        const commenter = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            username: true,
            displayName: true,
          },
        });

        const actorName =
          commenter?.displayName || commenter?.username || 'Someone';

        const notificationMessage = `${actorName} commented on your post.`;

        const notification = await (this.prisma as any).notification.create({
          data: {
            userId: post.userId,
            type: 'comment',
            message: notificationMessage,
          },
        });

        this.notifications.broadcastInAppNotification(
          notification.userId,
          notification,
        );

        const targetUser: { fcmToken: string | null } | null = await (
          this.prisma as any
        ).user.findUnique({
          where: { id: post.userId },
          select: { fcmToken: true },
        });

        await this.notifications.sendPushNotification(
          targetUser?.fcmToken,
          'New comment',
          notificationMessage,
        );
      }
    } catch {
      // ignore notification failures
    }

    const mentionsKittyBot = /@kittybot\b/i.test(content);

    if (mentionsKittyBot) {
      await this.handleKittyBotReply(postId, content);
    }

    return comment;
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async handleKittyBotReply(postId: string, userText: string) {
    const kittyUser = await this.prisma.user.upsert({
      where: { id: 'kitty-bot' },
      update: {},
      create: {
        id: 'kitty-bot',
        email: 'kitty-bot@example.local',
        username: 'KittyBot',
        displayName: 'Kitty Bot',
      },
    });

    let replyText: string;
    try {
      replyText = await this.aiService.chat(`User: ${userText}\nKitty Bot:`);
      replyText =
        replyText.trim() ||
        'Meow! My whiskers got a bit tangled there. Try asking me again in a slightly different way.';
    } catch (error) {
      console.error(
        'Failed to generate Kitty Bot reply for comment mention',
        error,
      );
      replyText =
        'Meow! I tried to reply but something went wrong. Please try tagging me again in a moment.';
    }

    await this.prisma.comment.create({
      data: {
        content: replyText,
        user: { connect: { id: kittyUser.id } },
        post: { connect: { id: postId } },
      },
    });
  }
}
