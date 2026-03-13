import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { NotificationsService } from './notification.service';

@UseGuards(FirebaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  @Post('token')
  async saveToken(@Body() body: { userId: string; token: string }) {
    return this.prisma.user.update({
      where: { id: body.userId },
      data: { fcmToken: body.token } as Prisma.UserUpdateInput,
    });
  }

  @Get()
  async listNotifications(
    @CurrentUser() user: { uid: string },
    @Query('type') type?: string,
  ) {
    const where: any = { userId: user.uid };
    if (type && type !== 'all') {
      where.type = type;
    }

    return (this.prisma as any).notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser() user: { uid: string }) {
    const count = await (this.prisma as any).notification.count({
      where: {
        userId: user.uid,
        readAt: null,
      },
    });

    return { count };
  }

  @Post('mark-read')
  async markAllAsRead(@CurrentUser() user: { uid: string }) {
    await (this.prisma as any).notification.updateMany({
      where: {
        userId: user.uid,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  @Post(':id/read')
  async markOneAsRead(
    @CurrentUser() user: { uid: string },
    @Param('id') id: string,
  ) {
    const updated = await (this.prisma as any).notification.updateMany({
      where: {
        id,
        userId: user.uid,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true, updated: updated.count };
  }

  @Delete(':id')
  async deleteOne(
    @CurrentUser() user: { uid: string },
    @Param('id') id: string,
  ) {
    const deleted = await (this.prisma as any).notification.deleteMany({
      where: {
        id,
        userId: user.uid,
        NOT: {
          readAt: null,
        },
      },
    });

    return { success: true, deleted: deleted.count };
  }

  @Post('birthdays/run')
  async sendBirthdayNotifications() {
    return this.notifications.sendBirthdayNotificationsForToday();
  }
}
