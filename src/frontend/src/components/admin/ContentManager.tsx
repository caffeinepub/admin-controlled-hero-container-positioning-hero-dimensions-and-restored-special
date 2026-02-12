import { useState, useRef } from 'react';
import { useGetAllImages, useAddImage, useUpdateImage, useDeleteImage, useGetWebsiteContent, useUpdateWebsiteContent } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Upload, Loader2, Image as ImageIcon, Type } from 'lucide-react';
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete image', {
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
        <div className="flex gap-2">
          <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleEditHero}>
                <Type className="h-4 w-4 mr-2" />
                Edit Hero Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Hero Section Content</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={heroFormData.headline}
                    onChange={(e) => setHeroFormData({ ...heroFormData, headline: e.target.value })}
                    placeholder="Welcome to Dr. Malay Akechan's Practice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtext">Subtext</Label>
                  <Textarea
                    id="subtext"
                    value={heroFormData.subtext}
                    onChange={(e) => setHeroFormData({ ...heroFormData, subtext: e.target.value })}
                    placeholder="Providing exceptional medical care..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                  <Input
                    id="primaryButtonText"
                    value={heroFormData.primaryButtonText}
                    onChange={(e) => setHeroFormData({ ...heroFormData, primaryButtonText: e.target.value })}
                    placeholder="Book Appointment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
                  <Input
                    id="primaryButtonLink"
                    value={heroFormData.primaryButtonLink}
                    onChange={(e) => setHeroFormData({ ...heroFormData, primaryButtonLink: e.target.value })}
                    placeholder="#clinics"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryButtonText">Secondary Button Text (Optional)</Label>
                  <Input
                    id="secondaryButtonText"
                    value={heroFormData.secondaryButtonText}
                    onChange={(e) => setHeroFormData({ ...heroFormData, secondaryButtonText: e.target.value })}
                    placeholder="Learn More"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryButtonLink">Secondary Button Link (Optional)</Label>
                  <Input
                    id="secondaryButtonLink"
                    value={heroFormData.secondaryButtonLink}
                    onChange={(e) => setHeroFormData({ ...heroFormData, secondaryButtonLink: e.target.value })}
                    placeholder="#about"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateContentMutation.isPending}>
                    {updateContentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Hero Section'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsHeroDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Image ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="hero-background"
                    disabled={!!editingImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use kebab-case (e.g., hero-background, doctor-headshot)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Hero Section Background"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Light Mode Image {!editingImage && '*'}</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    {selectedFile && <span className="text-sm self-center">{selectedFile.name}</span>}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, false)}
                  />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Dark Mode Image (Optional)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => darkFileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    {selectedDarkFile && <span className="text-sm self-center">{selectedDarkFile.name}</span>}
                  </div>
                  <input
                    ref={darkFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                  {darkPreviewUrl && (
                    <div className="mt-2">
                      <img src={darkPreviewUrl} alt="Dark mode preview" className="max-w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                {isUploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>{editingImage ? 'Update' : 'Add'} Image</>
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Predefined Image Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedImages.map((slot) => {
            const existingImage = getImageStatus(slot.id);
            return (
              <Card key={slot.id} className={existingImage ? 'border-primary' : 'border-dashed'}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {slot.description}
                    </span>
                    {existingImage && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(existingImage)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(slot.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {existingImage ? (
                    <div className="space-y-2">
                      <img 
                        src={existingImage.image.getDirectURL()} 
                        alt={slot.description}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground">ID: {slot.id}</p>
                      {existingImage.darkModeImage && (
                        <p className="text-xs text-primary">✓ Dark mode variant available</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-full h-32 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 backdrop-blur-3xl rounded-lg flex items-center justify-center mb-2">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm">No image uploaded</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          setFormData({ id: slot.id, description: slot.description });
                          setIsDialogOpen(true);
                        }}
                      >
                        Upload Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div>Loading images...</div>
      ) : images && images.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{image.description}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(image)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(image.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={image.image.getDirectURL()} 
                    alt={image.description}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-muted-foreground">ID: {image.id}</p>
                  {image.darkModeImage && (
                    <p className="text-xs text-primary mt-1">✓ Dark mode variant</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
