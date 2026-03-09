import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller('posts')
@UseGuards(FirebaseAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Req() req: AuthRequest,
    @Body()
    dto: {
      content?: string;
      imageUrl?: string;
      gifUrl?: string;
      originalPostId?: string;
    },
  ) {
    return this.postService.create(req.user.uid, dto);
  }

  @Get()
  findAll(
    @Req() req: AuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);

    return this.postService.findAll(pageNum, limitNum, req.user.uid);
  }

  @Get('feed')
  getFeed(
    @Req() req: AuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: 'for_you' | 'following',
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const feedType = type === 'following' ? 'following' : 'for_you';

    return this.postService.getFeed(req.user.uid, pageNum, limitNum, feedType);
  }

  @Get('user/:username')
  findByUser(@Param('username') username: string) {
    return this.postService.findByUser(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.postService.remove(id, req.user.uid);
  }
}
