import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { websocketService } from '@/services/websocketService';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 30000,
  });

  // Listen for real-time notifications
  useEffect(() => {
    const unsubscribe = websocketService.on('notification', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      
      // Show toast for new notification
      toast.info(data.content, {
        duration: 5000,
      });
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};

export const useUnreadCount = (enabled = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    staleTime: 10000,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = websocketService.on('notification', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};
