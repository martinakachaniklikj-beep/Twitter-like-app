import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../geminiAi/ai.service';

export interface CreatePostDto {
  content?: string;
  imageUrl?: string;
  gifUrl?: string;
  originalPostId?: string;
  poll?: {
    question?: string;
    options: string[];
    expiresAt: string; // ISO string
  };
}

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    const { content, imageUrl, gifUrl, originalPostId, poll } = dto;

    if (!originalPostId && !content && !imageUrl && !gifUrl && !poll) {
      throw new BadRequestException(
        'Post must have content, image, GIF or poll',
      );
    }

    if (!originalPostId) {
      const post = await this.prisma.$transaction(async (tx) => {
        const createdPost = await (tx as any).post.create({
          data: {
            content: content ?? null,
            imageUrl: imageUrl ?? null,
            gifUrl: gifUrl ?? null,
            userId,
          } as any,
        });

        if (poll) {
          const trimmedOptions = (poll.options ?? [])
            .map((o) => o.trim())
            .filter(Boolean);
          if (trimmedOptions.length < 2) {
            throw new BadRequestException('Poll must have at least 2 options');
          }

          const expiresAt = new Date(poll.expiresAt);
          if (Number.isNaN(expiresAt.getTime())) {
            throw new BadRequestException('Invalid poll expiry time');
          }

          if (expiresAt <= new Date()) {
            throw new BadRequestException(
              'Poll expiry time must be in the future',
            );
          }

          const createdPoll = await (tx as any).poll.create({
            data: {
              question: poll.question ?? null,
              expiresAt,
              postId: createdPost.id,
            },
          });

          await (tx as any).pollOption.createMany({
            data: trimmedOptions.map((text) => ({
              text,
              pollId: createdPoll.id,
            })),
          });
        }

        return createdPost;
      });

      if (content) {
        await this.syncPostHashtags(post.id, content);
      }

      const mentionsKittyBot = !!content && /@kittybot\b/i.test(content);
      if (mentionsKittyBot) {
        // Fire and forget; errors are handled inside
        void this.handleKittyBotReplyForPost(post.id, content);
      }

      return post;
    }

    const original = await (this.prisma as any).post.findUnique({
      where: { id: originalPostId },
      include: { originalPost: true },
    });

    if (!original) {
      throw new BadRequestException('Original post not found');
    }

    const root = original.originalPost ?? original;

    const alreadyReposted = await (this.prisma as any).post.findFirst({
      where: {
        userId,
        originalPostId: root.id,
      },
    });

    if (alreadyReposted) {
      throw new BadRequestException('Already reposted');
    }

    const repost = await (this.prisma as any).post.create({
      data: {
        content: content ?? null,
        imageUrl: imageUrl ?? null,
        gifUrl: gifUrl ?? null,
        userId,
        originalPostId: root.id,
      } as any,
    });

    if (content) {
      await this.syncPostHashtags(repost.id, content);
    }

    return repost;
  }

  async findAll(page: number, limit: number, currentUserId?: string) {
    const skip = (page - 1) * limit;

    const userFilter =
      currentUserId != null
        ? {
            user: {
              blockedBy: {
                none: {
                  blockerId: currentUserId,
                },
              },
              blockedUsers: {
                none: {
                  blockedId: currentUserId,
                },
              },
            },
          }
        : {};

    const [posts, total] = await Promise.all([
      (this.prisma as any).post.findMany({
        where: userFilter,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          likes: true,
          comments: true,
          reposts: true,
          originalPost: {
            include: {
              user: true,
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
          },
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
          hashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      (this.prisma as any).post.count({
        where: userFilter,
      }),
    ]);

    const data = posts.map((post) => this.formatPost(post, currentUserId));

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
    if (type === 'for_you') {
      return this.getForYouFeed(userId, page, limit);
    }

    const skip = (page - 1) * limit;

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
      user: {
        blockedBy: {
          none: {
            blockerId: userId,
          },
        },
        blockedUsers: {
          none: {
            blockedId: userId,
          },
        },
      },
    };

    const [posts, total] = await Promise.all([
      (this.prisma as any).post.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          likes: true,
          comments: true,
          reposts: true,
          originalPost: {
            include: {
              user: true,
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
          },
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
          hashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      (this.prisma as any).post.count({ where: whereCondition }),
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

  async findByUser(username: string, currentUserId?: string) {
    const posts = await (this.prisma as any).post.findMany({
      where: { user: { username } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        likes: true,
        comments: true,
        reposts: true,
        originalPost: {
          include: {
            user: true,
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
          },
        },
        poll: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    return posts.map((post) => this.formatPost(post, currentUserId));
  }

  async findOne(id: string) {
    const post = await (this.prisma as any).post.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        comments: true,
        reposts: true,
        originalPost: {
          include: {
            user: true,
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
          },
        },
        poll: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.formatPost(post);
  }

  async voteOnPoll(postId: string, userId: string, optionId: string) {
    const post = await (this.prisma as any).post.findUnique({
      where: { id: postId },
      include: {
        poll: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!post || !post.poll) {
      throw new NotFoundException('Poll not found for this post');
    }

    const now = new Date();
    if (new Date(post.poll.expiresAt) <= now) {
      throw new BadRequestException('Poll is no longer active');
    }

    const option = post.poll.options.find((opt: any) => opt.id === optionId);
    if (!option) {
      throw new BadRequestException('Invalid poll option');
    }

    const existingVote = await (this.prisma as any).pollVote.findFirst({
      where: {
        pollId: post.poll.id,
        userId,
      },
    });

    if (existingVote) {
      if (existingVote.optionId === optionId) {
        return this.findOne(postId);
      }

      await (this.prisma as any).pollVote.update({
        where: { id: existingVote.id },
        data: { optionId },
      });
    } else {
      await (this.prisma as any).pollVote.create({
        data: {
          pollId: post.poll.id,
          optionId,
          userId,
        },
      });
    }

    return this.findOne(postId);
  }

  async remove(id: string, userId: string) {
    const post = await (this.prisma as any).post.findUnique({
      where: { id },
    });

    if (!post || post.userId !== userId) {
      throw new BadRequestException('Not allowed to delete this post');
    }

    await (this.prisma as any).post.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async getByHashtag(
    hashtag: string,
    page: number,
    limit: number,
    currentUserId?: string,
  ) {
    const skip = (page - 1) * limit;
    const normalized = hashtag.toLowerCase();

    const whereCondition: any = {
      hashtags: {
        some: {
          hashtag: {
            name: normalized,
          },
        },
      },
    };

    if (currentUserId) {
      whereCondition.user = {
        blockedBy: {
          none: {
            blockerId: currentUserId,
          },
        },
        blockedUsers: {
          none: {
            blockedId: currentUserId,
          },
        },
      };
    }

    const [posts, total] = await Promise.all([
      (this.prisma as any).post.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          likes: true,
          comments: true,
          reposts: true,
          originalPost: {
            include: {
              user: true,
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
          },
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
          hashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      (this.prisma as any).post.count({ where: whereCondition }),
    ]);

    const data = posts.map((post) => this.formatPost(post, currentUserId));

    return {
      data,
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    };
  }

  private async syncPostHashtags(postId: string, content: string) {
    const hashtags = this.extractHashtags(content);
    if (hashtags.length === 0) {
      await (this.prisma as any).postHashtag.deleteMany({
        where: { postId },
      });
      return;
    }

    const uniqueNames = Array.from(
      new Set(hashtags.map((tag) => tag.toLowerCase())),
    );

    await this.prisma.$transaction(async (tx) => {
      const existing = await (tx as any).hashtag.findMany({
        where: {
          name: {
            in: uniqueNames,
          },
        },
      });

      const existingNames = new Set(existing.map((h: any) => h.name));
      const toCreate = uniqueNames.filter((name) => !existingNames.has(name));

      if (toCreate.length > 0) {
        await (tx as any).hashtag.createMany({
          data: toCreate.map((name) => ({ name })),
          skipDuplicates: true,
        });
      }

      const allHashtags = await (tx as any).hashtag.findMany({
        where: {
          name: {
            in: uniqueNames,
          },
        },
      });

      await (tx as any).postHashtag.deleteMany({
        where: { postId },
      });

      if (allHashtags.length > 0) {
        await (tx as any).postHashtag.createMany({
          data: allHashtags.map((h: any) => ({
            postId,
            hashtagId: h.id,
          })),
          skipDuplicates: true,
        });
      }
    });
  }

  private extractHashtags(text: string | undefined): string[] {
    if (!text) return [];
    const matches = text.match(/#([\p{L}\p{N}_]+)\b/gu);
    if (!matches) return [];
    return matches.map((tag) => tag.replace(/^#/, ''));
  }

  private async handleKittyBotReplyForPost(postId: string, userText: string) {
    const kittyUser = await this.prisma.user.upsert({
      where: { id: 'kitty-bot' },
      update: {},
      create: {
        id: 'kitty-bot',
        email: 'kitty-bot@example.local',
        username: 'KittyBot',
        displayName: 'Kitty Bot',
      },
    });

    let replyText: string;
    try {
      replyText = await this.aiService.chat(`User: ${userText}\nKitty Bot:`);
      replyText =
        replyText.trim() ||
        'Meow! My whiskers got a bit tangled there. Try asking me again in a slightly different way.';
    } catch (error) {
      console.error(
        'Failed to generate Kitty Bot reply for post mention',
        error,
      );
      replyText =
        'Meow! I tried to reply but something went wrong. Please try tagging me again in a moment.';
    }

    await this.prisma.comment.create({
      data: {
        content: replyText,
        user: { connect: { id: kittyUser.id } },
        post: { connect: { id: postId } },
      },
    });
  }

  private async getForYouFeed(userId: string, page: number, limit: number) {
    const now = new Date();
    const baseSkip = (page - 1) * limit;

    // Target mix per page
    const percentages = {
      following: 0.4,
      recommended: 0.3,
      trending: 0.2,
      random: 0.1,
    } as const;

    const followingTarget = Math.round(limit * percentages.following);
    const recommendedTarget = Math.round(limit * percentages.recommended);
    const trendingTarget = Math.round(limit * percentages.trending);
    let randomTarget =
      limit - followingTarget - recommendedTarget - trendingTarget;

    if (randomTarget < 0) {
      randomTarget = 0;
    }

    // Fetch relationships and interests up front
    const [followingEdges, userLikedHashtags, userOwnPostHashtags] =
      await Promise.all([
        (this.prisma as any).follow.findMany({
          where: { followerId: userId },
          select: { followingId: true },
        }),
        (this.prisma as any).like.findMany({
          where: { userId },
          select: {
            post: {
              select: {
                hashtags: {
                  select: { hashtag: { select: { name: true } } },
                },
              },
            },
          },
        }),
        (this.prisma as any).post.findMany({
          where: { userId },
          select: {
            hashtags: {
              select: { hashtag: { select: { name: true } } },
            },
          },
        }),
      ]);

    const followingIds = new Set(
      followingEdges.map((f: { followingId: string }) => f.followingId),
    );

    const interestHashtags = new Set<string>();
    for (const like of userLikedHashtags as any[]) {
      for (const rel of like.post?.hashtags ?? []) {
        if (rel.hashtag?.name) {
          interestHashtags.add(rel.hashtag.name);
        }
      }
    }
    for (const post of userOwnPostHashtags as any[]) {
      for (const rel of post.hashtags ?? []) {
        if (rel.hashtag?.name) {
          interestHashtags.add(rel.hashtag.name);
        }
      }
    }

    const userFilter = {
      user: {
        blockedBy: {
          none: {
            blockerId: userId,
          },
        },
        blockedUsers: {
          none: {
            blockedId: userId,
          },
        },
      },
    };

    // We fetch a slightly larger pool for each bucket so we can de-duplicate and still hit targets.
    const oversampleFactor = 2;

    const trendingSince = new Date(now.getTime() - 1000 * 60 * 60 * 48); // last 48h

    const [followingPosts, recommendedPosts, trendingPosts, randomPosts] =
      await Promise.all([
        // Following (including own posts)
        (this.prisma as any).post.findMany({
          where: {
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
            ...userFilter,
          },
          orderBy: { createdAt: 'desc' },
          skip: baseSkip,
          take: followingTarget * oversampleFactor,
          include: {
            user: true,
            likes: true,
            comments: true,
            reposts: true,
            originalPost: {
              include: {
                user: true,
                poll: {
                  include: {
                    options: {
                      include: {
                        votes: true,
                      },
                    },
                  },
                },
              },
            },
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
            hashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        }),

        // Recommended: not followed and not self, but sharing interest hashtags
        (this.prisma as any).post.findMany({
          where: {
            userId: {
              notIn: [...followingIds, userId],
            },
            ...(interestHashtags.size
              ? {
                  hashtags: {
                    some: {
                      hashtag: {
                        name: {
                          in: Array.from(interestHashtags),
                        },
                      },
                    },
                  },
                }
              : {}),
            ...userFilter,
          },
          orderBy: { createdAt: 'desc' },
          skip: baseSkip,
          take: recommendedTarget * oversampleFactor,
          include: {
            user: true,
            likes: true,
            comments: true,
            reposts: true,
            originalPost: {
              include: {
                user: true,
                poll: {
                  include: {
                    options: {
                      include: {
                        votes: true,
                      },
                    },
                  },
                },
              },
            },
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
            hashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        }),

        // Trending: globally popular in last 48h (by likes/comments, then recency)
        (this.prisma as any).post.findMany({
          where: {
            createdAt: {
              gte: trendingSince,
            },
            ...userFilter,
          },
          orderBy: [
            { likes: { _count: 'desc' } } as any,
            { comments: { _count: 'desc' } } as any,
            { createdAt: 'desc' },
          ],
          skip: baseSkip,
          take: trendingTarget * oversampleFactor,
          include: {
            user: true,
            likes: true,
            comments: true,
            reposts: true,
            originalPost: {
              include: {
                user: true,
                poll: {
                  include: {
                    options: {
                      include: {
                        votes: true,
                      },
                    },
                  },
                },
              },
            },
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
            hashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        }),

        // Random discovery: posts from non-followed users (any time)
        (this.prisma as any).post.findMany({
          where: {
            userId: {
              notIn: [...followingIds, userId],
            },
            ...userFilter,
          },
          orderBy: { createdAt: 'desc' },
          skip: baseSkip,
          take: randomTarget * oversampleFactor,
          include: {
            user: true,
            likes: true,
            comments: true,
            reposts: true,
            originalPost: {
              include: {
                user: true,
                poll: {
                  include: {
                    options: {
                      include: {
                        votes: true,
                      },
                    },
                  },
                },
              },
            },
            poll: {
              include: {
                options: {
                  include: {
                    votes: true,
                  },
                },
              },
            },
            hashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        }),
      ]);

    // Derive trending hashtags from the trending pool
    const trendingHashtagCounts = new Map<string, number>();
    for (const post of trendingPosts as any[]) {
      for (const rel of post.hashtags ?? []) {
        const name = rel.hashtag?.name;
        if (!name) continue;
        trendingHashtagCounts.set(
          name,
          (trendingHashtagCounts.get(name) ?? 0) + 1,
        );
      }
    }
    const trendingHashtags = new Set(
      Array.from(trendingHashtagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name]) => name),
    );

    const seen = new Set<string>();

    const scorePost = (post: any) =>
      this.scorePostForUser(
        post,
        userId,
        interestHashtags,
        trendingHashtags,
        now,
      );

    const pickFromBucket = (bucket: any[], target: number) => {
      const scored = bucket
        .filter((p) => !seen.has(p.id))
        .map((p) => ({ post: p, score: scorePost(p) }))
        .sort((a, b) => b.score - a.score);

      const picked: any[] = [];
      for (const item of scored) {
        if (picked.length >= target) break;
        seen.add(item.post.id);
        picked.push(item.post);
      }
      return picked;
    };

    const followingPicked = pickFromBucket(
      followingPosts as any[],
      followingTarget,
    );
    const recommendedPicked = pickFromBucket(
      recommendedPosts as any[],
      recommendedTarget,
    );
    const trendingPicked = pickFromBucket(
      trendingPosts as any[],
      trendingTarget,
    );
    const randomPicked = pickFromBucket(randomPosts as any[], randomTarget);

    // If some buckets are under-filled, try to top up from others
    const allBuckets = [
      followingPosts as any[],
      recommendedPosts as any[],
      trendingPosts as any[],
      randomPosts as any[],
    ];
    const combinedPicked = [
      ...followingPicked,
      ...recommendedPicked,
      ...trendingPicked,
      ...randomPicked,
    ];

    if (combinedPicked.length < limit) {
      const flatRemaining = allBuckets
        .flat()
        .filter((p) => !seen.has(p.id))
        .map((p) => ({ post: p, score: scorePost(p) }))
        .sort((a, b) => b.score - a.score);

      for (const item of flatRemaining) {
        if (combinedPicked.length >= limit) break;
        seen.add(item.post.id);
        combinedPicked.push(item.post);
      }
    }

    const data = combinedPicked.map((post) => this.formatPost(post, userId));

    // For now we treat "total" as approximate and infer hasMore from whether we could fill this page.
    return {
      data,
      page,
      limit,
      total: baseSkip + data.length,
      hasMore: data.length === limit,
    };
  }

  private scorePostForUser(
    post: any,
    userId: string,
    interestHashtags: Set<string>,
    trendingHashtags: Set<string>,
    now: Date,
  ): number {
    const likesCount = post.likes?.length ?? 0;
    const commentsCount = post.comments?.length ?? 0;
    const repostsCount = post.reposts?.length ?? 0;

    const createdAt = new Date(post.createdAt);
    const ageMs = now.getTime() - createdAt.getTime();
    const ageHours = ageMs / (1000 * 60 * 60);

    let hashtagScore = 0;
    for (const rel of post.hashtags ?? []) {
      const name = rel.hashtag?.name;
      if (!name) continue;
      if (interestHashtags.has(name)) {
        hashtagScore += 8;
      }
      if (trendingHashtags.has(name)) {
        hashtagScore += 10;
      }
    }

    // Time decay: newer posts get a boost, fading after ~48h
    const freshnessWindowHours = 48;
    const freshness =
      ageHours >= freshnessWindowHours
        ? 0
        : (freshnessWindowHours - ageHours) / freshnessWindowHours;

    const engagementScore =
      likesCount * 3 + commentsCount * 5 + repostsCount * 4;

    let baseScore = engagementScore + hashtagScore + freshness * 20;

    // Slight boost if from the current user (matters when buckets overlap/topping up)
    if (post.userId === userId) {
      baseScore += 5;
    }

    return baseScore;
  }

  private formatPoll(poll: any, currentUserId?: string) {
    if (!poll) return null;
    const isActive = poll.expiresAt
      ? new Date(poll.expiresAt) > new Date()
      : false;
    const totalVotes =
      poll.options?.reduce(
        (sum: number, opt: any) => sum + (opt.votes?.length ?? 0),
        0,
      ) ?? 0;
    const currentUserVoteOptionId = currentUserId
      ? poll.options?.find((opt: any) =>
          opt.votes?.some((v: any) => v.userId === currentUserId),
        )?.id
      : undefined;
    return {
      id: poll.id,
      question: poll.question,
      expiresAt: poll.expiresAt,
      isActive,
      totalVotes,
      options:
        poll.options?.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          votesCount: opt.votes?.length ?? 0,
        })) ?? [],
      currentUserVoteOptionId: currentUserVoteOptionId,
    };
  }

  private formatPost(post: any, currentUserId?: string) {
    const isReposted =
      !!currentUserId &&
      ((post.userId === currentUserId && !!post.originalPostId) ||
        post.reposts?.some((r: any) => r.userId === currentUserId));

    const reposterId = post.originalPost ? post.user?.id : undefined;
    const reposterUsername = post.originalPost
      ? post.user?.username
      : undefined;

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
      isReposted,

      isRepost: !!post.originalPost,
      reposterId,
      reposterUsername,
      originalPostId: post.originalPost?.id,
      originalAuthorId: post.originalPost?.user?.id,
      originalAuthorUsername: post.originalPost?.user?.username,
      originalPostContent: post.originalPost?.content,
      originalPostImageUrl: post.originalPost?.imageUrl,
      originalPostGifUrl: post.originalPost?.gifUrl,
      originalPostPoll: this.formatPoll(post.originalPost?.poll, currentUserId),
      hashtags:
        post.hashtags
          ?.map((relation: any) => relation.hashtag?.name)
          .filter(Boolean) ?? [],
      poll: this.formatPoll(post.poll, currentUserId),
    };
  }
}
