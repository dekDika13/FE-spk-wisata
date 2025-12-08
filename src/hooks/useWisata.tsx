
import { create } from 'zustand';
import { WisataLocation, Rating } from '@/types';
import { wisataLocations, ratingsData } from '@/data/wisataData';

interface WisataState {
  locations: WisataLocation[];
  ratings: Rating[];
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  getLocationById: (id: string) => WisataLocation | undefined;
  getRatingsByLocationId: (locationId: string) => Rating[];
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  updateRating: (ratingId: string, updates: Partial<Pick<Rating, 'rating' | 'review'>>) => void;
  deleteRating: (ratingId: string) => void;
  getFilteredLocations: () => WisataLocation[];
  // CRUD operations for admin
  addLocation: (location: Omit<WisataLocation, 'id' | 'slug' | 'createdAt' | 'averageRating' | 'totalReviews'>) => void;
  updateLocation: (locationId: string, updates: Partial<WisataLocation>) => void;
  deleteLocation: (locationId: string) => void;
  // User submission
  submitLocationProposal: (location: Omit<WisataLocation, 'id' | 'slug' | 'createdAt' | 'averageRating' | 'totalReviews' | 'status'>, userId: string) => void;
  // Admin review
  approveLocation: (locationId: string, adminId: string) => void;
  rejectLocation: (locationId: string, adminId: string, reason: string) => void;
  getPendingLocations: () => WisataLocation[];
}

export const useWisata = create<WisataState>((set, get) => ({
  locations: wisataLocations,
  ratings: ratingsData,
  searchTerm: '',
  selectedCategory: '',
  
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  
  getLocationById: (id: string) => {
    return get().locations.find(location => location.id === id);
  },
  
  getRatingsByLocationId: (locationId: string) => {
    return get().ratings.filter(rating => rating.locationId === locationId);
  },
  
  addRating: (newRating: Omit<Rating, 'id' | 'createdAt'>) => {
    const rating: Rating = {
      ...newRating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      ratings: [...state.ratings, rating]
    }));
    
    // Update location's average rating
    const locationRatings = [...get().ratings, rating].filter(r => r.locationId === newRating.locationId);
    const averageRating = locationRatings.reduce((sum, r) => sum + r.rating, 0) / locationRatings.length;
    
    set(state => ({
      locations: state.locations.map(location => 
        location.id === newRating.locationId 
          ? { ...location, averageRating, totalReviews: locationRatings.length }
          : location
      )
    }));
  },

  updateRating: (ratingId: string, updates: Partial<Pick<Rating, 'rating' | 'review'>>) => {
    let locationId: string | null = null;
    
    set(state => ({
      ratings: state.ratings.map(rating => {
        if (rating.id === ratingId) {
          locationId = rating.locationId;
          return { ...rating, ...updates };
        }
        return rating;
      })
    }));

    // Update location's average rating if rating value changed
    if (locationId && updates.rating !== undefined) {
      const locationRatings = get().ratings.filter(r => r.locationId === locationId);
      const averageRating = locationRatings.reduce((sum, r) => sum + r.rating, 0) / locationRatings.length;
      
      set(state => ({
        locations: state.locations.map(location => 
          location.id === locationId 
            ? { ...location, averageRating }
            : location
        )
      }));
    }
  },

  deleteRating: (ratingId: string) => {
    let locationId: string | null = null;
    
    set(state => ({
      ratings: state.ratings.filter(rating => {
        if (rating.id === ratingId) {
          locationId = rating.locationId;
          return false;
        }
        return true;
      })
    }));

    // Update location's average rating
    if (locationId) {
      const locationRatings = get().ratings.filter(r => r.locationId === locationId);
      const averageRating = locationRatings.length > 0 
        ? locationRatings.reduce((sum, r) => sum + r.rating, 0) / locationRatings.length 
        : 0;
      
      set(state => ({
        locations: state.locations.map(location => 
          location.id === locationId 
            ? { ...location, averageRating, totalReviews: locationRatings.length }
            : location
        )
      }));
    }
  },

  // CRUD operations
  addLocation: (newLocation: Omit<WisataLocation, 'id' | 'slug' | 'createdAt' | 'averageRating' | 'totalReviews'>) => {
    const location: WisataLocation = {
      ...newLocation,
      id: Date.now().toString(),
      slug: newLocation.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      averageRating: 0,
      totalReviews: 0
    };
    
    set(state => ({
      locations: [...state.locations, location]
    }));
  },

  updateLocation: (locationId: string, updates: Partial<WisataLocation>) => {
    set(state => ({
      locations: state.locations.map(location =>
        location.id === locationId
          ? { ...location, ...updates }
          : location
      )
    }));
  },

  deleteLocation: (locationId: string) => {
    set(state => ({
      locations: state.locations.filter(location => location.id !== locationId),
      ratings: state.ratings.filter(rating => rating.locationId !== locationId)
    }));
  },

  // User submission
  submitLocationProposal: (newLocation: Omit<WisataLocation, 'id' | 'slug' | 'createdAt' | 'averageRating' | 'totalReviews' | 'status'>, userId: string) => {
    const location: WisataLocation = {
      ...newLocation,
      id: Date.now().toString(),
      slug: newLocation.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      averageRating: 0,
      totalReviews: 0,
      status: 'pending',
      submittedBy: userId
    };
    
    set(state => ({
      locations: [...state.locations, location]
    }));
  },

  // Admin review
  approveLocation: (locationId: string, adminId: string) => {
    set(state => ({
      locations: state.locations.map(location =>
        location.id === locationId
          ? { 
              ...location, 
              status: 'published', 
              reviewedBy: adminId, 
              reviewedAt: new Date().toISOString(),
              rejectionReason: undefined
            }
          : location
      )
    }));
  },

  rejectLocation: (locationId: string, adminId: string, reason: string) => {
    set(state => ({
      locations: state.locations.map(location =>
        location.id === locationId
          ? { 
              ...location, 
              status: 'rejected', 
              reviewedBy: adminId, 
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          : location
      )
    }));
  },

  getPendingLocations: () => {
    return get().locations.filter(location => location.status === 'pending');
  },
  
  getFilteredLocations: () => {
    const { locations, searchTerm, selectedCategory } = get();
    
    return locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || location.category === selectedCategory;
      
      return matchesSearch && matchesCategory && location.status === 'published';
    }).sort((a, b) => (b.mabacScore || 0) - (a.mabacScore || 0));
  }
}));
