
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Star, TrendingUp, Calculator } from 'lucide-react';
import { useWisata } from '@/hooks/useWisata';
import { useApiAuth } from '@/hooks/useApiAuth';

interface AdminDashboardProps {
  onNavigateToMabac?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateToMabac 
}) => {
  const { locations, ratings } = useWisata();
  const { user } = useApiAuth();

  const totalPublishedLocations = locations.filter(loc => loc.status === 'published').length;
  const totalRatings = ratings.length;
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  const recentRatings = ratings.slice(-5).reverse();

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
              <p className="opacity-90 mb-1">Selamat datang, {user?.name || 'Administrator'}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPublishedLocations}</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
          </CardContent>
        </Card>
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
                <img  src={user.photo || ''} alt={user.name} 
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
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <Badge variant="default">Administrator</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
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
            {recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.map((rating) => (
                  <div key={rating.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{rating.userName}</span>
                        <Badge variant="outline" className="text-xs">
                          Lokasi #{rating.locationId}
                        </Badge>
                      </div>
                      {rating.review && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{rating.review}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              className={`w-3 h-3 ${
                                index < rating.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString('id-ID')}
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
            <div className="space-y-4">
              {locations
                .filter(loc => loc.status === 'published')
                .sort((a, b) => b.totalReviews - a.totalReviews)
                .slice(0, 5)
                .map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{location.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {location.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{location.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{location.totalReviews}</div>
                      <div className="text-xs text-gray-500">ulasan</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
