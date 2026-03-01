import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService, CreateCommunityData } from '@/services/communityService';
import { toast } from 'sonner';

export const useCommunities = () => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => communityService.getCommunities(),
    staleTime: 60000, // 1 minute
  });
};

export const useCommunity = (id: string) => {
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => communityService.getCommunityById(id),
    enabled: !!id,
  });
};

export const useJoinedCommunities = () => {
  return useQuery({
    queryKey: ['communities', 'joined'],
    queryFn: () => communityService.getJoinedCommunities(),
    staleTime: 30000,
  });
};

export const useCommunityPosts = (id: string, sortBy: 'recent' | 'trending' | 'top' = 'recent') => {
  return useQuery({
    queryKey: ['community', id, 'posts', sortBy],
    queryFn: () => communityService.getCommunityPosts(id, sortBy),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommunityData) => communityService.createCommunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast.success('Community created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create community');
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isJoined }: { id: string; isJoined: boolean }) =>
      isJoined ? communityService.leaveCommunity(id) : communityService.joinCommunity(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast.success(variables.isJoined ? 'Left community' : 'Joined community!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update community membership');
    },
  });
};
