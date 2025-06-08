import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Crown,
  CreditCard,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../hooks/useProperties';
import { PropertyForm } from './PropertyForm';
import { supabase } from '../lib/supabase';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'properties' | 'subscription' | 'analytics'>('properties');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { properties, isLoading, refetch } = useProperties();
  
  // Filter properties owned by current user
  const userProperties = properties.filter(property => 
    property.owner.id === user?.id
  );

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingProperty(null);
  };

  const handleFormClose = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const SubscriptionCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Premium Subscription</h3>
            <p className="text-gray-600">Boost your listings to the top</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">$9.99</div>
          <div className="text-sm text-gray-500">per month</div>
        </div>
      </div>

      {user?.isSubscribed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">Active Subscription</span>
            </div>
            <span className="text-sm text-green-700">
              Expires: {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">Top</div>
              <div className="text-sm text-gray-600">Search Position</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">+45%</div>
              <div className="text-sm text-gray-600">More Views</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">Premium</div>
              <div className="text-sm text-gray-600">Badge</div>
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            Manage Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Premium Benefits</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Top placement in search results</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Premium badge on your listings</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Advanced analytics dashboard</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-medium">
            Subscribe Now - $9.99/month
          </button>
        </div>
      )}
    </div>
  );

  const AnalyticsCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Property Analytics</h3>
          <p className="text-gray-600">Track your listing performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">1,247</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">89</div>
          <div className="text-sm text-gray-600">Inquiries</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">23</div>
          <div className="text-sm text-gray-600">Bookings</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          {user?.isSubscribed 
            ? 'Detailed analytics available with your Premium subscription'
            : 'Subscribe to Premium to unlock detailed analytics and insights'
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your properties and subscription</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'properties'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'subscription'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Add New Property Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
              <button 
                onClick={() => setShowPropertyForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Properties List */}
            {!isLoading && userProperties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      {property.owner.isSubscribed && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Premium</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{property.location.city}, {property.location.country}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${property.price}</div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{property.maxGuests}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{property.rating}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(property.id)}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first property listing.</p>
                <button 
                  onClick={() => setShowPropertyForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Your First Property
                </button>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'subscription' && <SubscriptionCard />}
        {activeTab === 'analytics' && <AnalyticsCard />}
      </div>

      {/* Property Form Modal */}
      <PropertyForm
        isOpen={showPropertyForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        property={editingProperty}
      />
    </div>
  );
};