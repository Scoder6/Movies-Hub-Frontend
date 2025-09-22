import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, Crown, MessageSquare, Film, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SEO } from '@/components/SEO';
import { moviesApi } from '@/api/movies';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { mockComments } from '@/data/mockData';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deletingMovie, setDeletingMovie] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  const { data: movies = [], refetch: refetchMovies } = useQuery({
    queryKey: ['movies'],
    queryFn: moviesApi.getMovies,
  });

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleDeleteMovie = async (movieId: string) => {
    setDeletingMovie(movieId);
    try {
      await moviesApi.deleteMovie(movieId);
      await refetchMovies();
      toast({
        title: 'Movie deleted',
        description: 'The movie has been removed from the database',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Unable to delete movie. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingMovie(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingComment(commentId);
    try {
      await moviesApi.deleteComment(commentId);
      toast({
        title: 'Comment deleted',
        description: 'The comment has been removed',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Unable to delete comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingComment(null);
    }
  };

  const totalVotes = movies.reduce((acc, movie) => acc + movie.upvotes + movie.downvotes, 0);
  const totalUpvotes = movies.reduce((acc, movie) => acc + movie.upvotes, 0);
  const topMovies = [...movies].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <>
      <SEO
        title="Admin Dashboard - MovieHub"
        description="Administrative panel for managing movies, comments, and community content on MovieHub."
        keywords="admin, dashboard, movie management"
        url="https://moviehub.example.com/admin"
        noIndex={true}
      />

      <div className="container py-8 space-y-8">
        <div className="flex items-center space-x-2">
          <Crown className="h-6 w-6 text-rating" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{movies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockComments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalUpvotes}</div>
              <p className="text-xs text-muted-foreground">
                {totalVotes > 0 ? Math.round((totalUpvotes / totalVotes) * 100) : 0}% of all votes
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Movies</CardTitle>
                <CardDescription>
                  Manage all movies in the database. Click delete to remove a movie permanently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Director</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Added By</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">{movie.title}</TableCell>
                        <TableCell>{movie.director}</TableCell>
                        <TableCell>{movie.releaseYear}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            movie.score > 0 ? 'text-success' : 
                            movie.score < 0 ? 'text-destructive' : 
                            'text-muted-foreground'
                          }`}>
                            {movie.score > 0 ? `+${movie.score}` : movie.score}
                          </span>
                        </TableCell>
                        <TableCell>{movie.addedBy}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMovie(movie.id)}
                            disabled={deletingMovie === movie.id}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Comments</CardTitle>
                <CardDescription>
                  Moderate comments across all movies. Remove inappropriate content as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Movie</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockComments.map((comment) => {
                      const movie = movies.find(m => m.id === comment.movieId);
                      return (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">{comment.author}</TableCell>
                          <TableCell>{movie?.title || 'Unknown'}</TableCell>
                          <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                          <TableCell>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deletingComment === comment.id}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Movies by Score</CardTitle>
                <CardDescription>
                  The highest-rated movies based on community votes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMovies.map((movie, index) => (
                    <div key={movie.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movie.releaseYear} • {movie.director}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          movie.score > 0 ? 'text-success' : 
                          movie.score < 0 ? 'text-destructive' : 
                          'text-muted-foreground'
                        }`}>
                          {movie.score > 0 ? `+${movie.score}` : movie.score}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {movie.upvotes + movie.downvotes} votes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}