
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ApiLoginDialog from '@/components/ApiLoginDialog';
import ApiRegisterDialog from '@/components/ApiRegisterDialog';
import ApiUserPage from '@/components/ApiUserPage';
import AdminPage from '@/components/AdminPage';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import MabacPage from '@/components/MabacPage';
import { useApiAuth } from '@/hooks/useApiAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'user' | 'dashboard' | 'admin' | 'mabac'>('user');
  
  const auth = useApiAuth();

  // Helper function to check if user is admin
  const isAdmin = () => {
    // Check if role is 1 (admin) in API mode
    return auth.user?.role === 1;
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const closeDialogs = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const renderContent = () => {
    if (currentView === 'mabac' && isAdmin()) {
      return <MabacPage onBack={() => setCurrentView('dashboard')} />;
    }
    
    if (currentView === 'admin' && isAdmin()) {
      return <AdminPage />;
    }
    
    if (currentView === 'dashboard' && auth.isAuthenticated) {
      return isAdmin() ? (
        <AdminDashboard 
          onNavigateToMabac={() => setCurrentView('mabac')}
        />
      ) : (
        <UserDashboard />
      );
    }
    
    return <ApiUserPage />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
        onDashboardClick={() => setCurrentView('dashboard')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant={currentView === 'user' ? 'default' : 'outline'}
            onClick={() => setCurrentView('user')}
            className={currentView === 'user' ? 'bg-bali-gradient' : ''}
          >
            Jelajahi Wisata
          </Button>
          {auth.isAuthenticated && (
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentView('dashboard')}
              className={currentView === 'dashboard' ? 'bg-bali-gradient' : ''}
            >
              Dashboard
            </Button>
          )}
          {isAdmin() && (
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentView('admin')}
              className={currentView === 'admin' ? 'bg-bali-gradient' : ''}
            >
              Admin Panel
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

      {/* Dialogs */}
      <ApiLoginDialog
        isOpen={isLoginOpen}
        onClose={closeDialogs}
        onSwitchToRegister={switchToRegister}
      />
      <ApiRegisterDialog
        isOpen={isRegisterOpen}
        onClose={closeDialogs}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default Index;
