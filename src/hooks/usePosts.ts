import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostData, PostFilters, UpdatePostData } from '@/services/postService';
import { websocketService } from '@/services/websocketService';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const usePosts = (filters: PostFilters = {}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribePost = websocketService.on('post_update', () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    });
    const unsubscribeComment = websocketService.on('comment_new', () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    });

    return () => {
      unsubscribePost();
      unsubscribeComment();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const useTrendingTopics = (limit = 10) => {
  return useQuery({
    queryKey: ['trending-topics', limit],
    queryFn: () => postService.getTrendingTopics(limit),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) => 
      postService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update post');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: string; isLiked: boolean }) =>
      isLiked ? postService.unlikePost(id) : postService.likePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useVotePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'upvote' | 'downvote' }) =>
      type === 'upvote' ? postService.upvotePost(id) : postService.downvotePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.repostPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Reposted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to repost');
    },
  });
};
