import { useState, useRef } from 'react';
import { useUpdateImage, useAddImage, useGetAllImages } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { WebsiteImage } from '../backend';

interface EditableImageProps {
  imageId: string;
  alt: string;
  className?: string;
  isAdmin: boolean;
  description: string;
  supportsDarkMode?: boolean;
}

export default function EditableImage({ 
  imageId, 
  alt, 
  className = '', 
  isAdmin,
  description,
  supportsDarkMode = false
}: EditableImageProps) {
  const { data: images } = useGetAllImages();
  const updateMutation = useUpdateImage();
  const addMutation = useAddImage();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkFileInputRef = useRef<HTMLInputElement>(null);

  const currentImage = images?.find(img => img.id === imageId);
  const imageSrc = currentImage?.image?.getDirectURL();
  const darkImageSrc = currentImage?.darkModeImage?.getDirectURL();

  const handleFileSelect = async (file: File, isDarkMode: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const imageData: WebsiteImage = {
        id: imageId,
        description,
        image: isDarkMode && currentImage ? currentImage.image : blob,
        darkModeImage: isDarkMode ? blob : (currentImage?.darkModeImage || undefined),
      };

      if (currentImage) {
        await updateMutation.mutateAsync(imageData);
      } else {
        await addMutation.mutateAsync(imageData);
      }
      
      toast.success(`${isDarkMode ? 'Dark mode image' : 'Image'} ${currentImage ? 'updated' : 'uploaded'} successfully`);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = (isDarkMode: boolean = false) => {
    if (isDarkMode) {
      darkFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  if (!isAdmin) {
    if (imageSrc) {
      return (
        <img 
          src={imageSrc} 
          alt={alt} 
          className={className}
        />
      );
    }
    return (
      <div className={`${className} bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 backdrop-blur-3xl flex items-center justify-center`}>
        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="group relative">
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={alt} 
          className={className}
        />
      ) : (
        <div className={`${className} bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 backdrop-blur-3xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30`}>
          <div className="text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No image uploaded</p>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleButtonClick(false)}
          disabled={isUploading}
        >
          {isUploading && !uploadProgress ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-1" />
          )}
          {isUploading && uploadProgress > 0 ? `${uploadProgress}%` : 'Upload'}
        </Button>
        
        {supportsDarkMode && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleButtonClick(true)}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            Dark Mode
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, false);
        }}
      />

      {supportsDarkMode && (
        <input
          ref={darkFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, true);
          }}
        />
      )}
    </div>
  );
}
