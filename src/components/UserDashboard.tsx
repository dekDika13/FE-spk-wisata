
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Award, MessageSquare } from 'lucide-react';

import { useApiAuth } from '@/hooks/useApiAuth';
import { reviewAPI, ReviewDTO } from '@/services/api';

interface UserDashboardProps {}
// --- Diambil dari ApiReviewSection ---
// Mendefinisikan struktur kriteria rating
interface ReviewCriteria {
  code: string;
  name: string;
  description: string;
}

// Mendefinisikan konstanta kriteria
const CRITERIA: ReviewCriteria[] = [
  { code: 'c1', name: 'Keindahan Alam', description: 'Pemandangan visual, flora, fauna, keunikan' },
  { code: 'c2', name: 'Aksesibilitas', description: 'Jarak dari pusat kota, kondisi jalan, transportasi' },
  { code: 'c4', name: 'Keamanan', description: 'Keberadaan petugas, keamanan dari gangguan' },
  { code: 'c6', name: 'Kebersihan & Kelestarian', description: 'Kebersihan tempat, konservasi lingkungan' },
  { code: 'c7', name: 'Popularitas', description: 'Tingkat kunjungan, rekomendasi wisatawan' }
];
// ------------------------------------

const UserDashboard: React.FC<UserDashboardProps> = () => {
  const auth = useApiAuth();
  const { user } = auth;
const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const allReviews = await reviewAPI.getAll();
        // Filter reviews untuk user yang sedang login
        
        setReviews(allReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user]);

  if (!user) return null;
// --- Diambil dan disesuaikan dari ApiReviewSection ---
  const calculateAverageRating = (review: ReviewDTO) => {
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
  // ----------------------------------------------------


  const userAverageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + calculateAverageRating(review), 0) / reviews.length
    : 0;

  // Get join date

  
  // Get join date
  const joinDate = new Date().toISOString();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-bali-gradient text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user.name}!</h1>
        <p className="opacity-90">
          Jelajahi keindahan Kabupaten Buleleng dan bagikan pengalaman Anda
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userAverageRating> 0 ? userAverageRating.toFixed(1) : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bergabung Sejak</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(joinDate).toLocaleDateString('id-ID', {
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6 mb-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-bali-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold" >
                <img src={user.photo} className=' w-24 h-24 bg-bali-gradient rounded-full' />
              </div>
            </div>
            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <Badge variant={user.role === 1 ? 'default' : 'secondary'}>
                {user.role === 1 ? 'Administrator' : 'Wisatawan'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-lg">{user.username || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telepon</label>
              <p className="text-lg">{user.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
              <p className="text-lg">{user.bod ? new Date(user.bod).toLocaleDateString('id-ID') : '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bergabung Sejak</label>
              <p className="text-lg">
                {new Date(joinDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Alamat</label>
              <p className="text-lg">{user.address || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

     
{/* --- BAGIAN YANG DIUBAH --- */}
      <Card>
        <CardHeader>
          <CardTitle>Ulasan Anda ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
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
                  <div className="grid grid-cols-1 gap-3 mb-4">
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
                    <p className="text-gray-700 leading-relaxed italic">"{review.review_detail}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Anda belum memberikan ulasan pada lokasi manapun.</p>
              <p className="text-sm mt-1">Mulai jelajahi dan bagikan ulasan Anda!</p>
            </div>
          )}
        </CardContent>
      </Card>

       
      
    </div>
  );
};

export default UserDashboard;
