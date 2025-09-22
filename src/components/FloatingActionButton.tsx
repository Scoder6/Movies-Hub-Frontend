import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function FloatingActionButton() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden animate-fade-in">
      <Button
        asChild
        size="icon"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-primary/90 focus-ring bg-primary text-primary-foreground"
      >
        <Link to="/recommend" className="flex items-center justify-center">
          <Plus className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
        </Link>
      </Button>
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
    </div>
  );
}
