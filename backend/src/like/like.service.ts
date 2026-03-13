import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notification.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async likePost(userId: string, postId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      return { liked: false };
    }

    await this.prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    // Create a notification for the post author (if not liking own post)
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          userId: true,
        },
      });

      if (post && post.userId !== userId) {
        const liker = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            username: true,
            displayName: true,
          },
        });

        const actorName = liker?.displayName || liker?.username || 'Someone';

        const notificationMessage = `${actorName} liked your post.`;

        const notification = await (this.prisma as any).notification.create({
          data: {
            userId: post.userId,
            type: 'like',
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
          'New like',
          notificationMessage,
        );
      }
    } catch {
      // ignore notification failures
    }

    return { liked: true };
  }

  async unlikePost(userId: string, postId: string) {
    await this.prisma.like
      .delete({
        where: {
          userId_postId: { userId, postId },
        },
      })
      .catch(() => null);

    return { unliked: true };
  }
}
