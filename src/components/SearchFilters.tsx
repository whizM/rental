import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Users, Bed, X } from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFiltersType) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ isOpen, onClose, onSearch }) => {
  const [filters, setFilters] = useState<SearchFiltersType>({
    location: '',
    propertyType: '',
    minPrice: 0,
    maxPrice: 1000,
    bedrooms: 0,
    maxGuests: 1
  });

  const propertyTypes = [
    { value: '', label: 'Any Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'loft', label: 'Loft' }
  ];

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      location: '',
      propertyType: '',
      minPrice: 0,
      maxPrice: 1000,
      bedrooms: 0,
      maxGuests: 1
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter city, country, or address"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Home className="w-4 h-4 inline mr-2" />
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Price Range (per night)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  placeholder="Min price"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  placeholder="Max price"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              ${filters.minPrice} - ${filters.maxPrice}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Bed className="w-4 h-4 inline mr-2" />
              Bedrooms
            </label>
            <div className="flex items-center space-x-3">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setFilters({ ...filters, bedrooms: num })}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    filters.bedrooms === num
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {num === 0 ? 'Any' : num === 5 ? '5+' : num}
                </button>
              ))}
            </div>
          </div>

          {/* Max Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              Maximum Guests
            </label>
            <div className="flex items-center space-x-3">
              {[1, 2, 4, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setFilters({ ...filters, maxGuests: num })}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    filters.maxGuests === num
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {num === 10 ? '10+' : num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleReset}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Reset Filters
          </button>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};