import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { NotificationsGateway } from './notification.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { BirthdayScheduler } from './birthday.scheduler';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, NotificationsGateway, BirthdayScheduler],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
