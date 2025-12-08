
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { useApiDestinations } from '@/hooks/useApiDestinations';
import { WisataLocation } from '@/types';
import SearchFilters from './SearchFilters';
import WisataCard from './WisataCard';
import ApiReviewSection from './ApiReviewSection';

const ApiUserPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<WisataLocation | null>(null);
  const { destinations, isLoading, loadDestinations, getFilteredDestinations, searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory } = useApiDestinations();

  useEffect(() => {
    console.log('ApiUserPage: Loading destinations...');
    loadDestinations();
  }, []);

  const filteredLocations = getFilteredDestinations();
  console.log('ApiUserPage: Filtered locations:', filteredLocations);
  console.log('ApiUserPage: Is loading:', isLoading);
  console.log('ApiUserPage: Total destinations:', destinations.length);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (selectedLocation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedLocation(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Wisata</span>
            </Button>
          </div>

          {/* Detail Lokasi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Gambar Utama */}
              <Card>
                <CardContent className="p-0">
                  <img
                    src={selectedLocation.mainImage}
                    alt={selectedLocation.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>

              {/* Informasi Detail */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedLocation.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{selectedLocation.category}</Badge>
                        {selectedLocation.mabacScore && (
                          <Badge className="bg-bali-gradient text-white">
                            Score: {selectedLocation.mabacScore.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-bali-ocean">
                        {formatPrice(selectedLocation.ticketPrice)}
                      </div>
                      <div className="text-sm text-gray-500">per orang</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 mt-1 text-gray-500" />
                      <span className="text-sm">{selectedLocation.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{selectedLocation.openingHours}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLocation.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Fasilitas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Galeri */}
              {selectedLocation.gallery.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Galeri Foto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedLocation.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedLocation.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Ulasan */}
            <div className="space-y-6">
              <ApiReviewSection locationId={selectedLocation.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bali-ocean mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat destinasi wisata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-bali-gradient text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Jelajahi Wisata Buleleng</h1>
        <p className="opacity-90">
          Temukan tempat wisata terbaik dan bagikan pengalaman Anda
        </p>
      </div>

      {/* Filter Pencarian */}
      <SearchFilters />

      {/* Daftar Wisata */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Tempat Wisata Rekomendasi
          </h2>
          <div className="text-sm text-gray-600">
            {filteredLocations.length} destinasi ditemukan
          </div>
        </div>

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <WisataCard
                key={location.id}
                location={location}
                onViewDetails={setSelectedLocation}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada destinasi ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiUserPage;
