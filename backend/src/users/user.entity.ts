import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Follow } from '../follow/follow.entity';
import { Like } from '../like/like.entity';
import { Comment } from '../comment/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @OneToMany(() => Follow, (follow: Follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow: Follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Like, (like: Like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
