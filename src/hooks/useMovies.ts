import { useState, useEffect } from 'react';
import { getMovies, addMovie, voteMovie } from '../lib/api';
import { Movie } from '../types';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data } = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const createMovie = async (title: string, description: string) => {
    try {
      await addMovie(title, description);
      await fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    }
  };

  const vote = async (movieId: string, voteType: 'up' | 'down') => {
    try {
      await voteMovie(movieId, voteType);
      await fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to vote');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, loading, error, createMovie, vote, refresh: fetchMovies };
};
