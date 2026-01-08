import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string; username: string };
}

interface CreateCommentDto {
  content: string;
}

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  async create(
    @Request() req: AuthRequest,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      req.user.userId,
      postId,
      createCommentDto.content,
    );
  }

  @Get(':postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }
}
