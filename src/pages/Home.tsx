import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCardNew';
import { SEO } from '@/components/SEO';
import { moviesApi } from '@/api/movies';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Movie } from '@/types/index';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genres: [] as string[],
    minRating: 0,
    yearRange: [1900, new Date().getFullYear()] as [number, number],
  });
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [recommendFormData, setRecommendFormData] = useState({
    title: '',
    description: '',
    releaseYear: new Date().getFullYear().toString(),
    director: '',
    genre: '',
    isLoading: false
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const { data: movies = [], isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: moviesApi.getMovies,
  });

  const filteredMovies = movies.filter(movie => {
    // Search filter
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (movie.genres && movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())));
      
    // Additional filters
    const matchesGenre = filters.genres.length === 0 || 
      (movie.genres && movie.genres.some(genre => filters.genres.includes(genre)));
    const matchesRating = true; // No rating in backend yet
    const matchesYear = 
      (!movie.year || movie.year >= filters.yearRange[0]) && 
      (!movie.year || movie.year <= filters.yearRange[1]);
      
    return matchesSearch && matchesGenre && matchesRating && matchesYear;
  });

  // Sort movies by score (upvotes - downvotes)
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    return scoreB - scoreA; // Descending order
  });

  const handleVote = async (movieId: string, voteType: 'upvote' | 'downvote') => {
    try {
      await moviesApi.voteMovie(movieId, voteType);
      // Invalidate and refetch movies to get updated vote counts
      queryClient.invalidateQueries({ queryKey: ['movies'] });
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

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setRecommendFormData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Convert comma-separated genres to array
      const movieData = {
        title: recommendFormData.title,
        description: recommendFormData.description,
        year: parseInt(recommendFormData.releaseYear),
        genres: recommendFormData.genre.split(',').map(g => g.trim()).filter(g => g.length > 0)
      };
      
      await moviesApi.addMovie(movieData, selectedImages);
      
      toast({
        title: 'Movie recommended!',
        description: 'Your movie has been added to the recommendation board',
      });
      
      // Reset form
      setRecommendFormData({
        title: '',
        description: '',
        releaseYear: new Date().getFullYear().toString(),
        director: '',
        genre: '',
        isLoading: false
      });
      setSelectedImages([]);
      
      // Refresh movies list
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (error) {
      toast({
        title: 'Recommendation failed',
        description: 'Unable to add movie. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRecommendFormData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRecommendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for releaseYear to ensure it's a valid number string
    if (name === 'releaseYear') {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1900 && numValue <= new Date().getFullYear()) {
        setRecommendFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    setRecommendFormData(prev => ({ ...prev, [name]: value }));
  };

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">Unable to load movies. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="MovieHub - Discover & Rate Movies"
        description="Browse and vote on the best movie recommendations. Join our community of film enthusiasts."
        keywords={[
          ...filteredMovies.slice(0, 5).map(m => m.title),
          'movies', 'ratings', 'recommendations', 'film community'
        ].join(', ')}
        image={filteredMovies[0]?.images?.[0] || '/placeholder.svg'}
        url="https://moviehub.example.com"
      />
      
      <div className="container py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 relative overflow-hidden py-12 md:py-16">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50 animate-spin-slow"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl opacity-50 animate-spin-slow-reverse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)/0.02,transparent_70%)]"></div>
          </div>
          
          {/* Content */}
          <div className="relative max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-text-focus-in pb-1" 
                style={{
                  animationDuration: '1.2s',
                  textShadow: '0 2px 10px hsl(var(--primary)/0.3)',
                  letterSpacing: '0.025em',
                  paddingLeft: '0.1em',
                  paddingRight: '0.1em',
                  lineHeight: '1.2'
                }}>
              Discover Amazing Movies
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mt-6 mx-auto max-w-2xl leading-relaxed animate-fade-up" 
               style={{ animationDelay: '0.4s' }}>
              Join our community of movie enthusiasts. Rate, review, and discover your next favorite film.
            </p>
            
            <div className="flex justify-center mt-8 animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                {/* FIXED DOT */}
                <div className="w-2 h-2 rounded-full animate-pulse bg-green-500 dark:bg-success ring-2 ring-green-500/30 dark:ring-success/30"></div>
                <span>Real-time movie ratings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300" />
            <Input
              placeholder="Search movies, genres, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:shadow-md"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="transition-all duration-300 hover:bg-primary/5"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card dark:bg-background border rounded-lg p-4 mt-4 animate-fade-up shadow-sm dark:shadow-none dark:border-border/50">
            <div className="flex justify-between items-center">
              <h3 className="font-medium dark:text-foreground">Filter Movies</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFilters({
                    genres: [],
                    minRating: 0,
                    yearRange: [1900, new Date().getFullYear()]
                  });
                  setSearchQuery('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground dark:text-muted-foreground">Minimum Rating</label>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-rating" />
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer dark:bg-muted/50"
                  />
                  <span className="text-sm font-medium w-8 text-center dark:text-foreground">{filters.minRating.toFixed(1)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground dark:text-muted-foreground">Release Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs block mb-1 text-muted-foreground dark:text-muted-foreground">From</label>
                    <input
                      type="number"
                      min="1900"
                      max={filters.yearRange[1]}
                      value={filters.yearRange[0]}
                      onChange={(e) => setFilters({...filters, yearRange: [parseInt(e.target.value), filters.yearRange[1]]})}
                      className="w-full p-2 text-sm border rounded transition-colors duration-150 hover:bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/20 dark:bg-background dark:border-border/50 dark:hover:border-primary/50 dark:hover:shadow-primary/10 dark:focus:border-primary dark:focus:ring-primary/30 dark:[&::-webkit-inner-spin-button]:bg-muted/50 dark:[&::-webkit-inner-spin-button]:text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1 text-muted-foreground dark:text-muted-foreground">To</label>
                    <input
                      type="number"
                      min={filters.yearRange[0]}
                      max={new Date().getFullYear()}
                      value={filters.yearRange[1]}
                      onChange={(e) => setFilters({...filters, yearRange: [filters.yearRange[0], parseInt(e.target.value)]})}
                      className="w-full p-2 text-sm border rounded transition-colors duration-150 hover:bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/20 dark:bg-background dark:border-border/50 dark:hover:border-primary/50 dark:hover:shadow-primary/10 dark:focus:border-primary dark:focus:ring-primary/30 dark:[&::-webkit-inner-spin-button]:bg-muted/50 dark:[&::-webkit-inner-spin-button]:text-foreground"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground dark:text-muted-foreground">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(movies.flatMap(m => m.genres || []))).map(genre => (
                    <button
                      key={genre}
                      onClick={() => {
                        const updatedGenres = filters.genres.includes(genre)
                          ? filters.genres.filter(g => g !== genre)
                          : [...filters.genres, genre];
                        setFilters({...filters, genres: updatedGenres});
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${filters.genres.includes(genre) 
                        ? 'bg-primary text-primary-foreground border-primary dark:bg-primary/80 dark:border-primary/80' 
                        : 'bg-background text-muted-foreground border-border hover:bg-muted dark:bg-background dark:border-border/70 dark:hover:bg-muted/30'}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommend Movie Section - Only show for authenticated users */}
        {user && (
          <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg border border-border/50 shadow-sm dark:bg-background/95 animate-fade-up">
            <div className="flex items-center space-x-2 mb-6">
              <Film className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Recommend a Movie</h3>
            </div>
            
            <form onSubmit={handleRecommendSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recommend-title">Movie Title</Label>
                <Input 
                  id="recommend-title" 
                  name="title" 
                  value={recommendFormData.title} 
                  onChange={handleRecommendChange} 
                  placeholder="Enter movie title" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recommend-description">Description</Label>
                <Textarea 
                  id="recommend-description" 
                  name="description" 
                  value={recommendFormData.description} 
                  onChange={handleRecommendChange} 
                  placeholder="Tell us why you recommend this movie" 
                  rows={5} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recommend-releaseYear">Release Year</Label>
                  <Input 
                    id="recommend-releaseYear" 
                    name="releaseYear" 
                    type="number" 
                    value={recommendFormData.releaseYear} 
                    onChange={handleRecommendChange} 
                    min="1900" 
                    max={new Date().getFullYear()} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recommend-director">Director</Label>
                  <Input 
                    id="recommend-director" 
                    name="director" 
                    value={recommendFormData.director} 
                    onChange={handleRecommendChange} 
                    placeholder="Director name" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recommend-genre">Genre (comma separated)</Label>
                <Input 
                  id="recommend-genre" 
                  name="genre" 
                  value={recommendFormData.genre} 
                  onChange={handleRecommendChange} 
                  placeholder="Sci-Fi, Action, Thriller" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommend-images">Movie Images (optional)</Label>
                <Input
                  id="recommend-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedImages(files);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Upload up to 10 images for the movie (optional)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={recommendFormData.isLoading}
              >
                Recommend Movie
              </Button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 text-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <div className="space-y-1 group cursor-pointer">
            <div className="flex items-center space-x-1 text-primary transition-all duration-300 group-hover:scale-110">
              <TrendingUp className="h-4 w-4" />
              <span className="text-2xl font-bold transition-all duration-300 group-hover:text-primary/80">{movies.length}</span>
            </div>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">Movies</p>
          </div>
          <div className="space-y-1 group cursor-pointer">
            <div className="text-2xl font-bold text-rating transition-all duration-300 group-hover:scale-110 group-hover:text-rating/80">
              {movies.reduce((acc, movie) => acc + movie.upvotes + movie.downvotes, 0)}
            </div>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">Total Votes</p>
          </div>
          <div className="space-y-1 group cursor-pointer">
            <div className="text-2xl font-bold text-success transition-all duration-300 group-hover:scale-110 group-hover:text-success/80">
              {movies.reduce((acc, movie) => acc + movie.upvotes, 0)}
            </div>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">Upvotes</p>
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                  {/* Poster Skeleton */}
                  <div className="aspect-[2/3] sm:aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse">
                    <div className="w-full h-full bg-muted/40 rounded animate-shimmer"></div>
                  </div>
                  
                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted/60 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-muted/40 rounded animate-pulse w-1/2"></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted/50 rounded-full animate-pulse w-16"></div>
                      <div className="h-6 bg-muted/50 rounded-full animate-pulse w-20"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/40 rounded animate-pulse"></div>
                      <div className="h-3 bg-muted/40 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-muted/40 rounded animate-pulse w-4/6"></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-4">
                        <div className="h-3 bg-muted/40 rounded animate-pulse w-12"></div>
                        <div className="h-3 bg-muted/40 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="h-8 bg-muted/50 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedMovies.length === 0 ? (
          <div className="text-center py-12 animate-fade-up">
            <div className="relative inline-block mb-6">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4 animate-bounce" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No movies found</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? 'Try adjusting your search terms or browse our full collection'
                : 'Be the first to add a movie and start building our community!'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="mt-4 transition-all duration-300 hover:bg-primary/10"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedMovies.map((movie, index) => (
              <div 
                key={movie._id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MovieCard movie={movie} onVote={handleVote} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
