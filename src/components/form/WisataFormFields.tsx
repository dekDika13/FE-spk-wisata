import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  ticketPrice: number;
  facilities: string;
  status: string;
  toilet: number;
  parking: number;
  restarea: number;
  restaurant: number;
}

interface WisataFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: string | number) => void;
  categories: string[];
  isAdmin: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  getSubmitButtonText: () => string;
  isSubmitting?: boolean;
}

const WisataFormFields: React.FC<WisataFormFieldsProps> = ({
  formData,
  onInputChange,
  // categories,
  isAdmin,
  onSubmit,
  onCancel,
  getSubmitButtonText,
  isSubmitting = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Tempat Wisata *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Contoh: Pantai Lovina"
            required
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => onInputChange('shortDescription', e.target.value)}
          placeholder="Deskripsi singkat untuk card"
          rows={2}
        />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Deskripsi Lengkap *</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) => onInputChange('fullDescription', e.target.value)}
          placeholder="Deskripsi lengkap untuk halaman detail"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onInputChange('address', e.target.value)}
          placeholder="Alamat lengkap"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            placeholder="-8.1234"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            placeholder="115.1234"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div className="space-y-2">
          <Label htmlFor="openingHours">Jam Operasional</Label>
          <Input
            id="openingHours"
            value={formData.openingHours}
            onChange={(e) => onInputChange('openingHours', e.target.value)}
            placeholder="08:00 - 18:00"
          />
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="ticketPrice">Harga Tiket (Rp) *</Label>
          <Input
            id="ticketPrice"
            type="number"
            value={formData.ticketPrice}
            onChange={(e) => onInputChange('ticketPrice', e.target.value)}
            placeholder="25000"
            required
          />
        </div>
      </div>

      {isAdmin ? (
        // Admin: Rating fields for MABAC criteria
        <>
          <div className="space-y-2">
            <Label>Fasilitas (untuk perhitungan MABAC)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="toilet">Toilet (1-5)</Label>
                <Input
                  id="toilet"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.toilet}
                  onChange={(e) => onInputChange('toilet', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="parking">Parkir (1-5)</Label>
                <Input
                  id="parking"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.parking}
                  onChange={(e) => onInputChange('parking', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="restarea">Area Istirahat (1-5)</Label>
                <Input
                  id="restarea"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.restarea}
                  onChange={(e) => onInputChange('restarea', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="restaurant">Restoran (1-5)</Label>
                <Input
                  id="restaurant"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.restaurant}
                  onChange={(e) => onInputChange('restaurant', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        // User: Text input for facilities
        <div className="space-y-2">
          <Label htmlFor="facilities">Fasilitas (pisahkan dengan koma)</Label>
          <Textarea
            id="facilities"
            value={formData.facilities}
            onChange={(e) => onInputChange('facilities', e.target.value)}
            placeholder="Parkir, Toilet, Warung Makan, WiFi"
            rows={2}
          />
        </div>
      )}

      {/* {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="published">Terpublikasi</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )} */}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" className="bg-bali-gradient hover:opacity-90" disabled={isSubmitting}>
          {getSubmitButtonText()}
        </Button>
      </div>
    </form>
  );
};

export default WisataFormFields;