import { useNavigate } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AddMovieForm } from '@/components/AddMovieForm';

export default function RecommendMovie() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Film className="h-5 w-5" />
              <span>Suggest a Movie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to suggest movies
            </p>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Film className="h-5 w-5" />
            <span>Recommend a Movie</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <AddMovieForm />
        </CardContent>
      </Card>
    </div>
  );
}
