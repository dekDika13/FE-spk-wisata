
import { create } from 'zustand';
import { destinationAPI, DestinationDTO } from '@/services/api';
import { WisataLocation } from '@/types';

interface ApiDestinationState {
  destinations: WisataLocation[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  loadDestinations: () => Promise<void>;
  getDestinationById: (id: string) => WisataLocation | undefined;
  getFilteredDestinations: () => WisataLocation[];
}

// Convert DTO to WisataLocation
const convertDTOToWisataLocation = (dto: DestinationDTO): WisataLocation => {
  // Convert facility ratings to display format
  const facilities = [
    `Toilet ${dto.toilet}`,
    `Parkir ${dto.parking}`,
    `Rest Area ${dto.restarea}`,
    `Restaurant ${dto.restaurant}`
  ];

  return {
    id: dto.destination_id.toString(),
    name: dto.name,
    slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
    category: 'Destinasi Wisata',
    shortDescription: dto.description.length > 150 ? 
      dto.description.substring(0, 150) + '...' : dto.description,
    fullDescription: dto.description,
    address: dto.address,
    latitude: 0, // Default, bisa diupdate jika ada koordinat
    longitude: 0, 
    mainImage: dto.cover,
    gallery: dto.gallery || [],
    openingHours: '08:00 - 17:00',
    ticketPrice: dto.price,
    facilities: facilities,
    status: 'published' as const,
    createdAt: new Date().toISOString(),
    averageRating: 0,
    totalReviews: 0,
    mabacScore: Number(dto.assessment_result),
  };
};

export const useApiDestinations = create<ApiDestinationState>((set, get) => ({
  destinations: [],
  isLoading: false,
  searchTerm: '',
  selectedCategory: '',
  
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  
  loadDestinations: async () => {
    set({ isLoading: true });
    try {
      console.log('Loading destinations from API...');
      const dtos = await destinationAPI.getAll();
      console.log('API response:', dtos);
      const destinations = dtos.map(convertDTOToWisataLocation);
      console.log('Converted destinations:', destinations);
      set({ destinations });
    } catch (error) {
      console.error('Failed to load destinations:', error);
      console.error('Error details:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  getDestinationById: (id: string) => {
    return get().destinations.find(dest => dest.id === id);
  },
  
  getFilteredDestinations: () => {
    const { destinations, searchTerm, selectedCategory } = get();
    
    return destinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           destination.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || destination.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => (b.mabacScore || 0) - (a.mabacScore || 0));
  }
}));
