
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, Clock, DollarSign, Users, Wifi } from 'lucide-react';
import { WisataLocation } from '@/types';
import { useWisata } from '@/hooks/useWisata';
import { useApiAuth } from '@/hooks/useApiAuth';
import { reviewAPI, authAPI } from '@/services/api';
import ImageGallery from '@/components/ui/image-gallery';
import { toast } from 'sonner';

interface LocationDetailProps {
  location: WisataLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({ location, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [usernames, setUsernames] = useState<Record<number, string>>({});

  const { getRatingsByLocationId, addRating } = useWisata();
  const { user, isAuthenticated } = useApiAuth();

  useEffect(() => {
    if (location && isOpen) {
      loadReviews();
    }
  }, [location, isOpen]);

  const loadReviews = async () => {
    if (!location) return;

    setIsLoadingReviews(true);
    try {
      const allReviews = await reviewAPI.getAll();
      // Filter reviews untuk destinasi ini
      const destinationReviews = allReviews.filter(
        review => review.destination_id.toString() === location.id
      );
      setReviews(destinationReviews);

    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  if (!location) return null;

  const locationRatings = getRatingsByLocationId(location.id);
  const userRating = locationRatings.find(r => r.userId === user?.id);

  // Prepare gallery images (main image + gallery)
  const allImages = [location.mainImage, ...location.gallery].filter(Boolean);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRatingSubmit = () => {
    if (!isAuthenticated || !user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    if (rating === 0) {
      toast.error('Silakan pilih rating');
      return;
    }

    addRating({
      userId: user.id,
      locationId: location.id,
      rating,
      review: review.trim() || undefined,
      userName: user.name
    });

    toast.success('Rating berhasil ditambahkan!');
    setRating(0);
    setReview('');
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = interactive ?
        (hoveredStar >= starValue || (!hoveredStar && rating >= starValue)) :
        currentRating >= starValue;

      return (
        <Star
          key={index}
          className={`w-5 h-5 cursor-pointer ${isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        />
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{location.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group cursor-pointer overflow-hidden rounded-lg" onClick={() => openGallery(0)}>
              <img
                src={location.mainImage}
                alt={location.name}
                className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-medium text-lg bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                    Klik untuk melihat galeri
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {location.gallery.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openGallery(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${location.name} ${index + 1}`}
                    className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  {index === 3 && location.gallery.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{location.gallery.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{location.category}</Badge>
              {location.mabacScore && (
                <Badge className="bg-bali-gradient text-white">
                  Score: {location.mabacScore.toFixed(2)}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{location.averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({location.totalReviews} ulasan)</span>
            </div>
            <div className="flex items-center space-x-2 text-bali-ocean font-bold text-lg">
              <DollarSign className="w-5 h-5" />
              {formatPrice(location.ticketPrice)}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Informasi</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                  <span className="text-sm">{location.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{location.openingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Fasilitas</h3>
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((facility, index) => (
                  <Badge key={index} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed">{location.fullDescription}</p>
          </div>

          {/* Rating Section - Show only for authenticated tourists */}
          {isAuthenticated && user?.role !== 1 && !userRating && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Berikan Rating</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex space-x-1">
                    {renderStars(rating, true)}
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Tulis ulasan Anda (opsional)"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleRatingSubmit}
                  className="bg-bali-gradient hover:opacity-90"
                >
                  Kirim Rating
                </Button>
              </div>
            </div>
          )}

          {/* Reviews - Show to everyone */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Ulasan Pengunjung ({reviews.length})</h3>
            {isLoadingReviews ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bali-ocean mx-auto"></div>
                <p className="mt-2 text-gray-600">Memuat ulasan...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {reviews.map((reviewItem) => (
                  <div key={reviewItem.review_id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-bali-gradient rounded-full flex items-center justify-center text-white font-semibold">
                          {(usernames[reviewItem.user_id] || `User ${reviewItem.user_id}`).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {usernames[reviewItem.user_id] || `User ${reviewItem.user_id}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }, (_, index) => {
                            const starValue = index + 1;
                            const averageRating = (reviewItem.rating_c1 + reviewItem.rating_c2 + reviewItem.rating_c4 + reviewItem.rating_c6 + reviewItem.rating_c7) / 5;
                            const isActive = averageRating >= starValue;
                            return (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(reviewItem.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    {reviewItem.review_detail && (
                      <p className="text-gray-700 leading-relaxed">{reviewItem.review_detail}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada ulasan untuk tempat wisata ini.</p>
                <p className="text-sm mt-1">Jadilah yang pertama memberikan ulasan!</p>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery Modal */}
        <ImageGallery
          images={allImages}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={galleryIndex}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetail;
