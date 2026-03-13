import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SavedPostsService } from './saved-posts.service';
import { SavedPostsController } from './saved-posts.controller';

@Module({
  controllers: [SavedPostsController],
  providers: [SavedPostsService, PrismaService],
})
export class SavedPostsModule {}
