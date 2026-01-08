import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existing = await this.followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existing) {
      return { followed: false }; // ✅ important
    }

    const follow = this.followRepo.create({
      follower: { id: followerId } as User,
      following: { id: followingId } as User,
    });

    await this.followRepo.save(follow);

    return { followed: true }; // ✅ always return JSON
  }

  async unfollow(followerId: string, followingId: string) {
    await this.followRepo.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });

    return { unfollowed: true }; // ✅ return JSON
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    return this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }
}
