import { apiClient, shouldUseMockFallback } from './api';
import { mockStore } from './mockStore';
import { Notification } from '@/types/social';

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      return await apiClient.get<Notification[]>('/notifications');
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getNotifications();
      }
      throw error;
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.markNotificationAsRead(id);
        return;
      }
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/read-all');
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.markAllNotificationsAsRead();
        return;
      }
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        mockStore.deleteNotification(id);
        return;
      }
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
      return response.count;
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        return mockStore.getUnreadNotificationCount();
      }
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
