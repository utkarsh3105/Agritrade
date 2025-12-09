import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MerchantProvider, useMerchant } from './MerchantContext';
const Overview = lazy(() => import('./Overview'));
const Analytics = lazy(() => import('./Analytics'));
const Marketplace = lazy(() => import('./Marketplace'));
const MyOrders = lazy(() => import('./MyOrders'));
const ShoppingCart = lazy(() => import('./ShoppingCart'));
const Sidebar = lazy(() => import('./Sidebar'));
const MerchantProfile = lazy(() => import('./MerchantProfile'));
const ProductSampling = lazy(() => import('./ProductSampling'));

// Notification Component
const NotificationToast = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{zIndex: 9999}}>
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`alert alert-${notification.type === 'success' ? 'success' : notification.type === 'error' ? 'danger' : 'info'} alert-dismissible fade show mb-2`}
          style={{minWidth: '300px'}}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
const MerchantDashboardContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [merchantId, setMerchantId] = useState('');
  
  const {
    activeTab,
    isCartOpen,
    isSidebarOpen,
    notifications,
    navigateToTab,
    openCart,
    closeCart,
    toggleSidebar,
    getCartItemCount,
    quickActions
  } = useMerchant();

  useEffect(() => {
    // Extract softpro from the URL path
    const pathSegments = location.pathname.split('/');
    const softproIndex = pathSegments.indexOf('softpro');
    if (softproIndex !== -1) {
      setMerchantId('softpro');
    }
  }, [location]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const handleSidebarMenuClick = (menuItem) => {
    switch (menuItem) {
      case 'profile':
        navigateToTab('profile');
        break;
      case 'cart':
        openCart();
        break;
      case 'analytics':
        navigateToTab('analytics');
        break;
      case 'sampling':
        navigateToTab('sampling');
        break;
      default:
        break;
    }
  };

  return (
    <div className="merchant-admin-dashboard">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid">
          {/* Left Side - Menu and Title */}
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-link p-0 me-3" 
              style={{fontSize: '18px', color: '#6c757d'}}
              onClick={toggleSidebar}
            >
              <i className="bi bi-list"></i>
            </button>
            <span className="navbar-brand mb-0 h1 fw-bold" style={{color: '#2c3e50'}}>
              Merchant Dashboard
            </span>
          </div>

          {/* Center - Navigation Tabs */}
          <div className="navbar-nav flex-row mx-auto">
            <div className="nav-item me-4">
              <button 
                className={`nav-link btn btn-link p-2 px-3 d-flex align-items-center ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => navigateToTab('overview')}
                style={{
                  backgroundColor: activeTab === 'overview' ? '#e3f2fd' : 'transparent',
                  color: activeTab === 'overview' ? '#1976d2' : '#6c757d',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-house me-2"></i>
                Overview
              </button>
            </div>
            <div className="nav-item me-4">
              <button 
                className={`nav-link btn btn-link p-2 px-3 d-flex align-items-center ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => navigateToTab('analytics')}
                style={{
                  backgroundColor: activeTab === 'analytics' ? '#e3f2fd' : 'transparent',
                  color: activeTab === 'analytics' ? '#1976d2' : '#6c757d',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-bar-chart me-2"></i>
                Analytics
              </button>
            </div>
            <div className="nav-item me-4">
              <button 
                className={`nav-link btn btn-link p-2 px-3 d-flex align-items-center ${activeTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => navigateToTab('marketplace')}
                style={{
                  backgroundColor: activeTab === 'marketplace' ? '#e3f2fd' : 'transparent',
                  color: activeTab === 'marketplace' ? '#1976d2' : '#6c757d',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-shop me-2"></i>
                Marketplace
              </button>
            </div>
            <div className="nav-item me-4">
              <button 
                className={`nav-link btn btn-link p-2 px-3 d-flex align-items-center ${activeTab === 'sampling' ? 'active' : ''}`}
                onClick={() => navigateToTab('sampling')}
                style={{
                  backgroundColor: activeTab === 'sampling' ? '#e3f2fd' : 'transparent',
                  color: activeTab === 'sampling' ? '#1976d2' : '#6c757d',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-gift me-2"></i>
                Product Sampling
              </button>
            </div>
            <div className="nav-item">
              <button 
                className={`nav-link btn btn-link p-2 px-3 d-flex align-items-center ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => navigateToTab('orders')}
                style={{
                  backgroundColor: activeTab === 'orders' ? '#e3f2fd' : 'transparent',
                  color: activeTab === 'orders' ? '#1976d2' : '#6c757d',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-bag me-2"></i>
                My Orders
              </button>
            </div>
          </div>

          {/* Right Side - Welcome Message and Logout */}
          <div className="d-flex align-items-center">
            <span className="me-3" style={{color: '#6c757d', fontWeight: '500'}}>
              Welcome, Merchant {merchantId || user?.firstName || 'tanmay'}!
            </span>
            <button 
              className="btn btn-link me-3 p-0 position-relative" 
              style={{fontSize: '18px', color: '#6c757d'}}
              onClick={openCart}
            >
              <i className="bi bi-cart"></i>
              {getCartItemCount() > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{fontSize: '10px'}}
                >
                  {getCartItemCount()}
                </span>
              )}
            </button>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm"
              style={{fontWeight: '500'}}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container-fluid p-4">
        <Suspense fallback={<div className="text-center py-5"><div className="spinner-border text-primary" role="status"/><p className="mt-2 text-muted">Loading...</p></div>}>
          {activeTab === 'overview' && <Overview merchantId={merchantId} />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'marketplace' && <Marketplace />}
          {activeTab === 'orders' && <MyOrders />}
          {activeTab === 'profile' && <MerchantProfile />}
          {activeTab === 'sampling' && <ProductSampling />}
        </Suspense>
      </div>

      {/* Sidebar */}
      <Suspense>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={toggleSidebar}
          onMenuClick={handleSidebarMenuClick}
        />
      </Suspense>

      {/* Shopping Cart Sidebar */}
      <Suspense>
        <ShoppingCart 
          isOpen={isCartOpen} 
          onClose={closeCart} 
        />
      </Suspense>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{zIndex: 1040}}
          onClick={closeCart}
        ></div>
      )}

      {/* Notifications */}
      <NotificationToast notifications={notifications} />
    </div>
  );
};

// Main Export with Provider
const MerchantAdminDashboard = () => {
  return (
    <MerchantProvider>
      <MerchantDashboardContent />
    </MerchantProvider>
  );
};

export default MerchantAdminDashboard;
