import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string; username: string };
}

interface CreatePostDto {
  content?: string;
  imageUrl?: string;
  originalPostId?: string;
}

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(
    @Request() req: AuthRequest,
    @Body() dto: CreatePostDto,
  ): Promise<any> {
    return this.postService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Request() req: AuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    return this.postService.findAll(pageNum, limitNum, req.user.userId);
  }

  @Get('feed')
  getFeed(
    @Request() req: AuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    return this.postService.getFeed(req.user.userId, pageNum, limitNum);
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
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
