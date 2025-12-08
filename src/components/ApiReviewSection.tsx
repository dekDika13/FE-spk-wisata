import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { reviewAPI } from '@/services/api';
import { useApiAuth } from '@/hooks/useApiAuth';
import { toast } from 'sonner';

interface ReviewSectionProps {
  locationId: string;
}

interface ReviewCriteria {
  code: string;
  name: string;
  description: string;
}

const CRITERIA: ReviewCriteria[] = [
  {
    code: 'c1',
    name: 'Keindahan Alam',
    description: 'Pemandangan visual, flora, fauna, keunikan'
  },
  {
    code: 'c2',
    name: 'Aksesibilitas',
    description: 'Jarak dari pusat kota, kondisi jalan, transportasi'
  },
  {
    code: 'c4',
    name: 'Keamanan',
    description: 'Keberadaan petugas, keamanan dari gangguan'
  },
  {
    code: 'c6',
    name: 'Kebersihan & Kelestarian',
    description: 'Kebersihan tempat, konservasi lingkungan'
  },
  {
    code: 'c7',
    name: 'Popularitas',
    description: 'Tingkat kunjungan, rekomendasi wisatawan'
  }
];

const ApiReviewSection: React.FC<ReviewSectionProps> = ({ locationId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({
    c1: 0,
    c2: 0,
    c4: 0,
    c6: 0,
    c7: 0
  });
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});
  
  const { user, isAuthenticated } = useApiAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const allReviews = await reviewAPI.getAllPublic();
      // Filter reviews untuk destinasi ini
      const destinationReviews = allReviews.filter(
        review => review.destination_id.toString() === locationId
      );
      setReviews(destinationReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    // Cek apakah semua rating sudah diisi
    const hasEmptyRating = Object.values(ratings).some(rating => rating === 0);
    if (hasEmptyRating) {
      toast.error('Silakan beri rating untuk semua kriteria');
      return;
    }

    if (!newReview.trim()) {
      toast.error('Silakan tulis ulasan Anda');
      return;
    }

    try {
      await reviewAPI.create({
        destination_id: parseInt(locationId),
        review_detail: newReview.trim(),
        rating_c1: ratings.c1,
        rating_c2: ratings.c2,
        rating_c4: ratings.c4,
        rating_c6: ratings.c6,
        rating_c7: ratings.c7
      });

      toast.success('Ulasan berhasil ditambahkan!');
      setNewReview('');
      setRatings({
        c1: 0,
        c2: 0,
        c4: 0,
        c6: 0,
        c7: 0
      });
      loadReviews(); // Reload reviews
    } catch (error) {
      toast.error('Gagal menambahkan ulasan');
      console.error('Failed to submit review:', error);
    }
  };

  const updateRating = (criteriaCode: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [criteriaCode]: rating
    }));
  };

  const renderCriteriaStars = (criteria: ReviewCriteria, interactive = false) => {
    const currentRating = ratings[criteria.code];
    const hoveredValue = hoveredRating[criteria.code] || 0;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm">{criteria.name}</h4>
            <p className="text-xs text-gray-500">{criteria.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: 10 }, (_, index) => {
                const pointValue = index + 1;
                const isActive = interactive ? 
                  (hoveredValue >= pointValue || (!hoveredValue && currentRating >= pointValue)) :
                  currentRating >= pointValue;

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full border cursor-pointer transition-colors ${
                      isActive ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-200 border-gray-300'
                    }`}
                    onClick={interactive ? () => updateRating(criteria.code, pointValue) : undefined}
                    onMouseEnter={interactive ? () => setHoveredRating(prev => ({ ...prev, [criteria.code]: pointValue })) : undefined}
                    onMouseLeave={interactive ? () => setHoveredRating(prev => ({ ...prev, [criteria.code]: 0 })) : undefined}
                  />
                );
              })}
            </div>
            {interactive && (
              <span className="text-sm font-medium min-w-[20px]">
                {hoveredValue || currentRating || 0}/10
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const calculateAverageRating = (review: any) => {
    const total = review.rating_c1 + review.rating_c2 + review.rating_c4 + review.rating_c6 + review.rating_c7;
    return (total / 5).toFixed(1);
  };

  const renderRatingDots = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              rating >= index + 1 ? 'bg-yellow-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bali-ocean mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat ulasan...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Tambah Ulasan */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Tulis Ulasan Anda</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Beri Rating untuk Setiap Kriteria:</h4>
              {CRITERIA.map((criteria) => (
                <div key={criteria.code} className="p-4 border rounded-lg bg-gray-50">
                  {renderCriteriaStars(criteria, true)}
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ulasan Detail:</label>
              <Textarea
                placeholder="Bagikan pengalaman Anda tentang tempat wisata ini..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview}
              className="bg-bali-gradient hover:opacity-90"
            >
              Kirim Ulasan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Daftar Ulasan */}
      <Card>
        <CardHeader>
          <CardTitle>
            Ulasan Pengunjung ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.username}</h4>
                       <div className="flex items-center space-x-2 mt-1">
                         <div className="flex items-center space-x-2">
                           {renderRatingDots(parseFloat(calculateAverageRating(review)))}
                           <span className="text-sm font-medium">
                             {calculateAverageRating(review)}/10
                           </span>
                         </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detail Rating per Kriteria */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mb-4">
                    {CRITERIA.map((criteria) => (
                       <div key={criteria.code} className="flex justify-between items-center text-sm">
                         <span className="text-gray-600">{criteria.name}:</span>
                         <div className="flex items-center space-x-2">
                           {renderRatingDots(review[`rating_${criteria.code}`])}
                           <span className="font-medium">({review[`rating_${criteria.code}`]}/10)</span>
                         </div>
                       </div>
                    ))}
                  </div>
                  
                  {review.review_detail && (
                    <p className="text-gray-700 leading-relaxed">{review.review_detail}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada ulasan untuk tempat wisata ini.</p>
              <p className="text-sm mt-1">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiReviewSection;