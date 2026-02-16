import { useState, useRef } from 'react';
import { useGetAllImages, useAddImage, useUpdateImage, useGetWebsiteContent, useUpdateWebsiteContent } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Upload, Loader2, Image as ImageIcon, Type } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { WebsiteImage } from '../../backend';

export default function ContentManager() {
  const { data: images, isLoading } = useGetAllImages();
  const { data: websiteContent } = useGetWebsiteContent();
  const addMutation = useAddImage();
  const updateMutation = useUpdateImage();
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
                    placeholder="#contact"
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
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
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
                  <Label htmlFor="imageId">Image ID *</Label>
                  <Input
                    id="imageId"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g., hero-background"
                    disabled={!!editingImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Predefined IDs: {predefinedImages.map(img => img.id).join(', ')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the image"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Standard Image *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
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
                      <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-md" />
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
                      Choose Dark Image
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
                      <img src={darkPreviewUrl} alt="Dark Preview" className="w-full max-h-64 object-cover rounded-md" />
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
                        className="bg-chart-1 h-2 rounded-full transition-all"
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Predefined Image Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading images...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {predefinedImages.map((slot) => {
                const existingImage = getImageStatus(slot.id);
                return (
                  <Card key={slot.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                        {existingImage ? (
                          <img
                            src={existingImage.image.getDirectURL()}
                            alt={slot.description}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{slot.description}</h3>
                      <p className="text-xs text-muted-foreground mb-3">ID: {slot.id}</p>
                      {existingImage ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleEdit(existingImage)}
                        >
                          <Pencil className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setFormData({ id: slot.id, description: slot.description });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Add Image
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
