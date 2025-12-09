import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Store authentication status to avoid multiple function calls
  const authenticated = isAuthenticated();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6c757d' }}>Checking authentication...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user.role !== requiredRole) {
    switch (user.role) {
      case 'farmer':
        return <Navigate to="/farmer-dashboard" replace />;
      case 'merchant':
        return <Navigate to="/merchant-dashboard" replace />;
      case 'admin':
        return <Navigate to="/super-admin" replace />;
      case 'Order Admin':
        return <Navigate to="/order-admin" replace />;
      case 'Finance Admin':
        return <Navigate to="/finance-admin" replace />;
      case 'Product Admin':
        return <Navigate to="/product-admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has the required role, render the protected content
  return children;
};

export default ProtectedRoute;
