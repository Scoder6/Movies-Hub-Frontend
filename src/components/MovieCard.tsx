import { Link } from 'react-router-dom';
import { Calendar, Star, User, Eye, Film, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoteButton } from '@/components/VoteButton';
import { Movie } from '@/types/index';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '@/api/movies';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface MovieCardProps {
  movie: Partial<Movie> & { 
    _id: string;
    title: string;
    description: string;
    images?: string[];
    year?: number;
    genres?: string[];
    upvotes: number;
    downvotes: number;
    score: number;
    createdAt: string;
    addedBy?: {
      name?: string;
      _id?: string;
    };
  };
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const { isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: userVote } = useQuery({
    queryKey: ['userVote', movie._id],
    queryFn: () => moviesApi.getUserVote(movie._id),
    enabled: isAuthenticated,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', movie._id],
    queryFn: () => moviesApi.getMovieComments(movie._id),
    enabled: showComments,
  });

  const onVote = async (movieId: string, voteType: 'upvote' | 'downvote' | 'remove') => {
    try {
      const result = await moviesApi.voteMovie(movieId, voteType);
      // Optionally update local state if needed
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await moviesApi.addComment(movie._id, newComment.trim());
        setNewComment('');
        queryClient.invalidateQueries({ queryKey: ['comments', movie._id] });
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500 hover:shadow-movie hover:-translate-y-2 bg-gradient-card cursor-pointer",
      "hover:scale-[1.02] transform-gpu",
      className
    )}>
      <div className="relative">
        <div className="aspect-[2/3] sm:aspect-[3/4] overflow-hidden rounded-t-lg bg-muted/10">
          {movie.images && movie.images.length > 0 ? (
            <img
              src={movie.images[0]}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement!;
                parent.style.background = 'linear-gradient(145deg, hsl(var(--background)), hsl(var(--muted)))';
                parent.innerHTML = `
                  <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Film class="h-12 w-12" />
                    <span class="text-xs text-center px-4">${movie.title}</span>
                  </div>`;
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/10">
              <Film className="h-12 w-12" />
              <span className="text-xs text-center px-4">{movie.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="absolute top-3 right-3 z-10">
        <VoteButton
            movieId={movie._id}
            upvotes={movie.upvotes}
            downvotes={movie.downvotes}
            userVote={userVote}
            onVote={onVote}
            className="bg-background/95 backdrop-blur-md rounded-lg p-2 shadow-lg hover:bg-background/100 transition-all duration-300 hover:scale-110"
          />
        </div>

        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-background/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg animate-fade-in">
          <Star className="h-3 w-3 text-rating fill-rating drop-shadow-sm" />
          <span className="text-xs font-semibold text-foreground">{movie.score}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-background/90 backdrop-blur-md rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {movie.description}
            </p>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {movie.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {movie.year ? `${movie.year}` : 'Year unknown'}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genres && movie.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs hover:bg-secondary/80 transition-colors">
              {genre}
            </Badge>
          ))}
          {movie.genres && movie.genres.length > 2 && (
            <Badge variant="outline" className="text-xs hover:bg-accent/10 transition-colors">
              +{movie.genres.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
          {movie.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1 hover:text-foreground transition-colors">
            <User className="h-3 w-3" />
            <span>{movie.addedBy?.name || 'Unknown user'}</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-foreground transition-colors">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(movie.createdAt)}</span>
          </div>
        </div>
      </CardFooter>

      <div className="mt-4 border-t pt-4">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </button>
        
        {showComments && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <div className="flex gap-2 px-1">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your thoughts..."
                className="flex-1 text-sm border-border/70"
              />
              <Button 
                onClick={handleAddComment}
                size="sm"
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}