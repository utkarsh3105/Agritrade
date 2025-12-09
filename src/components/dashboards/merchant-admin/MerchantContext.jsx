import React, { createContext, useContext, useState, useEffect } from 'react';

const MerchantContext = createContext();

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
};

export const MerchantProvider = ({ children }) => {
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@agri.com',
    phone: '+91 98765 43210',
    address: '123 Farm Road, Agriculture City, Maharashtra 400001',
    businessName: 'Kumar Agro Supplies',
    businessType: 'Agricultural Supplies',
    gstNumber: '27ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    bankAccount: 'HDFC Bank - 1234567890',
    ifscCode: 'HDFC0001234',
    verification: 'Verified',
    memberSince: '15 March 2023',
    accountType: 'Premium Merchant',
    totalSales: '₹12,45,000',
    totalOrders: '1,234',
    rating: '4.8'
  });

  // Orders Data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      product: 'Fresh Tomatoes',
      quantity: '50',
      price: '$45.00',
      status: 'Completed',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      product: 'Organic Carrots',
      quantity: '30',
      price: '$32.50',
      status: 'Pending',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      product: 'Fresh Lettuce',
      quantity: '25',
      price: '$28.75',
      status: 'Completed',
      date: '2024-01-13'
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('merchantCart');
    const savedProfile = localStorage.getItem('merchantProfile');
    const savedOrders = localStorage.getItem('merchantOrders');

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save to localStorage whenever data changes
  // Debounced localStorage save for cart
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem('merchantCart', JSON.stringify(cartItems));
    }, 300);
    return () => clearTimeout(id);
  }, [cartItems]);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem('merchantProfile', JSON.stringify(profileData));
    }, 300);
    return () => clearTimeout(id);
  }, [profileData]);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem('merchantOrders', JSON.stringify(orders));
    }, 300);
    return () => clearTimeout(id);
  }, [orders]);

  // Cart Functions
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const cartItem = {
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      };
      setCartItems([...cartItems, cartItem]);
    }
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    showNotification('Item removed from cart', 'info');
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    const target = cartItems.find(i => i.id === itemId);
    // Samples are fixed at quantity 1
    if (target?.isSample) {
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('Cart cleared', 'info');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.currentPrice.replace('₹', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Navigation Functions
  const navigateToTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
    setIsSidebarOpen(false);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Profile Functions
  const updateProfile = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
    showNotification('Profile updated successfully!', 'success');
  };

  // Order Functions
  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...orderData
    };
    setOrders([newOrder, ...orders]);
    showNotification('Order placed successfully!', 'success');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showNotification(`Order ${orderId} status updated to ${newStatus}`, 'info');
  };

  // Notification System
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5

    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  // Quick Actions
  const quickActions = {
    viewAnalytics: () => navigateToTab('analytics'),
    manageProducts: () => navigateToTab('marketplace'),
    viewOrders: () => navigateToTab('orders'),
    paymentHistory: () => showNotification('Payment History feature coming soon!', 'info'),
    securitySettings: () => showNotification('Security Settings feature coming soon!', 'info'),
    productSampling: () => navigateToTab('sampling')
  };

  const value = {
    // State
    cartItems,
    isCartOpen,
    activeTab,
    isSidebarOpen,
    profileData,
    orders,
    notifications,

    // Cart Functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,

    // Navigation Functions
    navigateToTab,
    openCart,
    closeCart,
    toggleSidebar,
    setActiveTab,
    setIsCartOpen,
    setIsSidebarOpen,

    // Profile Functions
    updateProfile,

    // Order Functions
    addOrder,
    updateOrderStatus,

    // Utility Functions
    showNotification,
    quickActions
  };

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  );
};
