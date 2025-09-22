import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

type VoteButtonProps = {
  movieId: string;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | null;
  onVote: (movieId: string, voteType: 'upvote' | 'downvote' | 'remove') => Promise<void>;
  className?: string;
};

export function VoteButton({
  movieId,
  upvotes,
  downvotes,
  userVote,
  onVote,
  className,
}: VoteButtonProps) {
  const { isAuthenticated } = useAuth();
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [currentUserVote, setCurrentUserVote] = useState(userVote);

  useEffect(() => {
    setLocalUpvotes(upvotes);
    setLocalDownvotes(downvotes);
    setCurrentUserVote(userVote);
  }, [upvotes, downvotes, userVote]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!isAuthenticated) return;

    // Determine new vote state
    let newVote: 1 | -1 | null = null;
    if (type === 'upvote') {
      newVote = currentUserVote === 1 ? null : 1;
    } else {
      newVote = currentUserVote === -1 ? null : -1;
    }

    // Optimistic UI update
    if (newVote === 1) {
      setLocalUpvotes(prev => prev + 1);
      if (currentUserVote === -1) setLocalDownvotes(prev => prev - 1);
    } else if (newVote === -1) {
      setLocalDownvotes(prev => prev + 1);
      if (currentUserVote === 1) setLocalUpvotes(prev => prev - 1);
    } else {
      if (currentUserVote === 1) setLocalUpvotes(prev => prev - 1);
      else if (currentUserVote === -1) setLocalDownvotes(prev => prev - 1);
    }

    setCurrentUserVote(newVote);
    
    // Call API
    await onVote(
      movieId, 
      newVote === 1 ? 'upvote' : newVote === -1 ? 'downvote' : 'remove'
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('upvote')}
        disabled={!isAuthenticated}
        className={`p-1 h-auto ${currentUserVote === 1 ? 'text-green-500' : 'text-muted-foreground'}`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="ml-1 text-xs">{localUpvotes}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('downvote')}
        disabled={!isAuthenticated}
        className={`p-1 h-auto ${currentUserVote === -1 ? 'text-red-500' : 'text-muted-foreground'}`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="ml-1 text-xs">{localDownvotes}</span>
      </Button>
    </div>
  );
}
