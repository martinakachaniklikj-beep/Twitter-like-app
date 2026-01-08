import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string; username: string };
}

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  async likePost(@Request() req: AuthRequest, @Param('postId') postId: string) {
    return this.likeService.likePost(req.user.userId, postId);
  }

  @Delete(':postId')
  async unlikePost(
    @Request() req: AuthRequest,
    @Param('postId') postId: string,
  ) {
    await this.likeService.unlikePost(req.user.userId, postId);
    return { message: 'Post unliked successfully' };
  }
}
