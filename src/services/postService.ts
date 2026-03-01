import { apiClient, shouldUseMockFallback } from './api';
import { mockStore } from './mockStore';
import { Post, TrendingTopic } from '@/types/social';

export interface CreatePostData {
  content: string;
  type: 'post' | 'thread' | 'poll' | 'debate';
  communityId?: string;
  tags?: string[];
  media?: File[];
  isAnonymous?: boolean;
}

export interface UpdatePostData {
  content?: string;
  tags?: string[];
}

export interface PostFilters {
  communityId?: string;
  userId?: string;
  type?: string;
  tags?: string[];
  sortBy?: 'recent' | 'trending' | 'top';
  limit?: number;
  offset?: number;
}

class PostService {
  async getPosts(filters: PostFilters = {}): Promise<Post[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const query = params.toString();
    try {
      return await apiClient.get<Post[]>(`/posts${query ? `?${query}` : ''}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getPosts(filters);
      }
      throw error;
    }
  }

  async getPostById(id: string): Promise<Post> {
    try {
      return await apiClient.get<Post>(`/posts/${id}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getPostById(id);
      }
      throw error;
    }
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const hasMedia = data.media && data.media.length > 0;

    if (hasMedia) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'media' && Array.isArray(value)) {
          value.forEach((file) => formData.append('media', file));
        } else if (value !== undefined) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
      try {
        return await apiClient.post<Post>('/posts', formData);
      } catch (error) {
        if (shouldUseMockFallback(error)) {
          return mockStore.createPost({
            content: data.content,
            type: data.type,
            communityId: data.communityId,
            tags: data.tags,
            isAnonymous: data.isAnonymous,
          });
        }
        throw error;
      }
    }

    try {
      return await apiClient.post<Post>('/posts', data);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.createPost({
          content: data.content,
          type: data.type,
          communityId: data.communityId,
          tags: data.tags,
          isAnonymous: data.isAnonymous,
        });
      }
      throw error;
    }
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    try {
      return await apiClient.patch<Post>(`/posts/${id}`, data);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.updatePost(id, data);
      }
      throw error;
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.deletePost(id);
        return;
      }
      throw error;
    }
  }

  async likePost(id: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${id}/like`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.toggleLikePost(id, true);
        return;
      }
      throw error;
    }
  }

  async unlikePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${id}/like`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.toggleLikePost(id, false);
        return;
      }
      throw error;
    }
  }

  async upvotePost(id: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${id}/upvote`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.votePost(id, 'upvote');
        return;
      }
      throw error;
    }
  }

  async downvotePost(id: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${id}/downvote`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.votePost(id, 'downvote');
        return;
      }
      throw error;
    }
  }

  async repostPost(id: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${id}/repost`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.repostPost(id);
        return;
      }
      throw error;
    }
  }

  async getTrendingTopics(limit = 10): Promise<TrendingTopic[]> {
    try {
      return await apiClient.get<TrendingTopic[]>(`/trending/topics?limit=${limit}`);
    } catch (error) {
      const posts = await this.getPosts({ sortBy: 'trending', limit: 200 });
      const tagCounts = new Map<string, number>();
      posts.forEach((post) => {
        post.tags?.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count], index) => ({
          id: `${index + 1}`,
          name,
          posts: count,
          category: 'Tag',
        }));
    }
  }
}

export const postService = new PostService();
