import React from 'react';
import { Star, MapPin, Users, Bed, Bath, Crown } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Premium Badge */}
        {property.owner.isSubscribed && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm">
            <Crown className="w-3 h-3" />
            <span>Premium</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
          ${property.price}/night
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {property.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {property.location.city}, {property.location.country}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4 text-gray-400" />
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4 text-gray-400" />
            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{property.maxGuests} guests</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {property.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({property.reviewCount} reviews)
            </span>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${property.price}
            </div>
            <div className="text-xs text-gray-500">per night</div>
          </div>
        </div>
      </div>
    </div>
  );
};