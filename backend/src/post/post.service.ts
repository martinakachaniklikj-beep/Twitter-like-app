import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreatePostDto {
  content?: string;
  imageUrl?: string;
  gifUrl?: string;
  originalPostId?: string;
}

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    const { content, imageUrl, gifUrl, originalPostId } = dto;

    if (!originalPostId && !content && !imageUrl && !gifUrl) {
      throw new BadRequestException('Post must have content, image or GIF');
    }

    if (!originalPostId) {
      return this.prisma.post.create({
        data: {
          content: content ?? null,
          imageUrl: imageUrl ?? null,
          gifUrl: gifUrl ?? null,
          userId,
        } as any,
      });
    }

    const original = await this.prisma.post.findUnique({
      where: { id: originalPostId },
      include: { originalPost: true },
    });

    if (!original) {
      throw new BadRequestException('Original post not found');
    }

    const root = original.originalPost ?? original;

    const alreadyReposted = await this.prisma.post.findFirst({
      where: {
        userId,
        originalPostId: root.id,
      },
    });

    if (alreadyReposted) {
      throw new BadRequestException('Already reposted');
    }

    return this.prisma.post.create({
      data: {
        content: content ?? null,
        imageUrl: imageUrl ?? null,
        gifUrl: gifUrl ?? null,
        userId,
        originalPostId: root.id,
      } as any,
    });
  }


  async findAll(page: number, limit: number, currentUserId?: string) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          likes: true,
          comments: true,
          reposts: true,
          originalPost: { include: { user: true } },
        },
      }),
      this.prisma.post.count(),
    ]);

    const data = posts.map((post) =>
      this.formatPost(post, currentUserId),
    );

    return {
      data,
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    };
  }


  async getFeed(
    userId: string,
    page: number,
    limit: number,
    type: 'for_you' | 'following' = 'for_you',
  ) {
    const skip = (page - 1) * limit;

    if (type === 'for_you') {
      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            user: true,
            likes: true,
            comments: true,
            reposts: true,
            originalPost: { include: { user: true } },
          },
        }),
        this.prisma.post.count(),
      ]);
      const data = posts.map((post) => this.formatPost(post, userId));
      return { data, page, limit, total, hasMore: skip + posts.length < total };
    }

    // following: posts from the current user + users they follow, sorted by time
    const whereCondition = {
      OR: [
        { userId },
        {
          user: {
            followers: {
              some: { followerId: userId },
            },
          },
        },
      ],
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          likes: true,
          comments: true,
          reposts: true,
          originalPost: { include: { user: true } },
        },
      }),
      this.prisma.post.count({ where: whereCondition }),
    ]);

    const data = posts.map((post) => this.formatPost(post, userId));

    return {
      data,
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    };
  }

  async findByUser(username: string) {
    const posts = await this.prisma.post.findMany({
      where: { user: { username } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        likes: true,
        comments: true,
        reposts: true,
        originalPost: { include: { user: true } },
      },
    });

    return posts.map((post) => this.formatPost(post));
  }


  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        comments: true,
        reposts: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.userId !== userId) {
      throw new BadRequestException('Not allowed to delete this post');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { deleted: true };
  }


  private formatPost(post: any, currentUserId?: string) {
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      gifUrl: post.gifUrl,
      createdAt: post.createdAt,

      authorId: post.user?.id,
      authorUsername: post.user?.username,
      authorDisplayName: post.user?.displayName ?? post.user?.username,
      avatarUrl: post.user?.avatarUrl,

      likesCount: post.likes?.length ?? 0,
      repliesCount: post.comments?.length ?? 0,
      repostsCount: post.reposts?.length ?? 0,

      isLiked: currentUserId
        ? post.likes?.some((l) => l.userId === currentUserId)
        : false,

      isRepost: !!post.originalPost,
      originalPostId: post.originalPost?.id,
      originalAuthorId: post.originalPost?.user?.id,
      originalAuthorUsername: post.originalPost?.user?.username,
      originalPostContent: post.originalPost?.content,
      originalPostImageUrl: post.originalPost?.imageUrl,
      originalPostGifUrl: post.originalPost?.gifUrl,
    };
  }
}
