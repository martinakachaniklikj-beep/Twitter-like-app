import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(uid: string, email: string, username: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id: uid },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        id: uid,
        email,
        username,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async search(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName ?? undefined,
      email: user.email,
      bio: user.bio ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
    }));
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName ?? undefined,
      email: user.email,
      bio: user.bio ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      createdAt: user.createdAt,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  }

  async getProfileByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName ?? undefined,
      email: user.email,
      bio: user.bio ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      createdAt: user.createdAt,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  }

  async updateProfile(
    userId: string,
    updates: { displayName?: string; bio?: string; avatarUrl?: string },
  ) {
    await this.prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    return this.getProfile(userId);
  }

  async syncFirebaseUser(id: string, email: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });
  
    if (existing) {
      return existing;
    }
  
    return this.prisma.user.create({
      data: {
        id,
        email,
        username: email.split('@')[0],
      },
    });
  }
  
}

