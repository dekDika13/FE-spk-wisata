const BASE_URL = 'http://localhost:8080';



// Types untuk API
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
  full_name: string;
  photo?: File;
  bod: string;
  address: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: any;
}

// API Response wrapper
interface ApiResponse<T> {
  message: string;
  code: number;
  data: T;
}

// Login data structure from API
interface LoginData {
  username: string;
  token: string;
}

export interface DestinationDTO {
  destination_id: number;
  name: string;
  description: string;
  cover: string;
  gallery: string[];
  toilet: number;
  parking: number;
  restarea: number;
  restaurant: number;
  price: number;
  rating: string;
  assessment_result: string;
  address: string;
  location: string;
}

// Create destination request (Admin)
export interface CreateDestinationRequest {
  name: string;
  description: string;
  price: number;
  toilet: number;
  parking: number;
  restarea: number;
  restaurant: number;
  address: string;
  location: string; // "lat, lng"
  cover?: File;
  images?: File[];
}

// Update destination request (Admin)
export interface UpdateDestinationRequest {
  id: number;
  name: string;
  description: string;
  price: number;
  toilet: number;
  parking: number;
  restarea: number;
  restaurant: number;
  address: string;
  cover?: File;
  images?: File[];
}

// Delete destination request
export interface DeleteDestinationRequest {
  id: string;
}

// Review interfaces
export interface ReviewDTO {
  review_id: number;
  destination_id: number;
  name: string;
  username: string;
  review_detail: string;
  rating_c1: number;
  rating_c2: number;
  rating_c4: number;
  rating_c6: number;
  rating_c7: number;
  created_at: string;
}

export interface CreateReviewRequest {
  destination_id: number;
  review_detail: string;
  rating_c1: number;
  rating_c2: number;
  rating_c4: number;
  rating_c6: number;
  rating_c7: number;
}


// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<any> => {

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('full_name', data.full_name);
    formData.append('bod', data.bod);
    formData.append('address', data.address);

    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const result: ApiResponse<LoginData> = await response.json();

    return {
      token: result.data.token,
      user: {
        username: result.data.username
      }
    };
  },

  getProfile: async (userRole?: 'admin' | 'user'): Promise<any> => {
    const token = localStorage.getItem('auth_token');


    const version = userRole === 'admin' ? 'v1' : 'v2';

    const response = await fetch(`${BASE_URL}/${version}/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },

  getUserById: async (userId: number): Promise<any> => {
    const token = localStorage.getItem('auth_token');



    const response = await fetch(`${BASE_URL}/v2/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  },
};

// Destination API
export const destinationAPI = {
  getAll: async (): Promise<DestinationDTO[]> => {


    const response = await fetch(`${BASE_URL}/destination`);

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const result: ApiResponse<DestinationDTO[]> = await response.json();
    return result.data;
  },

  getById: async (id: number): Promise<DestinationDTO> => {


    const response = await fetch(`${BASE_URL}/destination/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }

    const result: ApiResponse<DestinationDTO> = await response.json();
    return result.data;
  },

  // Admin create destination (v1)
  // POST {{local_link}}/v1/destination/
  create: async (data: CreateDestinationRequest): Promise<any> => {
    const token = localStorage.getItem('auth_token');


    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('toilet', data.toilet.toString());
    formData.append('parking', data.parking.toString());
    formData.append('restarea', data.restarea.toString());
    formData.append('restaurant', data.restaurant.toString());
    formData.append('address', data.address);
    formData.append('location', data.location);

    if (data.cover) {
      formData.append('cover', data.cover);
    }

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${BASE_URL}/v1/destination/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create destination');
    }

    return response.json();
  },

  // Admin update destination (v1)
  // PUT {{local_link}}/v1/destination/update
  update: async (data: UpdateDestinationRequest): Promise<any> => {
    const token = localStorage.getItem('auth_token');



    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('toilet', data.toilet.toString());
    formData.append('parking', data.parking.toString());
    formData.append('restarea', data.restarea.toString());
    formData.append('restaurant', data.restaurant.toString());
    formData.append('address', data.address);

    if (data.cover) {
      formData.append('cover', data.cover);
    }

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${BASE_URL}/v1/destination/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update destination');
    }

    return response.json();
  },

  // Admin delete destination (v1)
  // DELETE {{local_link}}/v1/destination/delete
  // Body: { "id": "string" }
  delete: async (id: number): Promise<any> => {
    const token = localStorage.getItem('auth_token');



    const response = await fetch(`${BASE_URL}/v1/destination/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id.toString() }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete destination');
    }

    return response.json();
  },
};

// Review API
export const reviewAPI = {
 getAll: async (): Promise<ReviewDTO[]> => {
    const token = localStorage.getItem('auth_token'); // Ambil token

    // Ubah URL ke v2 dan tambahkan Headers Authorization
    const response = await fetch(`${BASE_URL}/v2/review`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }

    const result: ApiResponse<ReviewDTO[]> = await response.json();
    return result.data;
  },

  // 2. PERBAIKAN: getAllPublic sekarang murni ambil data public (Tanpa Token)
  getAllPublic: async (): Promise<ReviewDTO[]> => {
    // Kembali ke URL awal yang public
    const response = await fetch(`${BASE_URL}/review`, {
      method: 'GET', // Default GET, tapi ditulis biar jelas
    });

    if (!response.ok) {
      throw new Error('Failed to fetch public reviews');
    }

    const result: ApiResponse<ReviewDTO[]> = await response.json();
    return result.data;
  },

  create: async (data: CreateReviewRequest): Promise<any> => {
    const token = localStorage.getItem('auth_token');


    const response = await fetch(`${BASE_URL}/v2/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create review');
    }

    return response.json();
  },

  update: async (reviewId: number, data: CreateReviewRequest): Promise<any> => {
    const token = localStorage.getItem('auth_token');


    const response = await fetch(`${BASE_URL}/v2/review/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: reviewId, ...data }),
    });

    if (!response.ok) {
      throw new Error('Failed to update review');
    }

    return response.json();
  },
};