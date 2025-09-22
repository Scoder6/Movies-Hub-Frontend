import axios from 'axios';
import type { User, Movie, Comment } from '../types';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Auth API
export const login = (email: string, password: string) =>
  api.post<User>('/auth/login', { email, password }).then(res => res.data);

export const signup = (name: string, email: string, password: string) =>
  api.post<User>('/auth/signup', { name, email, password }).then(res => res.data);

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = () =>
  api.get<User | null>('/auth/me').then(res => res.data);

// Movies API
export const getMovies = () =>
  api.get<Movie[]>('/movies').then(res => res.data);

export const addMovie = (title: string, description: string) =>
  api.post<Movie>('/movies', { title, description }).then(res => res.data);

// Votes API
export const voteMovie = (movieId: string, voteType: 'up' | 'down') =>
  api.post('/votes', { movieId, voteType });

// Comments API
export const getComments = (movieId: string) =>
  api.get<Comment[]>(`/comments/movie/${movieId}`).then(res => res.data);

export const addComment = (movieId: string, body: string) =>
  api.post<Comment>('/comments', { movieId, body }).then(res => res.data);

export const deleteComment = (commentId: string) =>
  api.delete(`/comments/${commentId}`);

// Admin API
export const getTopMovies = () =>
  api.get<Movie[]>('/admin/top-movies').then(res => res.data);

export const deleteMovie = (movieId: string) =>
  api.delete(`/admin/movies/${movieId}`);

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if not already on the login/signup page
    if (error.response?.status === 401 && !window.location.pathname.includes('/auth/')) {
      // Use replaceState to prevent adding to history stack
      window.history.replaceState({}, '', '/auth/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    return Promise.reject(error);
  }
);
