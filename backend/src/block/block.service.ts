import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(blockerId: string, blockedUserId: string) {
    if (blockerId === blockedUserId) {
      return { blocked: false };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: blockedUserId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.$transaction(async (tx) => {
      // Create or ensure block entry exists
      await (tx as any).block.upsert({
        where: {
          blockerId_blockedId: {
            blockerId,
            blockedId: blockedUserId,
          },
        } as any,
        update: {},
        create: {
          blockerId,
          blockedId: blockedUserId,
        },
      });

      // Remove any follow relationship in either direction
      await (tx as any).follow.deleteMany({
        where: {
          OR: [
            {
              followerId: blockerId,
              followingId: blockedUserId,
            },
            {
              followerId: blockedUserId,
              followingId: blockerId,
            },
          ],
        },
      });
    });

    return { blocked: true };
  }

  async unblockUser(blockerId: string, blockedUserId: string) {
    await (this.prisma as any).block.deleteMany({
      where: {
        blockerId,
        blockedId: blockedUserId,
      },
    });

    return { blocked: false };
  }

  async listBlocked(blockerId: string) {
    const blocks = await (this.prisma as any).block.findMany({
      where: { blockerId },
      orderBy: { createdAt: 'desc' },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return blocks.map((b: any) => ({
      id: b.blocked.id,
      username: b.blocked.username,
      displayName: b.blocked.displayName ?? null,
      avatarUrl: b.blocked.avatarUrl ?? null,
      blockedAt: b.createdAt,
    }));
  }
}

