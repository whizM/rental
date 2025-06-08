import React, { useState, useMemo } from 'react';
import { PropertyCard } from './PropertyCard';
import { SearchFilters } from './SearchFilters';
import { PropertyDetail } from './PropertyDetail';
import { useProperties } from '../hooks/useProperties';
import { Property, SearchFilters as SearchFiltersType } from '../types';
import { Search, Filter, MapPin } from 'lucide-react';

interface HomePageProps {
  onSearchClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearchClick }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    location: '',
    propertyType: '',
    minPrice: 0,
    maxPrice: 1000,
    bedrooms: 0,
    maxGuests: 1
  });
  const [showFilters, setShowFilters] = useState(false);

  const { properties, isLoading, error } = useProperties(filters);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetail(true);
  };

  const handleSearch = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleOpenFilters = () => {
    setShowFilters(true);
    onSearchClick();
  };

  const hasActiveFilters = filters.location || filters.propertyType || filters.minPrice > 0 || 
                          filters.maxPrice < 1000 || filters.bedrooms > 0 || filters.maxGuests > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Getaway
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover unique properties worldwide with direct owner contact and no booking fees
            </p>
            
            {/* Quick Search */}
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleOpenFilters}
                className="w-full bg-white/95 backdrop-blur-sm text-gray-700 rounded-2xl p-4 sm:p-6 shadow-xl hover:bg-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-200">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Where do you want to go?</p>
                      <p className="text-sm text-gray-600">Search by location, property type, and more</p>
                    </div>
                  </div>
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isLoading ? 'Loading Properties...' : 
               properties.length === 0 && hasActiveFilters ? 'No Properties Found' :
               hasActiveFilters ? `${properties.length} Properties Found` : 'Explore Properties'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Please wait while we fetch the latest properties' :
               properties.length === 0 && hasActiveFilters ? 'Try adjusting your search criteria' :
               hasActiveFilters ? 'Showing results for your search criteria' :
               'Discover amazing places to stay around the world'}
            </p>
          </div>
          
          <button
            onClick={handleOpenFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Active Filters:</span>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  {filters.location && <span className="bg-blue-100 px-2 py-1 rounded">{filters.location}</span>}
                  {filters.propertyType && <span className="bg-blue-100 px-2 py-1 rounded capitalize">{filters.propertyType}</span>}
                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <span className="bg-blue-100 px-2 py-1 rounded">${filters.minPrice} - ${filters.maxPrice}</span>
                  )}
                  {filters.bedrooms > 0 && <span className="bg-blue-100 px-2 py-1 rounded">{filters.bedrooms}+ beds</span>}
                  {filters.maxGuests > 1 && <span className="bg-blue-100 px-2 py-1 rounded">{filters.maxGuests}+ guests</span>}
                </div>
              </div>
              <button
                onClick={() => setFilters({
                  location: '',
                  propertyType: '',
                  minPrice: 0,
                  maxPrice: 1000,
                  bedrooms: 0,
                  maxGuests: 1
                })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-48 sm:h-64 bg-gray-200"></div>
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading properties</h3>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria to find more results.</p>
            <button
              onClick={() => setFilters({
                location: '',
                propertyType: '',
                minPrice: 0,
                maxPrice: 1000,
                bedrooms: 0,
                maxGuests: 1
              })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Search Filters Modal */}
      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onSearch={handleSearch}
      />

      {/* Property Detail Modal */}
      <PropertyDetail
        property={selectedProperty}
        isOpen={showPropertyDetail}
        onClose={() => setShowPropertyDetail(false)}
      />
    </div>
  );
};