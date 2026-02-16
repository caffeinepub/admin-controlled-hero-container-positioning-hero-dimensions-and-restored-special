import { useState, useRef } from 'react';
import { 
  useGetAllReviews, 
  useAddReview, 
  useUpdateReview, 
  useDeleteReview,
  useGetReviewSettings,
  useUpdateReviewSettings
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Star, Upload, Loader2, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { Review, ReviewsPanelSettings } from '../../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function ReviewsManager() {
  const { data: reviews, isLoading, error } = useGetAllReviews();
  const { data: settings, isLoading: settingsLoading } = useGetReviewSettings();
  const addMutation = useAddReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();
  const updateSettingsMutation = useUpdateReviewSettings();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    rating: 5,
    reviewText: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Submission guard: track if a submission is in flight
  const submissionInFlightRef = useRef(false);
  // Generate a stable submission ID for the current dialog session
  const submissionIdRef = useRef<string | null>(null);

  // Settings state
  const [localSettings, setLocalSettings] = useState<ReviewsPanelSettings | null>(null);

  // Initialize local settings when data loads
  useState(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      rating: 5,
      reviewText: '',
    });
    setEditingReview(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    submissionInFlightRef.current = false;
    submissionIdRef.current = null;
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      patientName: review.patientName,
      rating: Number(review.rating),
      reviewText: review.reviewText,
    });
    if (review.patientImage) {
      setPreviewUrl(review.patientImage.getDirectURL());
    }
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against duplicate submissions
    if (submissionInFlightRef.current) {
      return;
    }

    if (!formData.patientName.trim()) {
      toast.error('Patient name is required');
      return;
    }

    if (!formData.reviewText.trim()) {
      toast.error('Review text is required');
      return;
    }

    if (formData.rating < 4 || formData.rating > 5) {
      toast.error('Rating must be 4 or 5 stars');
      return;
    }

    // Mark submission as in-flight
    submissionInFlightRef.current = true;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let imageBlob: ExternalBlob | undefined;

      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingReview?.patientImage && previewUrl) {
        imageBlob = editingReview.patientImage;
      }

      // Generate a stable ID for new reviews (reuse on retry)
      if (!editingReview && !submissionIdRef.current) {
        submissionIdRef.current = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      const reviewData: Review = {
        id: editingReview?.id || submissionIdRef.current!,
        patientName: formData.patientName,
        rating: BigInt(formData.rating),
        reviewText: formData.reviewText,
        patientImage: imageBlob,
      };

      if (editingReview) {
        await updateMutation.mutateAsync(reviewData);
        toast.success('Review updated successfully');
      } else {
        await addMutation.mutateAsync(reviewData);
        toast.success('Review added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save review');
      console.error(error);
      // Reset in-flight flag on error so user can retry
      submissionInFlightRef.current = false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
      console.error(error);
    }
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;

    try {
      await updateSettingsMutation.mutateAsync(localSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    }
  };

  if (isLoading || settingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load reviews. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  // Deduplicate reviews by ID before rendering
  const uniqueReviews = reviews ? Array.from(
    new Map(reviews.map(r => [r.id, r])).values()
  ) : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Manage Reviews</TabsTrigger>
          <TabsTrigger value="settings">Carousel Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Reviews</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                          placeholder="John Doe"
                          disabled={isUploading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rating">Rating (4 or 5 stars only) *</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="4"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                          disabled={isUploading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewText">Review Text *</Label>
                        <Textarea
                          id="reviewText"
                          value={formData.reviewText}
                          onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                          placeholder="Share your experience..."
                          rows={4}
                          disabled={isUploading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Patient Image (Optional)</Label>
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
                          {previewUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleRemoveImage}
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                        {previewUrl && (
                          <div className="mt-2">
                            <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-full" />
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
                            <>{editingReview ? 'Update' : 'Add'} Review</>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          disabled={isUploading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {uniqueReviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No reviews yet. Click "Add Review" to get started.
                </div>
              ) : (
                <div className="grid gap-4">
                  {uniqueReviews.map((review) => (
                    <Card key={review.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {review.patientImage && (
                            <img 
                              src={review.patientImage.getDirectURL()} 
                              alt={review.patientName}
                              className="w-16 h-16 rounded-full object-cover border-2 border-chart-1/20"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{review.patientName}</h3>
                                <div className="flex gap-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Number(review.rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(review)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handleDelete(review.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{review.reviewText}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Carousel Behavior Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {localSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Auto-Scroll Carousel</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically scroll through reviews in a continuous loop
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.carouselEnabled}
                      onCheckedChange={(checked) => 
                        setLocalSettings({ ...localSettings, carouselEnabled: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="scrollSpeed">Auto-Scroll Speed (ms)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Lower values = faster scrolling (recommended: 2000-5000)
                    </p>
                    <Input
                      id="scrollSpeed"
                      type="number"
                      min="1000"
                      max="10000"
                      step="100"
                      value={Number(localSettings.autoScrollSpeed)}
                      onChange={(e) => 
                        setLocalSettings({ 
                          ...localSettings, 
                          autoScrollSpeed: BigInt(parseInt(e.target.value) || 3000)
                        })
                      }
                      disabled={!localSettings.carouselEnabled}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="maxReviews">Maximum Reviews to Display</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Limit the number of reviews shown (0 = show all)
                    </p>
                    <Input
                      id="maxReviews"
                      type="number"
                      min="0"
                      max="50"
                      value={Number(localSettings.maxReviews)}
                      onChange={(e) => 
                        setLocalSettings({ 
                          ...localSettings, 
                          maxReviews: BigInt(parseInt(e.target.value) || 8)
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Adapt carousel styling for dark mode
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.darkModeSupport}
                      onCheckedChange={(checked) => 
                        setLocalSettings({ ...localSettings, darkModeSupport: checked })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
                      {updateSettingsMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Settings'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
