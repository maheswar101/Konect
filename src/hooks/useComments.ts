import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService, CreateCommentData } from '@/services/commentService';
import { websocketService } from '@/services/websocketService';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useComments = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = websocketService.on('comment_new', (data) => {
      if (data?.postId === postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
    });
    return unsubscribe;
  }, [postId, queryClient]);

  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getCommentsByPostId(postId),
    enabled: !!postId,
    staleTime: 30000,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentService.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      toast.success('Comment added!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      commentService.updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'upvote' | 'downvote'; postId: string }) =>
      type === 'upvote' ? commentService.upvoteComment(id) : commentService.downvoteComment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
};
