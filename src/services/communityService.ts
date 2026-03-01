import { apiClient, shouldUseMockFallback } from './api';
import { mockStore } from './mockStore';
import { Community, Post } from '@/types/social';

export interface CreateCommunityData {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rules?: string[];
}

export interface CommunityMember {
  id: string;
  username: string;
  avatar?: string;
  role?: string;
}

class CommunityService {
  async getCommunities(): Promise<Community[]> {
    try {
      return await apiClient.get<Community[]>('/communities');
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getCommunities();
      }
      throw error;
    }
  }

  async getCommunityById(id: string): Promise<Community> {
    try {
      return await apiClient.get<Community>(`/communities/${id}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getCommunityById(id);
      }
      throw error;
    }
  }

  async createCommunity(data: CreateCommunityData): Promise<Community> {
    try {
      return await apiClient.post<Community>('/communities', data);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.createCommunity(data);
      }
      throw error;
    }
  }

  async updateCommunity(id: string, data: Partial<CreateCommunityData>): Promise<Community> {
    try {
      return await apiClient.patch<Community>(`/communities/${id}`, data);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.updateCommunity(id, data);
      }
      throw error;
    }
  }

  async joinCommunity(id: string): Promise<void> {
    try {
      await apiClient.post(`/communities/${id}/join`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.joinCommunity(id);
        return;
      }
      throw error;
    }
  }

  async leaveCommunity(id: string): Promise<void> {
    try {
      await apiClient.delete(`/communities/${id}/join`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.leaveCommunity(id);
        return;
      }
      throw error;
    }
  }

  async getJoinedCommunities(): Promise<Community[]> {
    try {
      return await apiClient.get<Community[]>('/communities/joined');
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getJoinedCommunities();
      }
      throw error;
    }
  }

  async getCommunityMembers(id: string): Promise<CommunityMember[]> {
    try {
      return await apiClient.get<CommunityMember[]>(`/communities/${id}/members`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        const community = mockStore.getCommunityById(id);
        const moderators = community.moderators || [];
        return moderators.map((username, index) => ({
          id: `${id}-mod-${index + 1}`,
          username: username.replace('@', ''),
          avatar: username.slice(1, 3).toUpperCase(),
          role: 'moderator',
        }));
      }
      throw error;
    }
  }

  async getCommunityPosts(id: string, sortBy: 'recent' | 'trending' | 'top' = 'recent'): Promise<Post[]> {
    try {
      return await apiClient.get<Post[]>(`/communities/${id}/posts?sortBy=${sortBy}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getCommunityPosts(id, sortBy);
      }
      throw error;
    }
  }
}

export const communityService = new CommunityService();
