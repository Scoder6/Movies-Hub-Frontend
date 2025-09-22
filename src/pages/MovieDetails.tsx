import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, Star, Users, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoteButton } from '@/components/VoteButton';
import { CommentList } from '@/components/CommentList';
import { SEO, getMovieStructuredData } from '@/components/SEO';
import { moviesApi } from '@/api/movies';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Comment } from '@/types';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: movie, 
    isLoading: movieLoading,
    isError: movieError,
    error: movieFetchError
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => {
      if (!id) throw new Error('No movie ID provided');
      return moviesApi.getMovie(id);
    },
    retry: 1,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  useEffect(() => {
    if (movieError && movieFetchError) {
      toast({
        title: 'Error loading movie',
        description: 'Failed to fetch movie details',
        variant: 'destructive'
      });
    }
  }, [movieError, movieFetchError, toast]);

  const { 
    data: comments = [], 
    isLoading: commentsLoading, 
    refetch: refetchComments 
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => {
      if (!id) throw new Error('No movie ID provided');
      return moviesApi.getMovieComments(id);
    },
    enabled: !!id && !movieError
  });

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (movieLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-muted rounded-lg aspect-[2/3]"></div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie || movieError) {
    return <Navigate to="/" replace />;
  }

  const transformedComments = comments.map(comment => ({
    id: comment._id,
    movieId: id,
    content: typeof comment.body === 'string' ? comment.body : String(comment.body),
    author: typeof comment.user === 'object' ? comment.user.name : String(comment.user),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt || comment.createdAt,
  }));

  const handleVote = async (movieId: string, voteType: 'upvote' | 'downvote') => {
    try {
      await moviesApi.voteMovie(movieId, voteType);
      toast({
        title: voteType === 'upvote' ? 'Upvoted!' : 'Downvoted!',
        description: 'Your vote has been recorded',
      });
    } catch (error) {
      toast({
        title: 'Vote failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async (content: string) => {
    if (!id) return;
    
    try {
      await moviesApi.addComment(id, content);
      await refetchComments();
      toast({
        title: 'Comment added!',
        description: 'Your comment has been posted',
      });
    } catch (error) {
      toast({
        title: 'Failed to add comment',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    // TODO: Implement when backend supports comment updates
    toast({
      title: 'Feature not available',
      description: 'Comment editing is not yet implemented',
      variant: 'destructive',
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    // TODO: Implement when backend supports comment deletion
    toast({
      title: 'Feature not available',
      description: 'Comment deletion is not yet implemented',
      variant: 'destructive',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title={`${movie.title}${movie.year ? ` (${movie.year})` : ''} - MovieHub`}
        description={movie.description}
        keywords={`${movie.title}, ${movie.genres ? movie.genres.join(', ') : ''}, movie review, film`}
        image={movie.images && movie.images.length > 0 ? movie.images[0] : undefined}
        type="article"
        structuredData={getMovieStructuredData(movie)}
      />

      <div className="container py-8 space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-lg bg-cover bg-center opacity-20 blur-sm"
            style={{ backgroundImage: `url(${movie.images && movie.images.length > 0 ? movie.images[0] : ''})` }}
          />
          <div className="relative bg-gradient-card rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Poster */}
              <div className="relative">
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-movie bg-muted/10">
                  {movie.images && movie.images.length > 0 ? (
                    <img
                      src={movie.images[0]}
                      alt={`${movie.title} poster`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(145deg, hsl(var(--background)), hsl(var(--muted)))';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = 
                          `<div class="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <Film class="h-16 w-16" />
                           </div>`;
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/10">
                      <Film className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {movie.year && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{movie.year}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-rating fill-rating" />
                      <span className="font-medium">{movie.score}/10</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{movie.upvotes + movie.downvotes} votes</span>
                    </div>
                  </div>
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Added by <span className="font-medium">{typeof movie.addedBy === 'object' ? movie.addedBy.name : movie.addedBy}</span> on {formatDate(movie.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-4xl">
          <CommentList
            comments={transformedComments as any}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            isLoading={commentsLoading}
          />
        </div>
      </div>
    </>
  );
}