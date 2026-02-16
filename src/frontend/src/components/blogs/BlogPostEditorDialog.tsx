import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { useCreateOrUpdateBlogPost, useGetCallerUserProfile } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { BlogPost, RichContentElement } from '../../backend';
import { Progress } from '@/components/ui/progress';
import RichTextEditor from './RichTextEditor';

interface BlogPostEditorDialogProps {
  open: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  textContent?: string;
  imageBlob?: ExternalBlob;
  imageDescription?: string;
  uploadProgress?: number;
}

export default function BlogPostEditorDialog({ open, onClose, post }: BlogPostEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'text', textContent: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const mutation = useCreateOrUpdateBlogPost();
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      const blocks: ContentBlock[] = post.content.map((element, index) => {
        if (element.__kind__ === 'text') {
          return {
            id: `${index}`,
            type: 'text' as const,
            textContent: element.text.content,
          };
        } else if (element.__kind__ === 'image') {
          return {
            id: `${index}`,
            type: 'image' as const,
            imageBlob: element.image.blob,
            imageDescription: element.image.description,
          };
        }
        return { id: `${index}`, type: 'text' as const, textContent: '' };
      });
      setContentBlocks(blocks.length > 0 ? blocks : [{ id: '1', type: 'text', textContent: '' }]);
    } else {
      setTitle('');
      setContentBlocks([{ id: '1', type: 'text', textContent: '' }]);
    }
  }, [post, open]);

  const addTextBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      { id: Date.now().toString(), type: 'text', textContent: '' }
    ]);
  };

  const addImageBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      { id: Date.now().toString(), type: 'image', imageDescription: '' }
    ]);
  };

  const removeBlock = (id: string) => {
    if (contentBlocks.length > 1) {
      setContentBlocks(contentBlocks.filter(block => block.id !== id));
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        updateBlock(blockId, { uploadProgress: percentage });
      });

      updateBlock(blockId, { imageBlob: blob, uploadProgress: 0 });
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const hasContent = contentBlocks.some(block => {
      if (block.type === 'text') return block.textContent?.trim();
      if (block.type === 'image') return block.imageBlob;
      return false;
    });

    if (!hasContent) {
      toast.error('Please add some content');
      return;
    }

    setIsSaving(true);

    try {
      const richContent: RichContentElement[] = contentBlocks
        .filter(block => {
          if (block.type === 'text') return block.textContent?.trim();
          if (block.type === 'image') return block.imageBlob;
          return false;
        })
        .map(block => {
          if (block.type === 'text') {
            return {
              __kind__: 'text' as const,
              text: { content: block.textContent || '' }
            };
          } else {
            return {
              __kind__: 'image' as const,
              image: {
                blob: block.imageBlob!,
                description: block.imageDescription || ''
              }
            };
          }
        });

      const now = BigInt(Date.now() * 1000000);
      const blogPost: BlogPost = {
        id: post?.id || `post-${Date.now()}`,
        title: title.trim(),
        author: userProfile?.name || 'Admin',
        content: richContent,
        createdAt: post?.createdAt || now,
        updatedAt: now,
      };

      await mutation.mutateAsync(blogPost);
      toast.success(post ? 'Post updated successfully' : 'Post created successfully');
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="text-lg"
            />
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <Label>Content</Label>
            {contentBlocks.map((block, index) => (
              <div key={block.id} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {block.type === 'text' ? 'Text Block' : 'Image Block'} #{index + 1}
                  </span>
                  {contentBlocks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(block.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {block.type === 'text' ? (
                  <RichTextEditor
                    value={block.textContent || ''}
                    onChange={(value) => updateBlock(block.id, { textContent: value })}
                    placeholder="Enter text content with formatting..."
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(block.id, file);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    {block.uploadProgress !== undefined && block.uploadProgress > 0 && block.uploadProgress < 100 && (
                      <Progress value={block.uploadProgress} className="h-2" />
                    )}
                    {block.imageBlob && (
                      <div className="space-y-2">
                        <img
                          src={block.imageBlob.getDirectURL()}
                          alt="Preview"
                          className="w-full rounded-md max-h-64 object-cover"
                        />
                        <Input
                          value={block.imageDescription || ''}
                          onChange={(e) => updateBlock(block.id, { imageDescription: e.target.value })}
                          placeholder="Image description (optional)..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTextBlock}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Text
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageBlock}
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Add Image
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              post ? 'Update Post' : 'Create Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
