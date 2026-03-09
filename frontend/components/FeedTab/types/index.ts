export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  gifUrl?: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName?: string;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  isLiked: boolean;
  isReposted: boolean;
  isRepost?: boolean;
  reposterId?: string;
  reposterUsername?: string;
  originalPostId?: string;
  originalAuthorId?: string;
  originalAuthorUsername?: string;
  originalPostContent?: string;
  originalPostImageUrl?: string;
  originalPostGifUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
  };
}

export interface CreatePostForm {
  postId?: string;
  isReposted?: boolean;
  content: string;
  imageUrl?: string;
  gifUrl?: string;
}
