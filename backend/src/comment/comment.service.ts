import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    postId: string,
    content: string,
  ) {
    return this.prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
      include: {
        user: true,
      },
    });
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

