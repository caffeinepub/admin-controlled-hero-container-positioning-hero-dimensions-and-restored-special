import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { useDeleteBlogPost } from '../../hooks/useQueries';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { BlogPost } from '../../backend';

interface BlogListProps {
  posts: BlogPost[];
  onSelectPost: (id: string) => void;
  isAdmin: boolean;
  onEditPost: (post: BlogPost) => void;
}

export default function BlogList({ posts, onSelectPost, isAdmin, onEditPost }: BlogListProps) {
  const deleteMutation = useDeleteBlogPost();

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Deleted "${title}"`);
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Delete error:', error);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPreviewText = (post: BlogPost): string => {
    const textElement = post.content.find(el => el.__kind__ === 'text');
    if (textElement && textElement.__kind__ === 'text') {
      const text = textElement.text.content;
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {sortedPosts.map((post) => (
        <Card 
          key={post.id}
          className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle 
                  className="text-2xl mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onSelectPost(post.id)}
                >
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <span>By {post.author}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPost(post)}
                    className="hover:bg-accent"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id, post.title)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p 
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => onSelectPost(post.id)}
            >
              {getPreviewText(post)}
            </p>
            <Button
              variant="link"
              className="mt-4 px-0"
              onClick={() => onSelectPost(post.id)}
            >
              Read more →
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
