
// const BASE_URL = 'http://localhost:8080';

// // Types untuk API
// export interface RegisterRequest {
//   username: string;
//   password: string;
//   email: string;
//   phone: string;
//   full_name: string;
//   photo?: File;
//   bod: string;
//   address: string;
// }

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   user?: any;
// }

// // API Response wrapper
// interface ApiResponse<T> {
//   message: string;
//   code: number;
//   data: T;
// }

// // Login data structure from API
// interface LoginData {
//   username: string;
//   token: string;
// }

// export interface DestinationDTO {
//   destination_id: number;
//   name: string;
//   description: string;
//   cover: string;
//   gallery: string[];
//   toilet: number;
//   parking: number;
//   restarea: number;
//   restaurant: number;
//   price: number;
//   rating: string;
//   assessment_result: string;
//   address: string;
//   location: string;
// }

// // Create destination request (Admin)
// export interface CreateDestinationRequest {
//   name: string;
//   description: string;
//   price: number;
//   toilet: number;
//   parking: number;
//   restarea: number;
//   restaurant: number;
//   address: string;
//   location: string; // "lat, lng"
//   cover: File;
//   images: File[];
// }

// // Review interfaces
// export interface ReviewDTO {
//   review_id: number;
//   destination_id: number;
//   user_id: number;
//   review_detail: string;
//   rating_c1: number;
//   rating_c2: number;
//   rating_c4: number;
//   rating_c6: number;
//   rating_c7: number;
//   created_at: string;
// }

// export interface CreateReviewRequest {
//   destination_id: number;
//   review_detail: string;
//   rating_c1: number;
//   rating_c2: number;
//   rating_c4: number;
//   rating_c6: number;
//   rating_c7: number;
// }

// // Auth API
// export const authAPI = {
//   register: async (data: RegisterRequest): Promise<any> => {
//     const formData = new FormData();
//     formData.append('username', data.username);
//     formData.append('password', data.password);
//     formData.append('email', data.email);
//     formData.append('phone', data.phone);
//     formData.append('full_name', data.full_name);
//     formData.append('bod', data.bod);
//     formData.append('address', data.address);

//     if (data.photo) {
//       formData.append('photo', data.photo);
//     }

//     const response = await fetch(`${BASE_URL}/register`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Registration failed');
//     }

//     return response.json();
//   },

//   login: async (data: LoginRequest): Promise<LoginResponse> => {
//     const response = await fetch(`${BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Login failed');
//     }

//     const result: ApiResponse<LoginData> = await response.json();

//     // Return in expected format
//     return {
//       token: result.data.token,
//       user: {
//         username: result.data.username
//       }
//     };
//   },

//   getProfile: async (userRole?: 'admin' | 'user'): Promise<any> => {
//     const token = localStorage.getItem('auth_token');
//     const version = userRole === 'admin' ? 'v1' : 'v2';

//     const response = await fetch(`${BASE_URL}/${version}/profile/`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to get profile');
//     }

//     return response.json();
//   },

//   getUserById: async (userId: number): Promise<any> => {
//     const token = localStorage.getItem('auth_token');

//     const response = await fetch(`${BASE_URL}/v2/user/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to get user');
//     }

//     return response.json();
//   },
// };

// // Destination API
// export const destinationAPI = {
//   getAll: async (): Promise<DestinationDTO[]> => {
//     const response = await fetch(`${BASE_URL}/destination`);

//     if (!response.ok) {
//       throw new Error('Failed to fetch destinations');
//     }

//     const result: ApiResponse<DestinationDTO[]> = await response.json();
//     return result.data;
//   },

//   getById: async (id: number): Promise<DestinationDTO> => {
//     const response = await fetch(`${BASE_URL}/destination/${id}`);

//     if (!response.ok) {
//       throw new Error('Failed to fetch destination');
//     }

//     const result: ApiResponse<DestinationDTO> = await response.json();
//     return result.data;
//   },

//   // Admin create destination (v1)
//   create: async (data: CreateDestinationRequest): Promise<any> => {
//     const token = localStorage.getItem('auth_token');
//     const formData = new FormData();

//     formData.append('name', data.name);
//     formData.append('description', data.description);
//     formData.append('price', data.price.toString());
//     formData.append('toilet', data.toilet.toString());
//     formData.append('parking', data.parking.toString());
//     formData.append('restarea', data.restarea.toString());
//     formData.append('restaurant', data.restaurant.toString());
//     formData.append('address', data.address);
//     formData.append('location', data.location);
//     formData.append('cover', data.cover);

//     // Handle multiple images
//     data.images.forEach((image, index) => {
//       formData.append('images', image);
//     });

//     const response = await fetch(`${BASE_URL}/v1/destination/`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create destination');
//     }

//     return response.json();
//   },
// };

// // Review API
// export const reviewAPI = {
//   getAll: async (): Promise<ReviewDTO[]> => {
//     const token = localStorage.getItem('auth_token');
//     // Public endpoint - no auth required for viewing reviews
//     const response = await fetch(`${BASE_URL}/v2/review`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch reviews');
//     }

//     const result: ApiResponse<ReviewDTO[]> = await response.json();
//     return result.data;
//   },

//   // Public method to get reviews without authentication (keeping for backwards compatibility)
//   getAllPublic: async (): Promise<ReviewDTO[]> => {
//     // Memanggil endpoint tanpa header 'Authorization'
//     const response = await fetch(`${BASE_URL}/review`);

//     if (!response.ok) {
//       throw new Error('Failed to fetch public reviews');
//     }

//     const result: ApiResponse<ReviewDTO[]> = await response.json();
//     return result.data;
//   },

//   create: async (data: CreateReviewRequest): Promise<any> => {
//     const token = localStorage.getItem('auth_token');

//     const response = await fetch(`${BASE_URL}/v2/review`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create review');
//     }

//     return response.json();
//   },
// };


const BASE_URL = 'http://localhost:8080';

// Dummy mode flag - set to true for testing without real server
export const DUMMY_MODE = false;

// Dummy data for testing
const dummyDestinations: DestinationDTO[] = [
  {
    destination_id: 1,
    name: 'Pantai Lovina',
    description: 'Pantai Lovina adalah pantai yang terkenal dengan lumba-lumba dan matahari terbitnya yang indah.',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop'
    ],
    toilet: 3,
    parking: 4,
    restarea: 3,
    restaurant: 4,
    price: 15000,
    rating: '4.5',
    assessment_result: '0.85',
    address: 'Jl. Seririt-Singaraja, Lovina',
    location: '-8.163029, 115.023521'
  },
  {
    destination_id: 2,
    name: 'Air Terjun Gitgit',
    description: 'Air terjun yang memiliki ketinggian sekitar 35 meter dengan pemandangan hutan tropis yang asri.',
    cover: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?w=800&h=600&fit=crop'
    ],
    toilet: 2,
    parking: 3,
    restarea: 2,
    restaurant: 3,
    price: 20000,
    rating: '4.7',
    assessment_result: '0.92',
    address: 'Gitgit, Sukasada, Buleleng',
    location: '-8.180000, 115.130000'
  },
  {
    destination_id: 3,
    name: 'Danau Beratan',
    description: 'Danau yang terletak di dataran tinggi Bedugul dengan Pura Ulun Danu yang ikonik.',
    cover: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop'
    ],
    toilet: 4,
    parking: 5,
    restarea: 4,
    restaurant: 5,
    price: 50000,
    rating: '4.8',
    assessment_result: '0.95',
    address: 'Candikuning, Baturiti, Tabanan',
    location: '-8.275000, 115.166000'
  }
];

let dummyDestinationsStore = [...dummyDestinations];

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
  user_id: number;
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

// Dummy JWT token for admin
const DUMMY_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoxLCJleHAiOjE5OTk5OTk5OTl9.dummy';
const DUMMY_USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInVzZXJuYW1lIjoidXNlciIsInJvbGUiOjIsImV4cCI6MTk5OTk5OTk5OX0.dummy';

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<any> => {
    if (DUMMY_MODE) {
      return { message: 'Registration successful', code: 200 };
    }

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
    if (DUMMY_MODE) {
      // Dummy login - admin: admin/admin123, user: user/user123
      if (data.username === 'admin' && data.password === 'admin123') {
        return {
          token: DUMMY_ADMIN_TOKEN,
          user: { username: 'admin', role: 1 }
        };
      } else if (data.username === 'user' && data.password === 'user123') {
        return {
          token: DUMMY_USER_TOKEN,
          user: { username: 'user', role: 2 }
        };
      } else {
        throw new Error('Invalid username or password');
      }
    }

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

    if (DUMMY_MODE) {
      if (token === DUMMY_ADMIN_TOKEN) {
        return {
          data: {
            user_id: 1,
            username: 'admin',
            full_name: 'Admin SPK Wisata',
            email: 'admin@spkwisata.com',
            phone: '081234567890',
            address: 'Bali, Indonesia',
            role: 1
          }
        };
      } else {
        return {
          data: {
            user_id: 2,
            username: 'user',
            full_name: 'User Wisatawan',
            email: 'user@example.com',
            phone: '081234567891',
            address: 'Jakarta, Indonesia',
            role: 2
          }
        };
      }
    }

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

    if (DUMMY_MODE) {
      return {
        data: {
          user_id: userId,
          username: 'user',
          full_name: 'User Wisatawan',
          email: 'user@example.com',
          phone: '081234567891',
          address: 'Jakarta, Indonesia',
          role: 2
        }
      };
    }

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
    if (DUMMY_MODE) {
      return dummyDestinationsStore;
    }

    const response = await fetch(`${BASE_URL}/destination`);

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const result: ApiResponse<DestinationDTO[]> = await response.json();
    return result.data;
  },

  getById: async (id: number): Promise<DestinationDTO> => {
    if (DUMMY_MODE) {
      const destination = dummyDestinationsStore.find(d => d.destination_id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return destination;
    }

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

    if (DUMMY_MODE) {
      const newId = Math.max(...dummyDestinationsStore.map(d => d.destination_id)) + 1;
      const newDestination: DestinationDTO = {
        destination_id: newId,
        name: data.name,
        description: data.description,
        cover: data.cover ? URL.createObjectURL(data.cover) : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        gallery: data.images ? data.images.map(img => URL.createObjectURL(img)) : [],
        toilet: data.toilet,
        parking: data.parking,
        restarea: data.restarea,
        restaurant: data.restaurant,
        price: data.price,
        rating: '0',
        assessment_result: '0',
        address: data.address,
        location: data.location
      };
      dummyDestinationsStore.push(newDestination);
      return { message: 'Destination created successfully', code: 201, data: newDestination };
    }

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

    if (DUMMY_MODE) {
      const index = dummyDestinationsStore.findIndex(d => d.destination_id === data.id);
      if (index !== -1) {
        dummyDestinationsStore[index] = {
          ...dummyDestinationsStore[index],
          name: data.name,
          description: data.description,
          price: data.price,
          toilet: data.toilet,
          parking: data.parking,
          restarea: data.restarea,
          restaurant: data.restaurant,
          address: data.address,
          cover: data.cover ? URL.createObjectURL(data.cover) : dummyDestinationsStore[index].cover,
          gallery: data.images ? data.images.map(img => URL.createObjectURL(img)) : dummyDestinationsStore[index].gallery
        };
      }
      return { message: 'Destination updated successfully', code: 200 };
    }

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

    if (DUMMY_MODE) {
      dummyDestinationsStore = dummyDestinationsStore.filter(d => d.destination_id !== id);
      return { message: 'Destination deleted successfully', code: 200 };
    }

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
    if (DUMMY_MODE) {
      return [];
    }

    const response = await fetch(`${BASE_URL}/review`);

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const result: ApiResponse<ReviewDTO[]> = await response.json();
    return result.data;
  },

  getAllPublic: async (): Promise<ReviewDTO[]> => {
    return reviewAPI.getAll();
  },

  create: async (data: CreateReviewRequest): Promise<any> => {
    const token = localStorage.getItem('auth_token');

    if (DUMMY_MODE) {
      return { message: 'Review created successfully', code: 201 };
    }

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
};