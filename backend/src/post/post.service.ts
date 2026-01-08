import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

export interface CreatePostDto {
  content?: string;
  imageUrl?: string;
  originalPostId?: string;
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(userId: string, dto: CreatePostDto): Promise<Post> {
    const { content, imageUrl, originalPostId } = dto;

    if (!originalPostId) {
      if (!content && !imageUrl) {
        throw new BadRequestException('Post must have content or image');
      }

      const post = this.postRepository.create({
        content,
        imageUrl,
        user: { id: userId } as User,
      });

      return this.postRepository.save(post);
    }

    const originalPost = await this.postRepository.findOne({
      where: { id: originalPostId },
      relations: ['originalPost'],
    });

    if (!originalPost) {
      throw new BadRequestException('Original post not found');
    }

    const rootPost = originalPost.originalPost ?? originalPost;

    const alreadyReposted = await this.postRepository.findOne({
      where: {
        user: { id: userId },
        originalPost: { id: rootPost.id },
      },
    });

    if (alreadyReposted) {
      throw new BadRequestException('Already reposted');
    }

    const repost = this.postRepository.create({
      content: content || undefined,
      imageUrl: imageUrl || undefined,
      user: { id: userId } as User,
      originalPost: { id: rootPost.id } as Post,
    });

    return this.postRepository.save(repost);
  }

  async findAll(
    pageNum: number,
    limitNum: number,
    currentUserId?: string,
  ): Promise<any> {
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await this.postRepository.findAndCount({
      relations: [
        'user',
        'likes',
        'likes.user',
        'comments',
        'reposts',
        'originalPost',
        'originalPost.user',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    const data = await Promise.all(
      posts.map(async (post) => {
        const isReposted = currentUserId
          ? await this.postRepository.exist({
              where: {
                user: { id: currentUserId },
                originalPost: { id: post.id },
              },
            })
          : false;

        return {
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          authorId: post.user?.id,
          authorUsername: post.user?.username,
          authorDisplayName: post.user?.username,
          createdAt: post.createdAt,
          likesCount: post.likes?.length || 0,
          repliesCount: post.comments?.length || 0,
          repostsCount: post.reposts?.length || 0,
          isLiked: currentUserId
            ? post.likes?.some((like) => like.user?.id === currentUserId)
            : false,
          isReposted,
          isRepost: !!post.originalPost,
          reposterId: post.originalPost ? post.user?.id : undefined,
          reposterUsername: post.originalPost ? post.user?.username : undefined,
          originalPostId: post.originalPost?.id,
          originalAuthorId: post.originalPost?.user?.id,
          originalAuthorUsername: post.originalPost?.user?.username,
          originalPostContent: post.originalPost?.content,
          originalPostImageUrl: post.originalPost?.imageUrl,
        };
      }),
    );

    return {
      data,
      page: pageNum,
      limit: limitNum,
      total,
      hasMore: skip + posts.length < total,
    };
  }

  async getFeed(
    userId: string,
    pageNum: number,
    limitNum: number,
  ): Promise<any> {
    const skip = (pageNum - 1) * limitNum;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.reposts', 'reposts')
      .leftJoinAndSelect('post.originalPost', 'originalPost')
      .leftJoinAndSelect('originalPost.user', 'originalAuthor')
      .leftJoin('follows', 'follows', 'follows.followingId = post.userId')
      .where('follows.followerId = :userId OR post.userId = :userId', {
        userId,
      })
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limitNum);

    const [posts, total] = await query.getManyAndCount();

    const data = await Promise.all(
      posts.map(async (post) => {
        const isReposted = await this.postRepository.exist({
          where: {
            user: { id: userId },
            originalPost: { id: post.originalPost?.id || post.id },
          },
        });

        return {
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          authorId: post.user?.id,
          authorUsername: post.user?.username,
          authorDisplayName: post.user?.username,
          createdAt: post.createdAt,
          likesCount: post.likes?.length || 0,
          repliesCount: post.comments?.length || 0,
          repostsCount: post.reposts?.length || 0,
          isLiked:
            post.likes?.some((like) => like.user?.id === userId) || false,
          isReposted,
          isRepost: !!post.originalPost,
          reposterId: post.originalPost ? post.user?.id : undefined,
          reposterUsername: post.originalPost ? post.user?.username : undefined,
          originalPostId: post.originalPost?.id,
          originalAuthorId: post.originalPost?.user?.id,
          originalAuthorUsername: post.originalPost?.user?.username,
          originalPostContent: post.originalPost?.content,
          originalPostImageUrl: post.originalPost?.imageUrl,
        };
      }),
    );

    return {
      data,
      page: pageNum,
      limit: limitNum,
      total,
      hasMore: skip + limitNum < total,
    };
  }

  async findByUser(username: string): Promise<any[]> {
    const posts = await this.postRepository.find({
      where: { user: { username } },
      relations: [
        'user',
        'likes',
        'likes.user',
        'comments',
        'reposts',
        'originalPost',
        'originalPost.user',
      ],
      order: { createdAt: 'DESC' },
    });

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      authorId: post.user?.id,
      authorUsername: post.user?.username,
      authorDisplayName: post.user?.username,
      createdAt: post.createdAt,
      likesCount: post.likes?.length || 0,
      repliesCount: post.comments?.length || 0,
      repostsCount: post.reposts?.length || 0,
      isLiked: false,
      isReposted: false,
      isRepost: !!post.originalPost,
      reposterId: post.originalPost ? post.user?.id : undefined,
      reposterUsername: post.originalPost ? post.user?.username : undefined,
      originalPostId: post.originalPost?.id,
      originalAuthorId: post.originalPost?.user?.id,
      originalAuthorUsername: post.originalPost?.user?.username,
      originalPostContent: post.originalPost?.content,
      originalPostImageUrl: post.originalPost?.imageUrl,
    }));
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
