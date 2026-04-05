'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, likeComment, postComment } from '@/lib/api/comments';
import { Comment } from '@/types';

export const commentKeys = {
  list: (articleId: string) => ['comments', articleId] as const,
};

export function useComments(articleSlug: string) {
  return useQuery({
    queryKey: commentKeys.list(articleSlug),
    queryFn: async () => {
      const res = await getComments(articleSlug);
      return res.data as Comment[];
    },
    enabled: !!articleSlug,
  });
}

export function usePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { articleId: string; articleSlug: string; content: string }) => 
      postComment({ articleId: variables.articleId, articleSlug: variables.articleSlug, content: variables.content }),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches for this article's comments
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.list(newComment.articleSlug) 
      });

      // Get the previous comments for this article
      const previousComments = queryClient.getQueryData<Comment[]>(
        commentKeys.list(newComment.articleSlug)
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
          commentKeys.list(newComment.articleSlug),
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
          commentKeys.list(newComment.articleSlug),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.articleSlug) 
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
