import { useState } from 'react';
import { getComments, addComment, deleteComment } from '../lib/api';
import { Comment } from '../types';

export const useComments = (movieId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await getComments(movieId);
      setComments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (body: string) => {
    try {
      await addComment(movieId, body);
      await fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return { comments, loading, error, createComment, deleteComment: removeComment, refresh: fetchComments };
};
