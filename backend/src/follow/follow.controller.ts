import {
  Controller,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Get } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { FollowService } from './follow.service';

interface AuthRequest extends Request {
  user: {
    uid: string;
    email?: string;
  };
}

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  follow(@Param('id') userId: string, @Req() req: AuthRequest) {
    return this.followService.follow(req.user.uid, userId);
  }

  @Delete(':id/follow')
  unfollow(@Param('id') userId: string, @Req() req: AuthRequest) {
    return this.followService.unfollow(req.user.uid, userId);
  }

  @Get('me/followers')
  async getMyFollowers(@Req() req: AuthRequest) {
    const follows = await this.followService.getFollowers(req.user.uid);
    return follows.map((follow) => follow.follower);
  }

  @Get('me/following')
  async getMyFollowing(@Req() req: AuthRequest) {
    const follows = await this.followService.getFollowing(req.user.uid);
    return follows.map((follow) => follow.following);
  }
}
