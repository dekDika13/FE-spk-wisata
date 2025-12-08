import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WisataLocation } from '@/types';
import { useWisata } from '@/hooks/useWisata';
import { useApiAuth } from '@/hooks/useApiAuth';
import { destinationAPI, CreateDestinationRequest, UpdateDestinationRequest } from '@/services/api';
import { toast } from 'sonner';
import PhotoUploadSection from './form/PhotoUploadSection';
import PhotoUrlSection from './form/PhotoUrlSection';
import WisataFormFields from './form/WisataFormFields';

interface WisataFormProps {
  location?: WisataLocation;
  onSave: () => void;
  onCancel: () => void;
  isAdmin?: boolean;
}

const categories = [
  'Pantai',
  'Air Terjun', 
  'Pura',
  'Danau',
  'Bukit',
  'Desa Wisata',
  'Budaya',
  'Kuliner'
];

const WisataForm: React.FC<WisataFormProps> = ({ location, onSave, onCancel, isAdmin = false }) => {
  const { addLocation, updateLocation, submitLocationProposal } = useWisata();
  const { user: apiUser } = useApiAuth();
  
  // Parse location coordinates if editing
  const parseLocationCoords = (locationStr?: string) => {
    if (!locationStr) return { lat: 0, lng: 0 };
    const parts = locationStr.split(',').map(s => parseFloat(s.trim()));
    return { lat: parts[0] || 0, lng: parts[1] || 0 };
  };

  const existingCoords = location ? parseLocationCoords(location.address) : { lat: location?.latitude || 0, lng: location?.longitude || 0 };
  
  const [formData, setFormData] = useState({
    name: location?.name || '',
    category: location?.category || '',
    shortDescription: location?.shortDescription || '',
    fullDescription: location?.fullDescription || '',
    address: location?.address || '',
    latitude: location?.latitude || existingCoords.lat || 0,
    longitude: location?.longitude || existingCoords.lng || 0,
    mainImage: location?.mainImage || '',
    gallery: location?.gallery?.join(', ') || '',
    openingHours: location?.openingHours || '',
    ticketPrice: location?.ticketPrice || 0,
    facilities: location?.facilities?.join(', ') || '',
    status: location?.status || (isAdmin ? 'published' : 'pending'),
    // API fields
    toilet: 3,
    parking: 1,
    restarea: 1,
    restaurant: 3
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>(location?.mainImage || '');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(location?.gallery || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMainImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryPreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const convertFileToUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error('Harap isi semua field yang diperlukan');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isAdmin && (apiUser?.role === 1 || apiUser?.role === 'admin')) {
        // Admin using API
        if (location) {
          // Update existing destination via API
          const updateData: UpdateDestinationRequest = {
            id: Number(location.id),
            name: formData.name,
            description: formData.fullDescription || formData.shortDescription,
            price: Number(formData.ticketPrice),
            toilet: formData.toilet,
            parking: formData.parking,
            restarea: formData.restarea,
            restaurant: formData.restaurant,
            address: formData.address,
            cover: mainImageFile || undefined,
            images: galleryFiles.length > 0 ? galleryFiles : undefined
          };

          await destinationAPI.update(updateData);
          toast.success('Tempat wisata berhasil diperbarui!');
        } else {
          // Create new destination via API
          const createData: CreateDestinationRequest = {
            name: formData.name,
            description: formData.fullDescription || formData.shortDescription,
            price: Number(formData.ticketPrice),
            toilet: formData.toilet,
            parking: formData.parking,
            restarea: formData.restarea,
            restaurant: formData.restaurant,
            address: formData.address,
            location: `${formData.latitude}, ${formData.longitude}`,
            cover: mainImageFile || undefined,
            images: galleryFiles.length > 0 ? galleryFiles : undefined
          };

          await destinationAPI.create(createData);
          toast.success('Tempat wisata berhasil ditambahkan!');
        }
        onSave();
      } else {
        // Fallback to local data for non-API admin or user submissions
        let mainImageUrl = formData.mainImage;
        let galleryUrls: string[] = [];

        if (isAdmin) {
          if (mainImageFile) {
            mainImageUrl = await convertFileToUrl(mainImageFile);
          } else if (!mainImageUrl) {
            mainImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
          }

          if (galleryFiles.length > 0) {
            galleryUrls = await Promise.all(galleryFiles.map(file => convertFileToUrl(file)));
          } else if (location?.gallery) {
            galleryUrls = location.gallery;
          }
        } else {
          mainImageUrl = formData.mainImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
          galleryUrls = formData.gallery ? formData.gallery.split(',').map(url => url.trim()) : [];
        }

        const wisataData = {
          name: formData.name,
          category: formData.category,
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription,
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          mainImage: mainImageUrl,
          gallery: galleryUrls,
          openingHours: formData.openingHours,
          ticketPrice: Number(formData.ticketPrice),
          facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()) : [],
          status: isAdmin ? formData.status as 'published' | 'draft' | 'archived' : 'pending' as const,
          mabacScore: Math.random() * 10 + 80
        };

        if (location) {
          updateLocation(location.id, wisataData);
          toast.success('Tempat wisata berhasil diperbarui!');
        } else {
          if (isAdmin) {
            addLocation(wisataData);
            toast.success('Tempat wisata berhasil ditambahkan!');
          } else {
            if (apiUser?.id) {
              submitLocationProposal(wisataData, apiUser.id);
              toast.success('Pengajuan tempat wisata berhasil dikirim! Menunggu persetujuan admin.');
            } else {
              toast.error('Anda harus login untuk mengajukan tempat wisata.');
              return;
            }
          }
        }
        onSave();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    if (location) {
      return isAdmin ? 'Edit Tempat Wisata' : 'Detail Tempat Wisata';
    }
    return isAdmin ? 'Tambah Tempat Wisata Baru' : 'Ajukan Tempat Wisata Baru';
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Menyimpan...';
    if (location) {
      return 'Perbarui';
    }
    return isAdmin ? 'Simpan' : 'Kirim Pengajuan';
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {getFormTitle()}
        </CardTitle>
        {!isAdmin && !location && (
          <p className="text-sm text-muted-foreground">
            Pengajuan Anda akan direview oleh admin sebelum dipublikasi
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <WisataFormFields
            formData={formData}
            onInputChange={handleInputChange}
            categories={categories}
            isAdmin={isAdmin}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            getSubmitButtonText={getSubmitButtonText}
            isSubmitting={isSubmitting}
          />
          
          {/* Photo Upload Section - Different for Admin and User */}
          {isAdmin ? (
            <PhotoUploadSection
              mainImagePreview={mainImagePreview}
              galleryPreviews={galleryPreviews}
              onMainImageChange={handleMainImageChange}
              onGalleryChange={handleGalleryChange}
              onRemoveGalleryImage={removeGalleryImage}
            />
          ) : (
            <PhotoUrlSection
              mainImageUrl={formData.mainImage}
              galleryUrls={formData.gallery}
              onMainImageChange={(value) => handleInputChange('mainImage', value)}
              onGalleryChange={(value) => handleInputChange('gallery', value)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WisataForm;