import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async search(query: string): Promise<
    Array<{
      id: string;
      username: string;
      displayName?: string;
      email: string;
      bio?: string;
      avatarUrl?: string;
    }>
  > {
    if (!query || query.length < 2) {
      return [];
    }

    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .orWhere('LOWER(user.email) LIKE LOWER(:query)', { query: `%${query}%` })
      .take(10)
      .getMany();

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    }));
  }

  async getProfile(userId: string): Promise<{
    id: string;
    username: string;
    displayName?: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  } | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'followers', 'following'],
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      postsCount: user.posts?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }

  async getProfileByUsername(username: string): Promise<{
    id: string;
    username: string;
    displayName?: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  } | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['posts', 'followers', 'following'],
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      postsCount: user.posts?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }

  async updateProfile(
    userId: string,
    updates: { displayName?: string; bio?: string; avatarUrl?: string },
  ): Promise<{
    id: string;
    username: string;
    displayName?: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  } | null> {
    await this.usersRepository.update(userId, updates);
    return this.getProfile(userId);
  }
}
