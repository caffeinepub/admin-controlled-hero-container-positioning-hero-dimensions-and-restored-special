import { useState, useRef } from 'react';
import { useGetAllClinics, useAddClinic, useUpdateClinic, useDeleteClinic } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { Clinic } from '../../backend';

export default function ClinicsManager() {
  const { data: clinics, isLoading } = useGetAllClinics();
  const addMutation = useAddClinic();
  const updateMutation = useUpdateClinic();
  const deleteMutation = useDeleteClinic();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactDetails: '',
    hours: '',
    mapLink: '',
    bookingUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactDetails: '',
      hours: '',
      mapLink: '',
      bookingUrl: '',
    });
    setEditingClinic(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      contactDetails: clinic.contactDetails,
      hours: clinic.hours,
      mapLink: clinic.mapLink,
      bookingUrl: clinic.bookingUrl ?? '',
    });
    if (clinic.image) {
      setPreviewUrl(clinic.image.getDirectURL());
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Clinic name is required');
      return;
    }

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
      } else if (editingClinic?.image) {
        imageBlob = editingClinic.image;
      }

      // Normalize empty/whitespace-only bookingUrl to undefined
      const normalizedBookingUrl = formData.bookingUrl.trim() || undefined;

      const clinicData: Clinic = {
        id: editingClinic?.id || Date.now().toString(),
        name: formData.name,
        address: formData.address,
        contactDetails: formData.contactDetails,
        hours: formData.hours,
        mapLink: formData.mapLink,
        bookingUrl: normalizedBookingUrl,
        image: imageBlob,
      };

      if (editingClinic) {
        await updateMutation.mutateAsync(clinicData);
        toast.success('Clinic updated successfully');
      } else {
        await addMutation.mutateAsync(clinicData);
        toast.success('Clinic added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save clinic');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this clinic?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Clinic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete clinic');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Clinics</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Clinic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Main Clinic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Medical Center Drive, Suite 100"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDetails">Contact Details</Label>
                <Textarea
                  id="contactDetails"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                  placeholder="Phone: (555) 123-4567 | Email: info@clinic.com"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Operating Hours</Label>
                <Textarea
                  id="hours"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapLink">Map Link</Label>
                <Input
                  id="mapLink"
                  value={formData.mapLink}
                  onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingUrl">Booking URL (optional)</Label>
                <Input
                  id="bookingUrl"
                  value={formData.bookingUrl}
                  onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                  placeholder="https://booking.example.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Clinic Image (Optional)</Label>
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
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
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
                    <>{editingClinic ? 'Update' : 'Add'} Clinic</>
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
        <div>Loading clinics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinics?.map((clinic) => (
            <Card key={clinic.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{clinic.name}</span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(clinic)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(clinic.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {clinic.image && (
                  <img 
                    src={clinic.image.getDirectURL()} 
                    alt={clinic.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p><strong>Address:</strong> {clinic.address}</p>
                <p><strong>Contact:</strong> {clinic.contactDetails}</p>
                <p><strong>Hours:</strong> {clinic.hours}</p>
                {clinic.mapLink && (
                  <p><strong>Map:</strong> <a href={clinic.mapLink} target="_blank" rel="noopener noreferrer" className="text-chart-1 hover:underline">View</a></p>
                )}
                {clinic.bookingUrl && (
                  <p><strong>Booking:</strong> <a href={clinic.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-chart-1 hover:underline">View</a></p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
