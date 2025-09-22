import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Film } from 'lucide-react';
import { moviesApi } from '@/api/movies';
import { useState } from 'react';

const movieSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  releaseYear: z.number().min(1900).max(new Date().getFullYear()),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.string().min(2, 'Please specify at least one genre')
});

type MovieForm = z.infer<typeof movieSchema>;

export function AddMovieForm() {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovieForm>({
    resolver: zodResolver(movieSchema)
  });

  const onSubmit = async (data: MovieForm) => {
    try {
      // Convert comma-separated genres to array
      const movieData = {
        title: data.title,
        description: data.description,
        year: data.releaseYear,
        genre: data.genre.split(',').map(g => g.trim()).filter(g => g.length > 0)
      };
      
      await moviesApi.addMovie(movieData, selectedImages);
      
      toast({
        title: 'Movie added!',
        description: 'Your movie suggestion has been submitted',
      });
      
      // Reset form
      setSelectedImages([]);
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Unable to add movie. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Film className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">Suggest a Movie</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Movie Title</Label>
        <Input
          id="title"
          placeholder="Inception"
          {...register('title')}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="releaseYear">Release Year</Label>
          <Input
            id="releaseYear"
            type="number"
            placeholder="2010"
            {...register('releaseYear', { valueAsNumber: true })}
            className={errors.releaseYear ? 'border-destructive' : ''}
          />
          {errors.releaseYear && (
            <p className="text-sm text-destructive">{errors.releaseYear.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="genre">Genre (comma separated)</Label>
        <Input
          id="genre"
          placeholder="Sci-Fi, Action, Thriller"
          {...register('genre')}
          className={errors.genre ? 'border-destructive' : ''}
        />
        {errors.genre && (
          <p className="text-sm text-destructive">{errors.genre.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Movie Images (optional)</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setSelectedImages(files);
          }}
          className={errors.genre ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Upload up to 10 images for the movie (optional)
        </p>
      </div>

      <Button type="submit" className="w-full">
        Submit Movie
      </Button>
    </form>
  );
}
