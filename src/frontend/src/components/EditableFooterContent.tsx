import { useState } from 'react';
import { useUpdateFooterContent, useGetFooterContent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditableFooterContentProps {
  content: string;
  field: 'address' | 'phone' | 'email' | 'copyright';
  isAdmin: boolean;
  className?: string;
}

export default function EditableFooterContent({ content, field, isAdmin, className }: EditableFooterContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { data: footerContent } = useGetFooterContent();
  const updateMutation = useUpdateFooterContent();

  const handleSave = async () => {
    if (!footerContent) return;

    try {
      const updatedFooter = { ...footerContent };
      
      if (field === 'copyright') {
        updatedFooter.copyright = editedContent;
      } else {
        updatedFooter.contact = {
          ...updatedFooter.contact,
          [field]: editedContent,
        };
      }

      await updateMutation.mutateAsync(updatedFooter);
      toast.success('Footer content updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update footer content');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  if (!isAdmin) {
    if (!content) return null;
    return <span className={className}>{content}</span>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 animate-scale-in">
        <Input
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="h-8 text-sm"
          placeholder={`Enter ${field}`}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="h-8 px-2 hover:scale-110 transition-transform duration-300"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={updateMutation.isPending}
          className="h-8 px-2 hover:scale-110 transition-transform duration-300"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <span className={`group relative inline-block ${className || ''}`}>
      {content || (
        <span className="text-muted-foreground italic">Click edit to add {field}</span>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="absolute -top-1 -right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6 p-0 hover:scale-110"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </span>
  );
}
