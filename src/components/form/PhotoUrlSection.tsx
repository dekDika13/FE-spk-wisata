
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PhotoUrlSectionProps {
  mainImageUrl: string;
  galleryUrls: string;
  onMainImageChange: (value: string) => void;
  onGalleryChange: (value: string) => void;
}

const PhotoUrlSection: React.FC<PhotoUrlSectionProps> = ({
  mainImageUrl,
  galleryUrls,
  onMainImageChange,
  onGalleryChange
}) => {
  return (
    <>
      {/* User: Text Input for URLs */}
      <div className="space-y-2">
        <Label htmlFor="mainImage">URL Foto Utama</Label>
        <Input
          id="mainImage"
          value={mainImageUrl}
          onChange={(e) => onMainImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gallery">URL Galeri Foto (pisahkan dengan koma)</Label>
        <Textarea
          id="gallery"
          value={galleryUrls}
          onChange={(e) => onGalleryChange(e.target.value)}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          rows={2}
        />
      </div>
    </>
  );
};

export default PhotoUrlSection;
