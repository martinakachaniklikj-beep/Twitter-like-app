import {
  Controller,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowService } from './follow.service';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  follow(@Param('id') userId: string, @Req() req: AuthRequest) {
    return this.followService.follow(req.user.userId, userId);
  }

  @Delete(':id/follow')
  unfollow(@Param('id') userId: string, @Req() req: AuthRequest) {
    return this.followService.unfollow(req.user.userId, userId);
  }
}
