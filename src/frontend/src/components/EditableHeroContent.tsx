import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetWebsiteContent, useUpdateWebsiteContent } from '../hooks/useQueries';
import { Pencil } from 'lucide-react';

interface EditableHeroContentProps {
  field: 'headline' | 'subtext' | 'primaryButton' | 'secondaryButton';
  content: string;
  link?: string;
  isAdmin: boolean;
  className?: string;
  isButton?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export default function EditableHeroContent({
  field,
  content,
  link = '',
  isAdmin,
  className = '',
  isButton = false,
  buttonVariant = 'primary',
}: EditableHeroContentProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedLink, setEditedLink] = useState(link);
  const { data: websiteContent } = useGetWebsiteContent();
  const updateContentMutation = useUpdateWebsiteContent();

  const handleSave = async () => {
    if (!websiteContent) return;

    const updatedHeroSection = { ...websiteContent.heroSection };

    if (field === 'headline') {
      updatedHeroSection.headline = editedContent;
    } else if (field === 'subtext') {
      updatedHeroSection.subtext = editedContent;
    } else if (field === 'primaryButton') {
      updatedHeroSection.primaryButton = { text: editedContent, link: editedLink };
    } else if (field === 'secondaryButton') {
      updatedHeroSection.secondaryButton = editedContent ? { text: editedContent, link: editedLink } : undefined;
    }

    await updateContentMutation.mutateAsync({
      ...websiteContent,
      heroSection: updatedHeroSection,
    });

    setIsEditDialogOpen(false);
  };

  const handleEdit = () => {
    setEditedContent(content);
    setEditedLink(link);
    setIsEditDialogOpen(true);
  };

  if (isButton) {
    const buttonClasses = buttonVariant === 'primary'
      ? 'group relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent rounded-xl overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-glow-primary active:scale-105'
      : 'group relative px-8 py-4 text-lg font-bold text-foreground backdrop-blur-xl bg-background/40 dark:bg-background/30 border-2 border-primary/40 hover:border-primary rounded-xl overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-glow-accent hover:bg-primary/10 active:scale-105';

    return (
      <>
        {isAdmin ? (
          <div className="relative inline-block group/edit">
            {content ? (
              <a
                href={link || '#'}
                className={buttonClasses}
                onClick={(e) => {
                  if (!link) e.preventDefault();
                }}
              >
                {/* Glow Pulse Effect on Hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">{content}</span>
              </a>
            ) : (
              <button className={`${buttonClasses} opacity-50`}>
                <span className="relative z-10">Add Button Text</span>
              </button>
            )}
            <button
              onClick={handleEdit}
              className="absolute -top-3 -right-3 p-2 bg-primary text-white rounded-full shadow-elevation-3 opacity-0 group-hover/edit:opacity-100 transition-all hover:scale-110 z-30"
              aria-label="Edit button"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ) : content ? (
          <a href={link || '#'} className={buttonClasses}>
            {/* Glow Pulse Effect on Hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10">{content}</span>
          </a>
        ) : null}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="backdrop-blur-xl bg-background/95 border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Edit {field === 'primaryButton' ? 'Primary' : 'Secondary'} Button
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Enter button text"
                  className="backdrop-blur-sm bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button-link">Button Link</Label>
                <Input
                  id="button-link"
                  value={editedLink}
                  onChange={(e) => setEditedLink(e.target.value)}
                  placeholder="https://example.com or #section"
                  className="backdrop-blur-sm bg-background/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={updateContentMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white transition-all duration-500 hover:scale-105 hover:shadow-glow-primary"
              >
                {updateContentMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {isAdmin ? (
        <div className="relative inline-block group/edit w-full">
          <div className={className}>
            {content || (
              <span className="text-muted-foreground italic">
                Click edit to add {field}
              </span>
            )}
          </div>
          <button
            onClick={handleEdit}
            className="absolute -top-3 -right-3 p-2 bg-primary text-white rounded-full shadow-elevation-3 opacity-0 group-hover/edit:opacity-100 transition-all hover:scale-110 z-30"
            aria-label={`Edit ${field}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ) : content ? (
        <div className={className}>{content}</div>
      ) : null}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-background/95 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Edit {field}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              {field === 'headline' ? (
                <Input
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder={`Enter ${field}`}
                  className="backdrop-blur-sm bg-background/50"
                />
              ) : (
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder={`Enter ${field}`}
                  rows={4}
                  className="backdrop-blur-sm bg-background/50"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateContentMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white transition-all duration-500 hover:scale-105 hover:shadow-glow-primary"
            >
              {updateContentMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
