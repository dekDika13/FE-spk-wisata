import { create } from 'zustand';
import { authAPI, RegisterRequest, LoginRequest } from '@/services/api';
import { decodeJWT } from '@/utils/jwt';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  photo?: string;
  bod?: string;
  role: number | 'user' | 'admin';
}

interface ApiAuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
}

export const useApiAuth = create<ApiAuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('auth_token', response.token);
      
      // Decode JWT untuk mendapatkan role
      const decodedToken = decodeJWT(response.token);
      console.log('Decoded token:', decodedToken);
      
      // Load profile after login
      await get().loadProfile();
      
    } catch (error) {
      localStorage.removeItem('auth_token');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (data: RegisterRequest) => {
    set({ isLoading: true });
    try {
      await authAPI.register(data);
      // After registration, login with username and password
      await get().login({ username: data.username, password: data.password });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      // Decode JWT untuk mendapatkan role
      const decodedToken = decodeJWT(token);
      console.log('Loading profile with decoded token:', decodedToken);
      
      const userRole = decodedToken?.role === 'admin' || decodedToken?.role === 1 ? 'admin' : 'user';

      const response = await authAPI.getProfile(userRole);
      
      // Use the data from the response
      const profileData = response.data;
      
      const user: ApiUser = {
        id: profileData.user_id?.toString() || decodedToken?.userID?.toString() || '1',
        name: profileData.full_name || decodedToken?.username || 'User',
        email: profileData.email || 'user@example.com',
        username: profileData.username || decodedToken?.username || 'user',
        phone: profileData.phone || '',
        address: profileData.address || '',
        photo: profileData.photo || '',
        bod: profileData.bod,
        role: profileData.role || (decodedToken?.role === 1 ? 1 : 2), // Use numeric role from API
      };
      
      console.log('Setting user:', user);
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Error loading profile:', error);
      localStorage.removeItem('auth_token');
      set({ user: null, isAuthenticated: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
  }
}));

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    useApiAuth.getState().loadProfile().catch(() => {
      localStorage.removeItem('auth_token');
    });
  }
}
