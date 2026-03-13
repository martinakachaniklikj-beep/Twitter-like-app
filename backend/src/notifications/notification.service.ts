import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationsGateway } from './notification.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async sendPushNotification(
    token: string | null | undefined,
    title: string,
    body: string,
  ) {
    if (!token) {
      return;
    }

    try {
      await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
    } catch (error) {
      console.error('Failed to send push notification', error);
    }
  }

  broadcastInAppNotification(userId: string, payload: unknown) {
    try {
      this.gateway.emitNotification(userId, payload);
    } catch (error) {
      console.error('Failed to broadcast in-app notification', error);
    }
  }

  async sendBirthdayNotificationsForToday() {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const usersWithBirthdays = await (this.prisma as any).user.findMany({
      where: {
        birthDate: {
          not: null,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        birthDate: true,
      },
    });

    for (const birthdayUser of usersWithBirthdays) {
      if (!birthdayUser.birthDate) continue;

      const birthDate = new Date(birthdayUser.birthDate);
      if (
        birthDate.getMonth() !== todayMonth ||
        birthDate.getDate() !== todayDate
      ) {
        continue;
      }

      const followers = await this.prisma.follow.findMany({
        where: { followingId: birthdayUser.id },
        select: { followerId: true },
      });

      const following = await this.prisma.follow.findMany({
        where: { followerId: birthdayUser.id },
        select: { followingId: true },
      });

      const followingSet = new Set(following.map((f) => f.followingId));
      const mutualFollowerIds = followers
        .map((f) => f.followerId)
        .filter((id) => followingSet.has(id));

      if (!mutualFollowerIds.length) continue;

      const mutualUsers = await (this.prisma as any).user.findMany({
        where: { id: { in: mutualFollowerIds } },
        select: { id: true, fcmToken: true },
      });

      const displayName = birthdayUser.displayName || birthdayUser.username;
      const handle = `@${birthdayUser.username}`;
      const message = `It's ${handle}'s birthday today! Tap to wish them a happy birthday.`;

      for (const target of mutualUsers) {
        const notification = await (this.prisma as any).notification.create({
          data: {
            userId: target.id,
            type: 'system',
            message,
          },
        });

        this.broadcastInAppNotification(notification.userId, notification);

        await this.sendPushNotification(
          target.fcmToken,
          'Birthday',
          `Wish ${displayName} a happy birthday!`,
        );
      }
    }

    return { success: true };
  }
}
