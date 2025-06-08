import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Crown
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  if (!isOpen || !property) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Air Conditioning': () => <div className="w-4 h-4 bg-blue-500 rounded-full" />,
    'Kitchen': () => <div className="w-4 h-4 bg-orange-500 rounded-sm" />,
    'Pool': () => <div className="w-4 h-4 bg-blue-400 rounded-full" />,
    'Gym': () => <div className="w-4 h-4 bg-red-500 rounded-sm" />,
    'Beach Access': () => <div className="w-4 h-4 bg-yellow-400 rounded-full" />,
    'Hot Tub': () => <div className="w-4 h-4 bg-purple-500 rounded-full" />,
    'Fireplace': () => <div className="w-4 h-4 bg-orange-600 rounded-sm" />,
    'Mountain View': () => <div className="w-4 h-4 bg-green-500 rounded-full" />,
    'Laundry': () => <div className="w-4 h-4 bg-gray-500 rounded-sm" />,
    'Historic Building': () => <div className="w-4 h-4 bg-amber-600 rounded-sm" />
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
              {property.owner.isSubscribed && (
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Image Gallery */}
          <div className="relative">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-64 sm:h-96 object-cover"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-semibold shadow-sm">
              ${property.price}/night
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Location and Rating */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{property.location.city}, {property.location.country}</p>
                  <p className="text-sm text-gray-600">{property.location.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{property.rating}</span>
                </div>
                <span className="text-gray-600">({property.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Bed className="w-5 h-5 text-gray-400" />
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="w-5 h-5 text-gray-400" />
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span>Up to {property.maxGuests} guests</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || (() => <div className="w-4 h-4 bg-gray-400 rounded" />);
                  return (
                    <div key={amenity} className="flex items-center space-x-2 text-gray-700">
                      <IconComponent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Information */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Host</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={property.owner.avatar}
                  alt={property.owner.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{property.owner.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">Property Owner</p>
                  
                  {!showContactForm ? (
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Contact Host
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{property.owner.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{property.owner.email}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Contact the host directly to inquire about availability and booking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};