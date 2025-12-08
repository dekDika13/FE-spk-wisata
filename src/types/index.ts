
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  username?: string; // Add username for compatibility
  joinedAt: string;
}

export interface WisataLocation {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  mainImage: string;
  gallery: string[];
  openingHours: string;
  ticketPrice: number;
  facilities: string[];
  status: 'published' | 'draft' | 'archived' | 'pending' | 'rejected';
  createdAt: string;
  averageRating: number;
  totalReviews: number;
  mabacScore?: number;
  submittedBy?: string; // User ID who submitted the location
  reviewedBy?: string; // Admin ID who reviewed
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Rating {
  id: string;
  userId: string;
  locationId: string;
  rating: number;
  review?: string;
  createdAt: string;
  userName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
