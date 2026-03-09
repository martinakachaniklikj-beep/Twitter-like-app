import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: string, postId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      return { liked: false };
    }

    await this.prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    return { liked: true };
  }

  async unlikePost(userId: string, postId: string) {
    await this.prisma.like
      .delete({
        where: {
          userId_postId: { userId, postId },
        },
      })
      .catch(() => null);

    return { unliked: true };
  }
}
