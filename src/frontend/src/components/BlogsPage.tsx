import { useState } from 'react';
import { useGetAllBlogPosts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BlogList from './blogs/BlogList';
import BlogDetail from './blogs/BlogDetail';
import BlogPostEditorDialog from './blogs/BlogPostEditorDialog';
import type { BlogPost } from '../backend';

interface BlogsPageProps {
  isAdmin: boolean;
}

export default function BlogsPage({ isAdmin }: BlogsPageProps) {
  const { data: posts = [], isLoading } = useGetAllBlogPosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const selectedPost = posts.find(p => p.id === selectedPostId);
  const hasPosts = posts.length > 0;

  const handleCreateNew = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-background">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show empty state for non-admin users when no posts exist
  if (!hasPosts && !isAdmin) {
    return (
      <main className="flex-1 bg-background">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Blogs
            </h1>
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {selectedPost && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                {selectedPost ? selectedPost.title : 'Blogs'}
              </h1>
            </div>
            {isAdmin && !selectedPost && (
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            )}
          </div>

          {/* Content */}
          {selectedPost ? (
            <BlogDetail 
              post={selectedPost} 
              isAdmin={isAdmin}
              onEdit={() => handleEditPost(selectedPost)}
            />
          ) : (
            <BlogList 
              posts={posts}
              onSelectPost={setSelectedPostId}
              isAdmin={isAdmin}
              onEditPost={handleEditPost}
            />
          )}
        </div>
      </div>

      {/* Editor Dialog */}
      {isAdmin && (
        <BlogPostEditorDialog
          open={isEditorOpen}
          onClose={handleCloseEditor}
          post={editingPost}
        />
      )}
    </main>
  );
}
