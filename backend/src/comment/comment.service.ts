import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(
    userId: string,
    postId: string,
    content: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      content,
      user: { id: userId },
      post: { id: postId },
    });
    return this.commentRepository.save(comment);
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
