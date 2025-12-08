
import { WisataLocation, Rating } from '@/types';

export const wisataLocations: WisataLocation[] = [
  {
    id: '1',
    name: 'Pantai Lovina',
    slug: 'pantai-lovina',
    category: 'Pantai',
    shortDescription: 'Pantai dengan lumba-lumba dan air yang tenang, cocok untuk berenang dan snorkeling.',
    fullDescription: 'Pantai Lovina adalah salah satu destinasi wisata paling terkenal di Kabupaten Buleleng. Terkenal dengan atraksi lumba-lumba yang dapat dilihat di pagi hari, pantai ini menawarkan pengalaman unik bagi wisatawan. Air lautnya yang tenang menjadikannya tempat yang sempurna untuk berenang, snorkeling, dan berbagai aktivitas air lainnya.',
    address: 'Kalibukbuk, Buleleng, Kabupaten Buleleng',
    latitude: -8.1569,
    longitude: 115.0261,
    mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
    ],
    openingHours: '24 Jam',
    ticketPrice: 15000,
    facilities: ['Parkir', 'Toilet', 'Warung Makan', 'Penyewaan Perahu'],
    status: 'published',
    createdAt: '2024-01-01',
    averageRating: 4.5,
    totalReviews: 128,
    mabacScore: 0.85
  },
  {
    id: '2',
    name: 'Air Terjun Sekumpul',
    slug: 'air-terjun-sekumpul',
    category: 'Air Terjun',
    shortDescription: 'Air terjun tertinggi di Bali dengan tujuh tingkatan yang memukau.',
    fullDescription: 'Air Terjun Sekumpul adalah salah satu air terjun terindah dan tertinggi di Bali. Dengan ketinggian mencapai 80 meter, air terjun ini terdiri dari tujuh tingkatan yang menciptakan pemandangan yang sangat memukau. Dikelilingi oleh hutan tropis yang lebat, lokasi ini menawarkan pengalaman alam yang autentik dan menyegarkan.',
    address: 'Sekumpul, Sawan, Kabupaten Buleleng',
    latitude: -8.2024,
    longitude: 115.1878,
    mainImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop'
    ],
    openingHours: '06.00 - 18.00 WITA',
    ticketPrice: 20000,
    facilities: ['Parkir', 'Toilet', 'Gazebo', 'Jalur Trekking'],
    status: 'published',
    createdAt: '2024-01-02',
    averageRating: 4.8,
    totalReviews: 95,
    mabacScore: 0.92
  },
  {
    id: '3',
    name: 'Pura Ulun Danu Beratan',
    slug: 'pura-ulun-danu-beratan',
    category: 'Pura',
    shortDescription: 'Pura ikonik di tepi Danau Beratan dengan arsitektur tradisional Bali.',
    fullDescription: 'Pura Ulun Danu Beratan adalah salah satu pura paling ikonik di Bali. Terletak di tepi Danau Beratan, pura ini menawarkan pemandangan yang sangat indah dengan latar belakang gunung dan danau. Arsitektur tradisional Bali yang megah berpadu dengan keindahan alam sekitar menciptakan suasana yang sangat spiritual dan damai.',
    address: 'Candikuning, Baturiti, Tabanan (perbatasan Buleleng)',
    latitude: -8.2755,
    longitude: 115.1669,
    mainImage: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop'
    ],
    openingHours: '07.00 - 19.00 WITA',
    ticketPrice: 30000,
    facilities: ['Parkir', 'Toilet', 'Toko Souvenir', 'Warung Makan'],
    status: 'published',
    createdAt: '2024-01-03',
    averageRating: 4.7,
    totalReviews: 156,
    mabacScore: 0.88
  },
  {
    id: '4',
    name: 'Danau Tamblingan',
    slug: 'danau-tamblingan',
    category: 'Danau',
    shortDescription: 'Danau kawah dengan suasana mistis dan pemandangan alam yang menakjubkan.',
    fullDescription: 'Danau Tamblingan adalah danau kawah yang terletak di ketinggian 1.200 meter di atas permukaan laut. Dikelilingi oleh hutan hujan tropis yang masih asri, danau ini menawarkan suasana yang sangat tenang dan mistis. Air danaunya yang jernih memantulkan pemandangan hutan dan langit, menciptakan panorama yang sangat indah.',
    address: 'Munduk, Banjar, Kabupaten Buleleng',
    latitude: -8.2547,
    longitude: 115.1123,
    mainImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop'
    ],
    openingHours: '06.00 - 18.00 WITA',
    ticketPrice: 25000,
    facilities: ['Parkir', 'Toilet', 'Gazebo', 'Jalur Trekking', 'Kanoe'],
    status: 'published',
    createdAt: '2024-01-04',
    averageRating: 4.6,
    totalReviews: 78,
    mabacScore: 0.81
  }
];

export const ratingsData: Rating[] = [
  {
    id: '1',
    userId: '2',
    locationId: '1',
    rating: 5,
    review: 'Pantai yang sangat indah! Lumba-lumba benar-benar muncul di pagi hari. Pengalaman yang tak terlupakan.',
    createdAt: '2024-01-15',
    userName: 'Wisatawan Demo'
  },
  {
    id: '2',
    userId: '2',
    locationId: '2',
    rating: 5,
    review: 'Air terjun yang menakjubkan! Trekking agak menantang tapi pemandangannya sangat worth it.',
    createdAt: '2024-01-16',
    userName: 'Wisatawan Demo'
  }
];
