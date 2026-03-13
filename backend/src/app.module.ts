import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { SavedPostsModule } from './saved-posts/saved-posts.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './geminiAi/ai.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { NotificationsModule } from './notifications/notification.module';
import { StocksModule } from './stocks/stocks.module';
import { MatchesModule } from './match/match.module';
import { BlockModule } from './block/block.module';
import { SearchHistoryModule } from './search-history/search-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 60,
      },
    ]),
    ScheduleModule.forRoot(),
    FirebaseModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PostModule,
    SavedPostsModule,
    FollowModule,
    LikeModule,
    CommentModule,
    ConversationModule,
    MessageModule,
    ChatModule,
    AiModule,
    HashtagsModule,
    NotificationsModule,
    StocksModule,
    MatchesModule,
    BlockModule,
    SearchHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
