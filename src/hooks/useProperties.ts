import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property, SearchFilters } from '../types';

export const useProperties = (filters?: SearchFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_owner_id_fkey (
            id,
            name,
            email,
            phone,
            avatar_url
          ),
          property_images (
            image_url,
            is_primary,
            display_order
          ),
          property_amenities (
            amenities (
              name
            )
          ),
          subscriptions!profiles_subscriptions_user_id_fkey (
            status
          )
        `)
        .eq('is_available', true);

      // Apply filters
      if (filters?.location) {
        query = query.or(`city.ilike.%${filters.location}%,country.ilike.%${filters.location}%`);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.minPrice > 0) {
        query = query.gte('price_per_night', filters.minPrice);
      }
      if (filters?.maxPrice < 1000) {
        query = query.lte('price_per_night', filters.maxPrice);
      }
      if (filters?.bedrooms > 0) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters?.maxGuests > 1) {
        query = query.gte('max_guests', filters.maxGuests);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match Property interface
      const transformedProperties: Property[] = data?.map((property: any) => ({
        id: property.id,
        title: property.title,
        description: property.description,
        price: property.price_per_night,
        location: {
          city: property.city,
          country: property.country,
          address: property.address,
          coordinates: {
            lat: property.latitude || 0,
            lng: property.longitude || 0
          }
        },
        images: property.property_images
          ?.sort((a: any, b: any) => a.display_order - b.display_order)
          ?.map((img: any) => img.image_url) || [],
        type: property.property_type,
        amenities: property.property_amenities?.map((pa: any) => pa.amenities.name) || [],
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        maxGuests: property.max_guests,
        owner: {
          id: property.profiles.id,
          name: property.profiles.name,
          email: property.profiles.email,
          phone: property.profiles.phone || '',
          avatar: property.profiles.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
          isSubscribed: property.subscriptions?.[0]?.status === 'active'
        },
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        reviewCount: Math.floor(Math.random() * 200) + 10, // Mock review count
        isAvailable: property.is_available,
        createdAt: property.created_at
      })) || [];

      // Sort properties: premium first, then by creation date
      transformedProperties.sort((a, b) => {
        if (a.owner.isSubscribed && !b.owner.isSubscribed) return -1;
        if (!a.owner.isSubscribed && b.owner.isSubscribed) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setProperties(transformedProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { properties, isLoading, error, refetch: fetchProperties };
};