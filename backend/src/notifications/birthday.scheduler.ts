import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notification.service';

@Injectable()
export class BirthdayScheduler {
  constructor(private readonly notifications: NotificationsService) {}

  // Runs every day at 09:00 server time
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyBirthdayNotifications() {
    await this.notifications.sendBirthdayNotificationsForToday();
  }
}

