import { Movie, Comment } from '@/types/index';
import axios from 'axios'; // Import axios

// TODO: Replace with actual API endpoints
const API_BASE_URL = '/api';

export const moviesApi = {
  // Get all movies sorted by score
  getMovies: async (): Promise<Movie[]> => {
    const response = await fetch('/api/movies');
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const result = await response.json();
    return result.data;
  },

  // Get single movie by ID
  getMovie: async (id: string): Promise<Movie | null> => {
    const response = await fetch(`/api/movies/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch movie');
    }
    const result = await response.json();
    
    if (!result.data) return null;
    
    // Transform the data to match frontend expectations
    return {
      ...result.data,
      addedBy: {
        name: result.data.addedBy?.name || 'Unknown'
      },
      upvotes: result.data.upvotes || 0,
      downvotes: result.data.downvotes || 0,
      score: result.data.score || 0
    };
  },

  // Get user's vote for a movie
  getUserVote: async (movieId: string): Promise<1 | -1 | null> => {
    const response = await axios.get<{ vote: 1 | -1 | null }>(`/api/votes/${movieId}`);
    return response.data.vote;
  },

  voteMovie: async (movieId: string, voteType: 'upvote' | 'downvote' | 'remove'): Promise<{
    upvotes: number;
    downvotes: number;
    score: number;
  }> => {
    const response = await axios.post<{
      upvotes: number;
      downvotes: number;
      score: number;
    }>(`/api/votes/${movieId}`, { voteType });
    return response.data;
  },

  // Get comments for a movie
  getMovieComments: async (movieId: string): Promise<Comment[]> => {
    const response = await fetch(`/api/comments/movie/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return await response.json();
  },

  // Add comment to movie
  addComment: async (movieId: string, content: string): Promise<Comment> => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        movieId,
        body: content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }

    const result = await response.json();
    return result.data;
  },

  // Update existing comment
  // updateComment: async (id: string, content: string): Promise<Comment> => {
  //   // TODO: integrate with backend PUT /api/comments/:id
  //   await new Promise(resolve => setTimeout(resolve, 300));
  //
  //   const comment = mockComments.find(c => c.id === id);
  //   if (!comment) throw new Error('Comment not found');
  //
  //   comment.content = content;
  //   comment.updatedAt = new Date().toISOString();
  //
  //   return comment;
  // },

  // Add new movie recommendation
  addMovie: async (
    movieData: { title: string; description: string; year?: number; genres?: string[] },
    image?: File // single file instead of File[]
  ): Promise<Movie> => {
    const formData = new FormData();
    formData.append('title', movieData.title);
    formData.append('description', movieData.description);
    if (movieData.year) formData.append('year', movieData.year.toString());
    if (movieData.genres && movieData.genres.length > 0) {
      formData.append('genres', JSON.stringify(movieData.genres));
    }

    // match backend field name exactly
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch('/api/movies', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add movie');
    }

    const result = await response.json();
    return result.data;
  },

  // Delete movie (admin only)
  // deleteMovie: async (id: string): Promise<void> => {
  //   // TODO: integrate with backend DELETE /api/movies/:id
  //   await new Promise(resolve => setTimeout(resolve, 300));
  //   const index = mockMovies.findIndex(m => m.id === id);
  //   if (index > -1) {
  //     mockMovies.splice(index, 1);
  //   }
  // },

  // Delete comment (admin only)
  // deleteComment: async (id: string): Promise<void> => {
  //   // TODO: integrate with backend DELETE /api/comments/:id
  //   await new Promise(resolve => setTimeout(resolve, 300));
  //   const index = mockComments.findIndex(c => c.id === id);
  //   if (index > -1) {
  //     mockComments.splice(index, 1);
  //   }
  // },
};
