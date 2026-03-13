export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  gifUrl?: string;
  avatarUrl?: string;
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
  originalPostPoll?: {
    id: string;
    question?: string;
    expiresAt: string;
    isActive: boolean;
    totalVotes: number;
    options: {
      id: string;
      text: string;
      votesCount: number;
    }[];
    currentUserVoteOptionId?: string;
  } | null;
  collectionName?: string | null;
  hashtags?: string[];
  poll?: {
    id: string;
    question?: string;
    expiresAt: string;
    isActive: boolean;
    totalVotes: number;
    options: {
      id: string;
      text: string;
      votesCount: number;
    }[];
    currentUserVoteOptionId?: string;
  } | null;
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
  pollQuestion?: string;
  pollOption1?: string;
  pollOption2?: string;
  pollOption3?: string;
  pollOption4?: string;
  pollDurationMinutes?: number;
}
