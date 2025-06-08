import { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Stunning modern apartment in the heart of downtown with panoramic city views. Features contemporary furnishings, full kitchen, and premium amenities.',
    price: 120,
    location: {
      city: 'New York',
      country: 'USA',
      address: '123 Main St, Manhattan, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'
    ],
    type: 'apartment',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Gym'],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    owner: {
      id: 'owner1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      isSubscribed: true
    },
    rating: 4.8,
    reviewCount: 127,
    isAvailable: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Cozy Beach Villa',
    description: 'Escape to this beautiful beachfront villa with private beach access. Perfect for romantic getaways or family vacations.',
    price: 280,
    location: {
      city: 'Malibu',
      country: 'USA',
      address: '456 Ocean Drive, Malibu, CA 90265',
      coordinates: { lat: 34.0259, lng: -118.7798 }
    },
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg'
    ],
    type: 'villa',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Parking', 'Hot Tub'],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    owner: {
      id: 'owner2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 987-6543',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      isSubscribed: true
    },
    rating: 4.9,
    reviewCount: 89,
    isAvailable: true,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Historic City Center Loft',
    description: 'Unique loft in a converted historic building with exposed brick walls, high ceilings, and modern amenities in the city center.',
    price: 95,
    location: {
      city: 'Boston',
      country: 'USA',
      address: '789 Historic Ave, Boston, MA 02101',
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
    ],
    type: 'loft',
    amenities: ['WiFi', 'Kitchen', 'Laundry', 'Historic Building'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    owner: {
      id: 'owner3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      isSubscribed: false
    },
    rating: 4.6,
    reviewCount: 54,
    isAvailable: true,
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Mountain Cabin Retreat',
    description: 'Peaceful mountain cabin surrounded by nature. Perfect for hiking enthusiasts and those seeking tranquility.',
    price: 150,
    location: {
      city: 'Aspen',
      country: 'USA',
      address: '321 Mountain View Rd, Aspen, CO 81611',
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    images: [
      'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg'
    ],
    type: 'house',
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Mountain View'],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    owner: {
      id: 'owner4',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg',
      isSubscribed: true
    },
    rating: 4.7,
    reviewCount: 92,
    isAvailable: true,
    createdAt: '2024-01-05'
  }
];