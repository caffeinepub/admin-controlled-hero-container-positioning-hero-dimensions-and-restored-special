import { useState } from 'react';
import { useUpdateWebsiteContent, useGetWebsiteContent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditableContentProps {
  content: string;
  field: 'overviewContent' | 'aboutContent';
  isAdmin: boolean;
  multiline?: boolean;
}

export default function EditableContent({ content, field, isAdmin, multiline = false }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { data: websiteContent } = useGetWebsiteContent();
  const updateMutation = useUpdateWebsiteContent();

  const handleSave = async () => {
    if (!websiteContent) return;

    try {
      await updateMutation.mutateAsync({
        ...websiteContent,
        [field]: editedContent,
      });
      toast.success('Content updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update content');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  if (!isAdmin) {
    if (!content) {
      return null;
    }
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={multiline ? 10 : 3}
          className="w-full"
          placeholder="Enter content here..."
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {content ? (
        <div className="whitespace-pre-wrap">{content}</div>
      ) : (
        <div className="text-muted-foreground italic py-4 px-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          Click edit to add content
        </div>
      )}
      <Button
        size="sm"
        variant="outline"
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
