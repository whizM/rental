export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  type: 'apartment' | 'house' | 'villa' | 'studio' | 'loft';
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    isSubscribed: boolean;
  };
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'guest' | 'owner' | 'admin';
  phone?: string;
  isSubscribed?: boolean;
  subscriptionExpiry?: string;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  maxGuests: number;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price_per_night: number;
  property_type: 'apartment' | 'house' | 'villa' | 'studio' | 'loft';
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  current_period_start?: string;
  current_period_end?: string;
  stripe_subscription_id?: string;
}