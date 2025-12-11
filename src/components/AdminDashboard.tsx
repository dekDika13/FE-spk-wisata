import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Star, TrendingUp, Calculator } from 'lucide-react';
import { useApiAuth } from '@/hooks/useApiAuth';
import { destinationAPI, reviewAPI, DestinationDTO, ReviewDTO } from '@/services/api';


interface AdminDashboardProps {
  onNavigateToMabac?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToMabac
}) => {
  const { user } = useApiAuth();
  const [destinations, setDestinations] = useState<DestinationDTO[]>([]);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [destinationsData, reviewsData] = await Promise.all([
          destinationAPI.getAll(),
          reviewAPI.getAllPublic()
        ]);
        setDestinations(destinationsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats from API data
  const totalLocations = destinations.length;
  const totalRatings = reviews.length;

  // Calculate average rating from reviews (average of all criteria ratings)
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => {
      const avgCriteria = (review.rating_c1 + review.rating_c2 + review.rating_c4 + review.rating_c6 + review.rating_c7) / 5;
      return sum + avgCriteria;
    }, 0) / reviews.length
    : 0;

  // Get recent reviews sorted by created_at
  const recentRatings = [...reviews]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Get popular locations (destinations with most reviews)
  const destinationsWithReviewCount = destinations.map(dest => {
    const reviewCount = reviews.filter(r => r.destination_id === dest.destination_id).length;
    const destReviews = reviews.filter(r => r.destination_id === dest.destination_id);
    const avgRating = destReviews.length > 0
      ? destReviews.reduce((sum, r) => sum + (r.rating_c1 + r.rating_c2 + r.rating_c4 + r.rating_c6 + r.rating_c7) / 5, 0) / destReviews.length
      : 0;
    return { ...dest, reviewCount, avgRating };
  }).sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-bali-gradient text-white p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {/* Admin Profile Image */}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard Admin</h1>
              <p className="opacity-90 mb-1">Selamat datang Administrator {user?.name}</p>
              <p className="opacity-75 text-sm">
                Kelola dan pantau sistem rekomendasi wisata Kabupaten Buleleng
              </p>
            </div>
          </div>

          {/* MABAC Button */}
          <Button
            onClick={onNavigateToMabac}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Metode MABAC
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
            <p className="text-xs text-muted-foreground">Lokasi terpublikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRatings}</div>
            <p className="text-xs text-muted-foreground">Dari semua pengguna</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating > 0 ? averageRating.toFixed(1) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Dari semua lokasi</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> </div>
            <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Admin Profile Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-bali-gradient rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                <img src={user.photo || ''} alt={user.name}
                  className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-base">{user.username || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role </label>
                    <Badge variant="default">Administrator</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status </label>
                    <Badge variant="outline" className="text-green-600 border-green-600">Aktif</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Memuat data...</p>
              </div>
            ) : recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.map((review) => (
                  <div key={review.review_id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{review.username || `User #${review.username}`}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {review.name || `Destinasi #${review.destination_id}`}
                      </Badge>
                      {review.review_detail && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{review.review_detail}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {Array.from({ length: 10 }, (_, index) => (
                            <Star
                              key={index}
                              className={`w-3 h-3 ${index < Math.round((review.rating_c1 + review.rating_c2 + review.rating_c4 + review.rating_c6 + review.rating_c7) / 5)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {((review.rating_c1 + review.rating_c2 + review.rating_c4 + review.rating_c6 + review.rating_c7) / 5).toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada rating yang masuk.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi Populer</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Memuat data...</p>
              </div>
            ) : destinationsWithReviewCount.length > 0 ? (
              <div className="space-y-4">
                {destinationsWithReviewCount.slice(0, 5).map((location) => (
                  <div key={location.destination_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{location.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Rp {location.price.toLocaleString('id-ID')}
                        </Badge>
                        {location.avgRating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{location.avgRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{location.reviewCount}</div>
                      <div className="text-xs text-gray-500">ulasan</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada lokasi terdaftar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
