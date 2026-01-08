import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowService } from '../follow/follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string; username: string };
}

interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

interface UserProfileResponse {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followService: FollowService,
  ) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.usersService.search(query);
  }

  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(
    @Request() req: AuthRequest,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateDto);
  }

  @Post(':userId/follow')
  async follow(@Request() req: AuthRequest, @Param('userId') userId: string) {
    await this.followService.follow(req.user.userId, userId);
    return { message: 'User followed successfully' };
  }

  @Post(':userId/unfollow')
  async unfollow(@Request() req: AuthRequest, @Param('userId') userId: string) {
    await this.followService.unfollow(req.user.userId, userId);
    return { message: 'User unfollowed successfully' };
  }

  @Get(':username')
  async getByUsername(
    @Request() req: AuthRequest,
    @Param('username') username: string,
  ): Promise<(UserProfileResponse & { isFollowing: boolean }) | null> {
    const profile = await this.usersService.getProfileByUsername(username);
    if (!profile) {
      return null;
    }

    const followers = await this.followService.getFollowers(profile.id);
    const isFollowing = followers.some(
      (follow) => follow.follower?.id === req.user.userId,
    );

    return {
      ...profile,
      isFollowing,
    } as UserProfileResponse & { isFollowing: boolean };
  }
}
