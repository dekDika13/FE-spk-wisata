
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface PhotoUploadSectionProps {
  mainImagePreview: string;
  galleryPreviews: string[];
  onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (index: number) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  mainImagePreview,
  galleryPreviews,
  onMainImageChange,
  onGalleryChange,
  onRemoveGalleryImage
}) => {
  return (
    <>
      {/* Admin: File Upload for Main Image */}
      <div className="space-y-2">
        <Label htmlFor="mainImage">Foto Utama</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            id="mainImage"
            accept="image/*"
            onChange={onMainImageChange}
            className="hidden"
          />
          <label htmlFor="mainImage" className="cursor-pointer">
            {mainImagePreview ? (
              <div className="relative">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <Upload className="w-8 h-8 text-white" />
                  <span className="text-white ml-2">Ganti Foto</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Upload className="w-12 h-12 mb-2" />
                <span>Klik untuk upload foto utama</span>
                <span className="text-sm">PNG, JPG, JPEG</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Admin: File Upload for Gallery */}
      <div className="space-y-2">
        <Label htmlFor="gallery">Galeri Foto</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            id="gallery"
            accept="image/*"
            multiple
            onChange={onGalleryChange}
            className="hidden"
          />
          <label htmlFor="gallery" className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Upload className="w-8 h-8 mb-2" />
              <span>Klik untuk upload foto galeri</span>
              <span className="text-sm">Bisa pilih beberapa foto sekaligus</span>
            </div>
          </label>
        </div>
        
        {/* Gallery Preview */}
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveGalleryImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoUploadSection;
