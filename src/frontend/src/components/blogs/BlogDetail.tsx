import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit } from 'lucide-react';
import RichContentRenderer from './RichContentRenderer';
import type { BlogPost } from '../../backend';

interface BlogDetailProps {
  post: BlogPost;
  isAdmin: boolean;
  onEdit: () => void;
}

export default function BlogDetail({ post, isAdmin, onEdit }: BlogDetailProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <span>By {post.author}</span>
              </div>
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <RichContentRenderer content={post.content} />
        </CardContent>
      </Card>
    </article>
  );
}
