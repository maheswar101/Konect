export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isAnonymous?: boolean;
  };
  content: string;
  media?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  upvotes: number;
  downvotes: number;
  isLiked?: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  community?: string;
  communityId?: string;
  type: "post" | "thread" | "poll" | "debate";
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isAnonymous?: boolean;
  };
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
}

export interface TrendingTopic {
  id: string;
  name: string;
  posts: number;
  category: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: string;
  color: string;
  isJoined?: boolean;
  banner?: string;
  rules?: string[];
  moderators?: string[];
  createdAt?: string;
  onlineMembers?: number;
  category?: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "repost" | "follow" | "mention" | "community";
  actor: { name: string; avatar: string; handle: string };
  content: string;
  timestamp: string;
  read: boolean;
  postId?: string;
}
