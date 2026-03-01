import { apiClient, shouldUseMockFallback } from './api';
import { mockStore } from './mockStore';
import { Comment } from '@/types/social';

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
  isAnonymous?: boolean;
}

class CommentService {
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      return await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getCommentsByPostId(postId);
      }
      throw error;
    }
  }

  async createComment(data: CreateCommentData): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/posts/${data.postId}/comments`, data);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.createComment(data);
      }
      throw error;
    }
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    try {
      return await apiClient.patch<Comment>(`/comments/${id}`, { content });
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.updateComment(id, content);
      }
      throw error;
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      await apiClient.delete(`/comments/${id}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.deleteComment(id);
        return;
      }
      throw error;
    }
  }

  async upvoteComment(id: string): Promise<void> {
    try {
      await apiClient.post(`/comments/${id}/upvote`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.voteComment(id, 'upvote');
        return;
      }
      throw error;
    }
  }

  async downvoteComment(id: string): Promise<void> {
    try {
      await apiClient.post(`/comments/${id}/downvote`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.voteComment(id, 'downvote');
        return;
      }
      throw error;
    }
  }
}

export const commentService = new CommentService();
