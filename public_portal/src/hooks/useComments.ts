'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, likeComment, postComment } from '@/lib/api/comments';
import { Comment } from '@/types';

export const commentKeys = {
  list: (articleId: string) => ['comments', articleId] as const,
};

export function useComments(articleId: string) {
  return useQuery({
    queryKey: commentKeys.list(articleId),
    queryFn: async () => {
      const res = await getComments(articleId);
      return res.data as Comment[];
    },
    enabled: !!articleId,
  });
}

export function usePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { articleId: string; content: string }) => 
      postComment({ articleId: variables.articleId, content: variables.content }),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches for this article's comments
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.list(newComment.articleId) 
      });

      // Get the previous comments for this article
      const previousComments = queryClient.getQueryData<Comment[]>(
        commentKeys.list(newComment.articleId)
      );

      // Create optimistic comment with temporary ID
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        content: newComment.content,
        createdAt: new Date().toISOString(),
        editedAt: null,
        likesCount: 0,
        liked: false,
        user: {
          id: '',
          name: 'You',
          profilePhoto: null,
        },
        replies: [],
      };

      // Optimistically update the cache
      if (previousComments) {
        queryClient.setQueryData<Comment[]>(
          commentKeys.list(newComment.articleId),
          [optimisticComment, ...previousComments]
        );
      }

      // Return context with previous data for rollback
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // Rollback to previous data on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(newComment.articleId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.articleId) 
      });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => likeComment(id),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.id) });
    },
  });
}
