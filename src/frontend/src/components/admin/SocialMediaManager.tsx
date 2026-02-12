import { useState } from 'react';
import { useGetAllSocialMediaLinks, useAddSocialMediaLink, useUpdateSocialMediaLink, useDeleteSocialMediaLink } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube, SiGithub } from 'react-icons/si';
import { toast } from 'sonner';
import type { SocialMediaLink } from '../../backend';

const PLATFORM_OPTIONS = [
  { value: 'Facebook', label: 'Facebook', icon: SiFacebook },
  { value: 'X', label: 'X (Twitter)', icon: SiX },
  { value: 'Instagram', label: 'Instagram', icon: SiInstagram },
  { value: 'LinkedIn', label: 'LinkedIn', icon: SiLinkedin },
  { value: 'YouTube', label: 'YouTube', icon: SiYoutube },
  { value: 'GitHub', label: 'GitHub', icon: SiGithub },
];

const ICON_SIZES = [16, 20, 24, 28, 32];

export default function SocialMediaManager() {
  const { data: links, isLoading, error } = useGetAllSocialMediaLinks();
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
  const [validationError, setValidationError] = useState<string>('');

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
    setValidationError('');
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
    setValidationError('');
    setIsDialogOpen(true);
  };

  const validateForm = (): boolean => {
    setValidationError('');

    if (!formData.platform.trim()) {
      setValidationError('Please select a platform');
      return false;
    }

    if (!formData.url.trim()) {
      setValidationError('URL is required');
      return false;
    }

    // Validate URL format
    try {
      const url = new URL(formData.url);
      if (!url.protocol.startsWith('http')) {
        setValidationError('URL must start with http:// or https://');
        return false;
      }
    } catch {
      setValidationError('Please enter a valid URL (e.g., https://facebook.com/yourpage)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const linkData: SocialMediaLink = {
        platform: formData.platform.trim(),
        displayName: formData.displayName.trim() || formData.platform.trim(),
        url: formData.url.trim(),
        iconSize: BigInt(formData.iconSize),
        order: BigInt(formData.order),
        isVisible: formData.isVisible,
      };

      // Only include icon if editing and the existing link has an icon
      if (editingLink?.icon) {
        linkData.icon = editingLink.icon;
      }

      if (editingLink) {
        await updateMutation.mutateAsync(linkData);
        toast.success('Social media link updated successfully', {
          description: `${formData.platform} link has been updated.`,
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } else {
        await addMutation.mutateAsync(linkData);
        toast.success('Social media link added successfully', {
          description: `${formData.platform} link has been added to your website.`,
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving social media link:', error);
      toast.error('Failed to save social media link', {
        description: error?.message || 'Please try again or contact support.',
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const handleDelete = async (platform: string) => {
    if (!confirm(`Are you sure you want to delete the ${platform} link?`)) return;

    try {
      await deleteMutation.mutateAsync(platform);
      toast.success('Social media link deleted successfully', {
        description: `${platform} link has been removed.`,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } catch (error: any) {
      console.error('Error deleting social media link:', error);
      toast.error('Failed to delete social media link', {
        description: error?.message || 'Please try again.',
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const toggleVisibility = async (link: SocialMediaLink) => {
    try {
      const updatedLink: SocialMediaLink = {
        ...link,
        isVisible: !link.isVisible,
      };
      await updateMutation.mutateAsync(updatedLink);
      toast.success(`Link ${updatedLink.isVisible ? 'shown' : 'hidden'} successfully`, {
        description: `${link.platform} is now ${updatedLink.isVisible ? 'visible' : 'hidden'} on your website.`,
      });
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility', {
        description: error?.message || 'Please try again.',
      });
    }
  };

  const getIconComponent = (platform: string) => {
    const option = PLATFORM_OPTIONS.find(opt => opt.value === platform);
    return option?.icon || SiFacebook;
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load social media links. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Social Media</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add and manage your social media links with custom display names and ordering
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLink ? 'Edit Social Media Link' : 'Add New Social Media Link'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => {
                    setFormData({ ...formData, platform: value, displayName: formData.displayName || value });
                    setValidationError('');
                  }}
                  disabled={!!editingLink}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder={formData.platform || "e.g., Follow us on Facebook"}
                />
                <p className="text-xs text-muted-foreground">Optional: Custom name shown on hover</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    setValidationError('');
                  }}
                  placeholder="https://facebook.com/yourpage"
                  type="url"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iconSize">Icon Size (px)</Label>
                  <Select
                    value={formData.iconSize.toString()}
                    onValueChange={(value) => setFormData({ ...formData, iconSize: parseInt(value) })}
                  >
                    <SelectTrigger id="iconSize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_SIZES.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="isVisible" className="text-sm font-medium">
                    Visible on website
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show this link to visitors
                  </p>
                </div>
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={addMutation.isPending || updateMutation.isPending} 
                  className="flex-1 gap-2"
                >
                  {(addMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingLink ? 'Update Link' : 'Add Link'
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading social media links...</p>
        </div>
      ) : links && links.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const Icon = getIconComponent(link.platform);
            return (
              <Card key={link.platform} className={!link.isVisible ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{link.platform}</div>
                        {link.displayName !== link.platform && (
                          <div className="text-xs text-muted-foreground font-normal">{link.displayName}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleVisibility(link)}
                        disabled={updateMutation.isPending}
                        title={link.isVisible ? 'Hide from website' : 'Show on website'}
                      >
                        {link.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
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
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-chart-1 hover:underline break-all block"
                  >
                    {link.url}
                  </a>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Size: {Number(link.iconSize)}px</span>
                    <span>Order: {Number(link.order)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No social media links yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first social media link to connect with your audience
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
