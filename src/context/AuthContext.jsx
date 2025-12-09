import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    try {
      const savedUser = localStorage.getItem('user');
      const savedAdmin = localStorage.getItem('currentAdmin');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else if (savedAdmin) {
        // Handle admin authentication
        const parsedAdmin = JSON.parse(savedAdmin);
        setUser(parsedAdmin);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('currentAdmin');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    
    // If it's an admin user, store in both user and currentAdmin
    if (userData.role === 'Order Admin' || userData.role === 'Finance Admin' || userData.role === 'Product Admin' || userData.role === 'admin') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('currentAdmin', JSON.stringify(userData));
    } else {
      // Regular user (farmer, merchant)
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentAdmin');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  const isFarmer = () => {
    return user?.role === 'farmer';
  };

  const isMerchant = () => {
    return user?.role === 'merchant';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isOrderAdmin = () => {
    return user?.role === 'Order Admin';
  };

  const isFinanceAdmin = () => {
    return user?.role === 'Finance Admin';
  };

  const isProductAdmin = () => {
    return user?.role === 'Product Admin';
  };

  const isFarmerVerified = () => {
    if (user?.role !== 'farmer') return false;
    
    try {
      // Check if farmer has been verified
      const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      const farmerRequest = verificationRequests.find(req => req.farmerId === user.id);
      
      return farmerRequest?.status === 'approved';
    } catch (error) {
      console.error('Error checking farmer verification:', error);
      return false;
    }
  };

  const isFarmerPending = () => {
    if (user?.role !== 'farmer') return false;
    
    try {
      const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      const farmerRequest = verificationRequests.find(req => req.farmerId === user.id);
      
      return farmerRequest?.status === 'pending';
    } catch (error) {
      console.error('Error checking farmer pending status:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    isFarmer,
    isMerchant,
    isAdmin,
    isOrderAdmin,
    isFinanceAdmin,
    isProductAdmin,
    isFarmerVerified,
    isFarmerPending,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
