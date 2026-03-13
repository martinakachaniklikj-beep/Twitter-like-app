import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AiModule } from '../geminiAi/ai.module';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
  imports: [AiModule, NotificationsModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
