import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller('likes')
@UseGuards(FirebaseAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  likePost(@Req() req: AuthRequest, @Param('postId') postId: string) {
    return this.likeService.likePost(req.user.uid, postId);
  }

  @Delete(':postId')
  unlikePost(@Req() req: AuthRequest, @Param('postId') postId: string) {
    return this.likeService.unlikePost(req.user.uid, postId);
  }
}
