
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users } from 'lucide-react';
import { WisataLocation } from '@/types';

interface WisataCardProps {
  location: WisataLocation;
  onViewDetails: (location: WisataLocation) => void;
}

const WisataCard: React.FC<WisataCardProps> = ({ location, onViewDetails }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={location.mainImage}
          alt={location.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90">
            {location.category}
          </Badge>
        </div>
        {location.mabacScore && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-bali-gradient text-white">
              Score: {location.mabacScore.toFixed(2)}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {location.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{location.averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{location.address}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {location.shortDescription}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{location.totalReviews} ulasan</span>
          </div>
          <div className="text-bali-ocean font-bold">
            {formatPrice(location.ticketPrice)}
          </div>
        </div>
        
        <Button
          onClick={() => onViewDetails(location)}
          className="w-full bg-bali-gradient hover:opacity-90"
        >
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
};

export default WisataCard;
