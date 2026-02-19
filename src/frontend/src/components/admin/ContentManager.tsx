import { useState, useRef } from 'react';
import { useGetAllImages, useAddImage, useUpdateImage, useDeleteImage, useGetWebsiteContent, useUpdateWebsiteContent } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Upload, Loader2, Image as ImageIcon, Type, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { WebsiteImage } from '../../backend';

export default function ContentManager() {
  const { data: images, isLoading } = useGetAllImages();
  const { data: websiteContent } = useGetWebsiteContent();
  const addMutation = useAddImage();
  const updateMutation = useUpdateImage();
  const deleteMutation = useDeleteImage();
  const updateContentMutation = useUpdateWebsiteContent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<WebsiteImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    description: '',
  });
  const [heroFormData, setHeroFormData] = useState({
    headline: '',
    subtext: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDarkFile, setSelectedDarkFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [darkPreviewUrl, setDarkPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkFileInputRef = useRef<HTMLInputElement>(null);

  const predefinedImages = [
    { id: 'hero-background', description: 'Hero Section Background' },
    { id: 'doctor-headshot', description: 'Doctor Profile Photo' },
    { id: 'doctor-credentials-profile', description: 'Doctor Credentials Profile Image' },
    { id: 'clinic-exterior', description: 'Clinic Exterior' },
    { id: 'consultation-room', description: 'Consultation Room' },
    { id: 'medical-equipment', description: 'Medical Equipment' },
  ];

  const resetForm = () => {
    setFormData({ id: '', description: '' });
    setEditingImage(null);
    setSelectedFile(null);
    setSelectedDarkFile(null);
    setPreviewUrl('');
    setDarkPreviewUrl('');
    setUploadProgress(0);
  };

  const handleEdit = (image: WebsiteImage) => {
    setEditingImage(image);
    setFormData({
      id: image.id,
      description: image.description,
    });
    setPreviewUrl(image.image.getDirectURL());
    if (image.darkModeImage) {
      setDarkPreviewUrl(image.darkModeImage.getDirectURL());
    }
    setIsDialogOpen(true);
  };

  const handleEditHero = () => {
    if (websiteContent?.heroSection) {
      setHeroFormData({
        headline: websiteContent.heroSection.headline,
        subtext: websiteContent.heroSection.subtext,
        primaryButtonText: websiteContent.heroSection.primaryButton.text,
        primaryButtonLink: websiteContent.heroSection.primaryButton.link,
        secondaryButtonText: websiteContent.heroSection.secondaryButton?.text || '',
        secondaryButtonLink: websiteContent.heroSection.secondaryButton?.link || '',
      });
    }
    setIsHeroDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Image deleted successfully');
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error('Failed to delete image', {
        description: error?.message || 'Please try again',
      });
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isDarkMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (isDarkMode) {
      setSelectedDarkFile(file);
      setDarkPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id.trim() || !formData.description.trim()) {
      toast.error('ID and description are required');
      return;
    }

    if (!editingImage && !selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let imageBlob: ExternalBlob;
      let darkImageBlob: ExternalBlob | undefined;

      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingImage) {
        imageBlob = editingImage.image;
      } else {
        throw new Error('No image available');
      }

      if (selectedDarkFile) {
        const darkArrayBuffer = await selectedDarkFile.arrayBuffer();
        const darkUint8Array = new Uint8Array(darkArrayBuffer);
        darkImageBlob = ExternalBlob.fromBytes(darkUint8Array);
      } else if (editingImage?.darkModeImage) {
        darkImageBlob = editingImage.darkModeImage;
      }

      const imageData: WebsiteImage = {
        id: formData.id,
        description: formData.description,
        image: imageBlob,
        darkModeImage: darkImageBlob,
      };

      if (editingImage) {
        await updateMutation.mutateAsync(imageData);
        toast.success('Image updated successfully');
      } else {
        await addMutation.mutateAsync(imageData);
        toast.success('Image added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error('Failed to save image', {
        description: error?.message || 'Please try again',
      });
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteContent) {
      toast.error('Website content not loaded');
      return;
    }

    try {
      await updateContentMutation.mutateAsync({
        ...websiteContent,
        heroSection: {
          headline: heroFormData.headline,
          subtext: heroFormData.subtext,
          primaryButton: {
            text: heroFormData.primaryButtonText,
            link: heroFormData.primaryButtonLink,
          },
          secondaryButton: heroFormData.secondaryButtonText ? {
            text: heroFormData.secondaryButtonText,
            link: heroFormData.secondaryButtonLink,
          } : undefined,
        },
      });
      toast.success('Hero section updated successfully');
      setIsHeroDialogOpen(false);
    } catch (error: any) {
      toast.error('Failed to update hero section', {
        description: error?.message || 'Please try again',
      });
      console.error(error);
    }
  };

  const getImageStatus = (imageId: string) => {
    return images?.find(img => img.id === imageId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content & Image Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all website images and content. Use hover-to-edit on the main site for quick updates.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Custom Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">Image ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., custom-image-1"
                  disabled={!!editingImage}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use a unique identifier (lowercase, hyphens allowed)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the image"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Standard Image</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFile || editingImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, false)}
                    className="hidden"
                  />
                </div>
                {previewUrl && (
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Dark Mode Image (Optional)</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => darkFileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {selectedDarkFile || editingImage?.darkModeImage ? 'Change Dark Image' : 'Upload Dark Image'}
                  </Button>
                  <input
                    ref={darkFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                  />
                </div>
                {darkPreviewUrl && (
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border bg-gray-900">
                    <img
                      src={darkPreviewUrl}
                      alt="Dark mode preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Image'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero Section Content Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              <CardTitle>Hero Section Content</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditHero} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Headline:</p>
              <p className="mt-1">{websiteContent?.heroSection.headline || 'Not set'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Subtext:</p>
              <p className="mt-1">{websiteContent?.heroSection.subtext || 'Not set'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Primary Button:</p>
                <p className="mt-1">{websiteContent?.heroSection.primaryButton.text || 'Not set'}</p>
              </div>
              {websiteContent?.heroSection.secondaryButton && (
                <div>
                  <p className="font-medium text-muted-foreground">Secondary Button:</p>
                  <p className="mt-1">{websiteContent.heroSection.secondaryButton.text}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Content Edit Dialog */}
      <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Hero Section Content</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleHeroSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={heroFormData.headline}
                onChange={(e) => setHeroFormData({ ...heroFormData, headline: e.target.value })}
                placeholder="Main headline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtext">Subtext</Label>
              <Textarea
                id="subtext"
                value={heroFormData.subtext}
                onChange={(e) => setHeroFormData({ ...heroFormData, subtext: e.target.value })}
                placeholder="Supporting text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                <Input
                  id="primaryButtonText"
                  value={heroFormData.primaryButtonText}
                  onChange={(e) => setHeroFormData({ ...heroFormData, primaryButtonText: e.target.value })}
                  placeholder="Button text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
                <Input
                  id="primaryButtonLink"
                  value={heroFormData.primaryButtonLink}
                  onChange={(e) => setHeroFormData({ ...heroFormData, primaryButtonLink: e.target.value })}
                  placeholder="URL or #section"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryButtonText">Secondary Button Text (Optional)</Label>
                <Input
                  id="secondaryButtonText"
                  value={heroFormData.secondaryButtonText}
                  onChange={(e) => setHeroFormData({ ...heroFormData, secondaryButtonText: e.target.value })}
                  placeholder="Button text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryButtonLink">Secondary Button Link</Label>
                <Input
                  id="secondaryButtonLink"
                  value={heroFormData.secondaryButtonLink}
                  onChange={(e) => setHeroFormData({ ...heroFormData, secondaryButtonLink: e.target.value })}
                  placeholder="URL or #section"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsHeroDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Predefined Image Slots */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Predefined Image Slots
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {predefinedImages.map((slot) => {
            const existingImage = getImageStatus(slot.id);
            return (
              <Card key={slot.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{slot.description}</CardTitle>
                  <p className="text-xs text-muted-foreground">ID: {slot.id}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {existingImage ? (
                    <>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                        <img
                          src={existingImage.image.getDirectURL()}
                          alt={existingImage.description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(existingImage)}
                          className="flex-1 gap-2"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(existingImage.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData({ id: slot.id, description: slot.description });
                        setIsDialogOpen(true);
                      }}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Images */}
      {images && images.filter(img => !predefinedImages.some(p => p.id === img.id)).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Images</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images
              .filter(img => !predefinedImages.some(p => p.id === img.id))
              .map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{image.description}</CardTitle>
                    <p className="text-xs text-muted-foreground">ID: {image.id}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                      <img
                        src={image.image.getDirectURL()}
                        alt={image.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(image)}
                        className="flex-1 gap-2"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(image.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
