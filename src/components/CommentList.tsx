import { useState } from 'react';
import { MessageCircle, Send, User, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Comment } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CommentListProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (id: string, content: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentList({ 
  comments, 
  onAddComment, 
  onUpdateComment,
  onDeleteComment,
  isLoading = false 
}: CommentListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleEditSave = async (commentId: string) => {
    if (!editedContent.trim()) return;
    
    try {
      await onUpdateComment(commentId, editedContent);
      setEditingCommentId(null);
      toast({
        title: 'Comment updated',
        description: 'Your changes have been saved',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Unable to update comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await onDeleteComment(commentId);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {user && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this movie..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/500 characters
              </span>
              <Button 
                type="submit" 
                size="sm" 
                disabled={!newComment.trim() || isSubmitting}
                className="ml-2"
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        )}

        {!user && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Sign in to join the discussion</p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 p-4 rounded-lg bg-muted/30">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.createdAt !== comment.updatedAt && (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                      )}
                    </div>
                    
                    {user && user.name === comment.author && !editingCommentId && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleEditStart(comment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive" 
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleEditSave(comment.id)}
                          disabled={editedContent.trim() === comment.content}
                        >
                          <Check className="h-3 w-3 mr-1" /> Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleEditCancel}
                        >
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}