import { useState } from 'react';
import { useGetSortedSocialMediaLinks, useAddSocialMediaLink, useUpdateSocialMediaLink, useDeleteSocialMediaLink } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SocialMediaLink } from '../../backend';

export default function SocialMediaManager() {
  const { data: links, isLoading } = useGetSortedSocialMediaLinks();
  const addMutation = useAddSocialMediaLink();
  const updateMutation = useUpdateSocialMediaLink();
  const deleteMutation = useDeleteSocialMediaLink();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialMediaLink | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    displayName: '',
    url: '',
    iconSize: 24,
    order: 0,
    isVisible: true,
  });

  const resetForm = () => {
    setFormData({
      platform: '',
      displayName: '',
      url: '',
      iconSize: 24,
      order: 0,
      isVisible: true,
    });
    setEditingLink(null);
  };

  const handleEdit = (link: SocialMediaLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      displayName: link.displayName,
      url: link.url,
      iconSize: Number(link.iconSize),
      order: Number(link.order),
      isVisible: link.isVisible,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.platform.trim() || !formData.displayName.trim() || !formData.url.trim()) {
      toast.error('Platform, display name, and URL are required');
      return;
    }

    try {
      const linkData: SocialMediaLink = {
        platform: formData.platform,
        displayName: formData.displayName,
        url: formData.url,
        iconSize: BigInt(formData.iconSize),
        order: BigInt(formData.order),
        isVisible: formData.isVisible,
        icon: editingLink?.icon,
      };

      if (editingLink) {
        await updateMutation.mutateAsync(linkData);
        toast.success('Social media link updated successfully');
      } else {
        await addMutation.mutateAsync(linkData);
        toast.success('Social media link added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save social media link');
      console.error(error);
    }
  };

  const handleDelete = async (platform: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return;

    try {
      await deleteMutation.mutateAsync(platform);
      toast.success('Social media link deleted successfully');
    } catch (error) {
      toast.error('Failed to delete social media link');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Social Media Links</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingLink ? 'Edit Social Media Link' : 'Add New Social Media Link'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform *</Label>
                    <Input
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      placeholder="e.g., Facebook, Twitter, Instagram"
                      disabled={!!editingLink}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="e.g., Dr. Malay on Facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iconSize">Icon Size (px)</Label>
                    <Input
                      id="iconSize"
                      type="number"
                      min="16"
                      max="64"
                      value={formData.iconSize}
                      onChange={(e) => setFormData({ ...formData, iconSize: parseInt(e.target.value) || 24 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isVisible">Visible</Label>
                    <Switch
                      id="isVisible"
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                      {(addMutation.isPending || updateMutation.isPending) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>{editingLink ? 'Update' : 'Add'} Link</>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading social media links...</div>
          ) : links && links.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No social media links yet. Click "Add Link" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {links?.map((link) => (
                <Card key={link.platform}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{link.displayName}</h3>
                        <p className="text-sm text-muted-foreground">{link.platform}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {link.url}
                        </a>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Order: {Number(link.order)}</span>
                          <span>Size: {Number(link.iconSize)}px</span>
                          <span>Visible: {link.isVisible ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(link)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(link.platform)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
