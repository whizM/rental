import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, DollarSign, Home, Users, Bed, Bath, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PropertyFormData } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property?: any; // For editing existing properties
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  property 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [availableAmenities, setAvailableAmenities] = useState<any[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price_per_night: 0,
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    address: '',
    city: '',
    country: '',
    latitude: undefined,
    longitude: undefined,
    amenities: [],
    images: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchAmenities();
      if (property) {
        // Populate form with existing property data
        setFormData({
          title: property.title,
          description: property.description,
          price_per_night: property.price,
          property_type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          max_guests: property.maxGuests,
          address: property.location.address,
          city: property.location.city,
          country: property.location.country,
          latitude: property.location.coordinates.lat,
          longitude: property.location.coordinates.lng,
          amenities: property.amenities,
          images: property.images
        });
      }
    }
  }, [isOpen, property]);

  const fetchAmenities = async () => {
    const { data } = await supabase
      .from('amenities')
      .select('*')
      .order('name');
    
    if (data) {
      setAvailableAmenities(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      let propertyId = property?.id;

      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update({
            title: formData.title,
            description: formData.description,
            price_per_night: formData.price_per_night,
            property_type: formData.property_type,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            max_guests: formData.max_guests,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            latitude: formData.latitude,
            longitude: formData.longitude,
            updated_at: new Date().toISOString()
          })
          .eq('id', property.id);

        if (error) throw error;
      } else {
        // Create new property
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert({
            owner_id: user.id,
            title: formData.title,
            description: formData.description,
            price_per_night: formData.price_per_night,
            property_type: formData.property_type,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            max_guests: formData.max_guests,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            latitude: formData.latitude,
            longitude: formData.longitude
          })
          .select()
          .single();

        if (error) throw error;
        propertyId = newProperty.id;
      }

      // Handle images
      if (propertyId) {
        // Delete existing images if updating
        if (property) {
          await supabase
            .from('property_images')
            .delete()
            .eq('property_id', propertyId);
        }

        // Insert new images
        if (formData.images.length > 0) {
          const imageInserts = formData.images.map((url, index) => ({
            property_id: propertyId,
            image_url: url,
            is_primary: index === 0,
            display_order: index + 1
          }));

          const { error: imageError } = await supabase
            .from('property_images')
            .insert(imageInserts);

          if (imageError) throw imageError;
        }

        // Handle amenities
        // Delete existing amenities if updating
        if (property) {
          await supabase
            .from('property_amenities')
            .delete()
            .eq('property_id', propertyId);
        }

        // Insert new amenities
        if (formData.amenities.length > 0) {
          const { data: amenityData } = await supabase
            .from('amenities')
            .select('id, name')
            .in('name', formData.amenities);

          if (amenityData) {
            const amenityInserts = amenityData.map(amenity => ({
              property_id: propertyId,
              amenity_id: amenity.id
            }));

            const { error: amenityError } = await supabase
              .from('property_amenities')
              .insert(amenityInserts);

            if (amenityError) throw amenityError;
          }
        }
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price_per_night: 0,
      property_type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 2,
      address: '',
      city: '',
      country: '',
      latitude: undefined,
      longitude: undefined,
      amenities: [],
      images: []
    });
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (amenityName: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter property title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your property"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price per Night
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price_per_night}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property Type
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="loft">Loft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="w-4 h-4 inline mr-1" />
                  Bedrooms
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bath className="w-4 h-4 inline mr-1" />
                  Bathrooms
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Maximum Guests
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.max_guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_guests: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Property Images
                </h3>
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.amenities.includes(amenity.name)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};