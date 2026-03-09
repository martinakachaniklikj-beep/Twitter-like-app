import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
