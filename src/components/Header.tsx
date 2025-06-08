import React, { useState } from 'react';
import { Search, Menu, X, User, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSearchClick?: () => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handlePageChange = (page: string) => {
    onPageChange?.(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handlePageChange('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              REVOA
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handlePageChange('home')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'home' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Explore
            </button>
            {user?.role === 'owner' && (
              <button
                onClick={() => handlePageChange('dashboard')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'dashboard' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Dashboard
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => handlePageChange('admin')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'admin' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {currentPage === 'home' && (
              <button
                onClick={onSearchClick}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Search properties</span>
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    {user.role === 'owner' && (
                      <button
                        onClick={() => {
                          handlePageChange('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        handlePageChange('home');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handlePageChange('auth')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={() => handlePageChange('home')}
              className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Explore
            </button>
            {user?.role === 'owner' && (
              <button
                onClick={() => handlePageChange('dashboard')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Dashboard
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => handlePageChange('admin')}
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Admin
              </button>
            )}
            {currentPage === 'home' && (
              <button
                onClick={onSearchClick}
                className="flex items-center space-x-2 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Search properties</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};