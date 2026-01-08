import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async likePost(userId: string, postId: string): Promise<Like> {
    const existing = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });

    if (existing) {
      return existing;
    }

    const like = this.likeRepository.create({
      user: { id: userId },
      post: { id: postId },
    });
    const saved = await this.likeRepository.save(like);
    return saved;
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await this.likeRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });
  }
}
