import {
  communities as seedCommunities,
  mockComments as seedComments,
  mockNotifications as seedNotifications,
  mockPosts as seedPosts,
} from '@/data/mockData';
import { Comment, Community, Notification, Post } from '@/types/social';

const POSTS_KEY = 'mock_posts';
const COMMENTS_KEY = 'mock_comments';
const COMMUNITIES_KEY = 'mock_communities';
const NOTIFICATIONS_KEY = 'mock_notifications';
const MOCK_CURRENT_USER_KEY = 'mock_auth_current_user';

interface MockUser {
  id: string;
  username: string;
}

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;

const read = <T>(key: string, seed: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // Ignore malformed local cache and re-seed.
  }

  const seeded = clone(seed);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
};

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readPosts = (): Post[] => read<Post[]>(POSTS_KEY, seedPosts as Post[]);
const readComments = (): Comment[] => read<Comment[]>(COMMENTS_KEY, seedComments as Comment[]);
const readCommunities = (): Community[] => read<Community[]>(COMMUNITIES_KEY, seedCommunities as Community[]);
const readNotifications = (): Notification[] =>
  read<Notification[]>(NOTIFICATIONS_KEY, seedNotifications as Notification[]);

const writePosts = (posts: Post[]) => write(POSTS_KEY, posts);
const writeComments = (comments: Comment[]) => write(COMMENTS_KEY, comments);
const writeCommunities = (communities: Community[]) => write(COMMUNITIES_KEY, communities);
const writeNotifications = (notifications: Notification[]) => write(NOTIFICATIONS_KEY, notifications);

const normalizeTimestamp = () => new Date().toISOString();

const getCurrentUser = (): MockUser | null => {
  try {
    const raw = localStorage.getItem(MOCK_CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { id?: string; username?: string };
    if (!parsed.id || !parsed.username) {
      return null;
    }
    return { id: parsed.id, username: parsed.username };
  } catch {
    return null;
  }
};

const buildAuthor = (isAnonymous?: boolean) => {
  if (isAnonymous) {
    return { name: 'Anonymous', handle: '@anonymous', avatar: '?', isAnonymous: true };
  }

  const user = getCurrentUser();
  const username = user?.username || 'demo_user';
  return {
    name: username,
    handle: `@${username}`,
    avatar: username.slice(0, 2).toUpperCase() || 'DU',
  };
};

const updateNestedComment = (
  comments: Comment[],
  matcher: (comment: Comment) => boolean,
  updater: (comment: Comment) => Comment
): Comment[] => {
  return comments.map((comment) => {
    if (matcher(comment)) {
      return updater(comment);
    }

    if (comment.replies?.length) {
      return {
        ...comment,
        replies: updateNestedComment(comment.replies, matcher, updater),
      };
    }

    return comment;
  });
};

const removeNestedComment = (comments: Comment[], id: string): Comment[] => {
  const filtered = comments
    .filter((comment) => comment.id !== id)
    .map((comment) => ({
      ...comment,
      replies: comment.replies ? removeNestedComment(comment.replies, id) : undefined,
    }));
  return filtered;
};

const findCommentById = (comments: Comment[], id: string): Comment | null => {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies?.length) {
      const nested = findCommentById(comment.replies, id);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
};

export const mockStore = {
  getPosts(filters: {
    communityId?: string;
    userId?: string;
    type?: string;
    tags?: string[];
    sortBy?: 'recent' | 'trending' | 'top';
    limit?: number;
    offset?: number;
  }): Post[] {
    let posts = readPosts();

    if (filters.communityId) {
      posts = posts.filter((post) => post.communityId === filters.communityId);
    }
    if (filters.type) {
      posts = posts.filter((post) => post.type === filters.type);
    }
    if (filters.tags?.length) {
      posts = posts.filter((post) => filters.tags!.every((tag) => post.tags?.includes(tag)));
    }

    if (filters.sortBy === 'trending') {
      posts = [...posts].sort((a, b) => b.upvotes + b.likes - (a.upvotes + a.likes));
    } else if (filters.sortBy === 'top') {
      posts = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    }

    const start = filters.offset || 0;
    const end = filters.limit ? start + filters.limit : undefined;
    return posts.slice(start, end);
  },

  getPostById(id: string): Post {
    const post = readPosts().find((item) => item.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  createPost(data: {
    content: string;
    type: 'post' | 'thread' | 'poll' | 'debate';
    communityId?: string;
    tags?: string[];
    isAnonymous?: boolean;
  }): Post {
    const posts = readPosts();
    const communities = readCommunities();
    const community = communities.find((item) => item.id === data.communityId);
    const post: Post = {
      id: crypto.randomUUID(),
      author: buildAuthor(data.isAnonymous),
      content: data.content,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      reposts: 0,
      upvotes: 1,
      downvotes: 0,
      isLiked: false,
      isUpvoted: false,
      isDownvoted: false,
      community: community?.name,
      communityId: data.communityId,
      type: data.type,
      tags: data.tags || [],
    };

    posts.unshift(post);
    writePosts(posts);
    return post;
  },

  updatePost(id: string, data: { content?: string; tags?: string[] }): Post {
    const posts = readPosts();
    const index = posts.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    posts[index] = { ...posts[index], ...data };
    writePosts(posts);
    return posts[index];
  },

  deletePost(id: string): void {
    const posts = readPosts().filter((item) => item.id !== id);
    writePosts(posts);
    const comments = readComments().filter((item) => item.postId !== id);
    writeComments(comments);
  },

  toggleLikePost(id: string, like: boolean): void {
    const posts = readPosts();
    const index = posts.findIndex((item) => item.id === id);
    if (index === -1) return;
    const current = posts[index];
    const nextLikes = Math.max(0, current.likes + (like ? 1 : -1));
    posts[index] = { ...current, likes: nextLikes, isLiked: like };
    writePosts(posts);
  },

  votePost(id: string, type: 'upvote' | 'downvote'): void {
    const posts = readPosts();
    const index = posts.findIndex((item) => item.id === id);
    if (index === -1) return;

    const post = posts[index];
    if (type === 'upvote') {
      posts[index] = {
        ...post,
        upvotes: post.upvotes + 1,
        isUpvoted: true,
        isDownvoted: false,
      };
    } else {
      posts[index] = {
        ...post,
        downvotes: post.downvotes + 1,
        isDownvoted: true,
        isUpvoted: false,
      };
    }
    writePosts(posts);
  },

  repostPost(id: string): void {
    const posts = readPosts();
    const index = posts.findIndex((item) => item.id === id);
    if (index === -1) return;
    posts[index] = { ...posts[index], reposts: posts[index].reposts + 1 };
    writePosts(posts);
  },

  getCommentsByPostId(postId: string): Comment[] {
    return readComments().filter((comment) => comment.postId === postId && !comment.parentId);
  },

  createComment(data: { postId: string; content: string; parentId?: string; isAnonymous?: boolean }): Comment {
    const comments = readComments();
    const newComment: Comment = {
      id: crypto.randomUUID(),
      postId: data.postId,
      parentId: data.parentId,
      author: buildAuthor(data.isAnonymous),
      content: data.content,
      timestamp: 'now',
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    if (!data.parentId) {
      comments.unshift(newComment);
    } else {
      const updated = updateNestedComment(
        comments,
        (comment) => comment.id === data.parentId,
        (comment) => ({
          ...comment,
          replies: [...(comment.replies || []), newComment],
        })
      );
      writeComments(updated);
    }

    if (!data.parentId) {
      writeComments(comments);
    }

    const posts = readPosts();
    const postIndex = posts.findIndex((item) => item.id === data.postId);
    if (postIndex !== -1) {
      posts[postIndex] = { ...posts[postIndex], comments: posts[postIndex].comments + 1 };
      writePosts(posts);
    }

    return newComment;
  },

  updateComment(id: string, content: string): Comment {
    const comments = readComments();
    const found = findCommentById(comments, id);
    if (!found) {
      throw new Error('Comment not found');
    }
    const updated = updateNestedComment(
      comments,
      (comment) => comment.id === id,
      (comment) => ({ ...comment, content })
    );
    writeComments(updated);
    return { ...found, content };
  },

  deleteComment(id: string): void {
    const comments = readComments();
    const found = findCommentById(comments, id);
    if (!found) {
      return;
    }
    const updated = removeNestedComment(comments, id);
    writeComments(updated);

    const posts = readPosts();
    const postIndex = posts.findIndex((item) => item.id === found.postId);
    if (postIndex !== -1) {
      posts[postIndex] = { ...posts[postIndex], comments: Math.max(0, posts[postIndex].comments - 1) };
      writePosts(posts);
    }
  },

  voteComment(id: string, type: 'upvote' | 'downvote'): void {
    const comments = readComments();
    const updated = updateNestedComment(comments, (comment) => comment.id === id, (comment) => ({
      ...comment,
      upvotes: type === 'upvote' ? comment.upvotes + 1 : comment.upvotes,
      downvotes: type === 'downvote' ? comment.downvotes + 1 : comment.downvotes,
    }));
    writeComments(updated);
  },

  getCommunities(): Community[] {
    return readCommunities();
  },

  getCommunityById(id: string): Community {
    const community = readCommunities().find((item) => item.id === id);
    if (!community) {
      throw new Error('Community not found');
    }
    return community;
  },

  getJoinedCommunities(): Community[] {
    return readCommunities().filter((item) => item.isJoined);
  },

  createCommunity(data: {
    name: string;
    description: string;
    icon: string;
    color: string;
    category: string;
    rules?: string[];
  }): Community {
    const communities = readCommunities();
    const created: Community = {
      id: crypto.randomUUID(),
      members: 1,
      onlineMembers: 1,
      createdAt: normalizeTimestamp(),
      isJoined: true,
      ...data,
    };
    communities.unshift(created);
    writeCommunities(communities);
    return created;
  },

  updateCommunity(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      color: string;
      category: string;
      rules?: string[];
    }>
  ): Community {
    const communities = readCommunities();
    const index = communities.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Community not found');
    }
    communities[index] = { ...communities[index], ...data };
    writeCommunities(communities);
    return communities[index];
  },

  joinCommunity(id: string): void {
    const communities = readCommunities();
    const index = communities.findIndex((item) => item.id === id);
    if (index === -1) return;
    communities[index] = {
      ...communities[index],
      isJoined: true,
      members: communities[index].members + 1,
    };
    writeCommunities(communities);
  },

  leaveCommunity(id: string): void {
    const communities = readCommunities();
    const index = communities.findIndex((item) => item.id === id);
    if (index === -1) return;
    communities[index] = {
      ...communities[index],
      isJoined: false,
      members: Math.max(0, communities[index].members - 1),
    };
    writeCommunities(communities);
  },

  getCommunityPosts(id: string, sortBy: 'recent' | 'trending' | 'top'): Post[] {
    return this.getPosts({ communityId: id, sortBy });
  },

  getNotifications(): Notification[] {
    return readNotifications();
  },

  markNotificationAsRead(id: string): void {
    const notifications = readNotifications().map((item) => (item.id === id ? { ...item, read: true } : item));
    writeNotifications(notifications);
  },

  markAllNotificationsAsRead(): void {
    const notifications = readNotifications().map((item) => ({ ...item, read: true }));
    writeNotifications(notifications);
  },

  deleteNotification(id: string): void {
    const notifications = readNotifications().filter((item) => item.id !== id);
    writeNotifications(notifications);
  },

  getUnreadNotificationCount(): number {
    return readNotifications().filter((item) => !item.read).length;
  },
};
