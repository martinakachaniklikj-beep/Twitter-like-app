import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      return { followed: false };
    }

    await this.prisma.follow.create({
      data: {
        follower: { connect: { id: followerId } },
        following: { connect: { id: followingId } },
      },
    });

    return { followed: true };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow
      .delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      })
      .catch(() => null);

    return { unfollowed: true };
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
