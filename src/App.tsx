import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const { user } = useAuth();

  const handlePageChange = (page: string) => {
    if (page === 'auth') {
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSearchClick = () => {
    setShowSearchFilters(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user?.role === 'owner' ? <OwnerDashboard /> : <HomePage onSearchClick={handleSearchClick} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <HomePage onSearchClick={handleSearchClick} />;
      default:
        return <HomePage onSearchClick={handleSearchClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearchClick={handleSearchClick}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {renderCurrentPage()}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;