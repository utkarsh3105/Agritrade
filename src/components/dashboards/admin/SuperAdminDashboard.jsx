import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../../common/Notification';

const ADMIN_TYPES = [
  { key: 'super', label: 'Super Admin', color: 'primary' },
  { key: 'product', label: 'Product Admin', color: 'success' },
  { key: 'farmer', label: 'Farmer Admin', color: 'success' },
  { key: 'order', label: 'Order Admin', color: 'warning' },
  { key: 'finance', label: 'Finance Admin', color: 'secondary' },
];

const SUPER_ADMIN_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'farmers', label: 'Farmers' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'finance', label: 'Finance' },
  { key: 'admins', label: 'Admins' },
  { key: 'settings', label: 'Settings' },
];

const PRODUCT_ADMIN_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'products', label: 'Product Management' },
  { key: 'stats', label: 'Basic Stats' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'settings', label: 'Settings' },
];

const FARMER_ADMIN_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'approval', label: 'Approval' },
  { key: 'list', label: 'Farmer List' },
  { key: 'management', label: 'Management' },
  { key: 'users', label: 'All Users' },
  { key: 'support', label: 'Support' },
];

const ORDER_ADMIN_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'All Orders' },
  { key: 'delivery', label: 'Delivery Assignment' },
  { key: 'tracking', label: 'Shipment Tracking' },
];

const FINANCE_ADMIN_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'transactions', label: 'Transaction History' },
  { key: 'reports', label: 'Finance Reports' },
  { key: 'commission', label: 'Commission Management' },
];

// Icon map for product types (removed icons, so empty object)
const PRODUCT_TYPE_ICONS = {
  Wheat: '',
  Rice: '',
  Corn: '',
  Oats: '',
  Barley: '',
  Millet: '',
  Other: '',
};


const getIconForType = (type) => PRODUCT_TYPE_ICONS[type] ;

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);

// Role guide: header and description for each admin type
const ROLE_GUIDE = {
  super: [
    { header: 'Overview', description: 'High-level metrics across the platform.' },
    { header: 'Farmers', description: 'Approve and manage farmer profiles.' },
    { header: 'Products', description: 'Add, edit, and manage products.' },
    { header: 'Orders', description: 'Monitor and manage orders and shipments.' },
    { header: 'Finance', description: 'Revenue, commission, and financial reports.' },
    { header: 'Admins', description: 'Manage admin users and permissions.' },
    { header: 'Settings', description: 'Platform configuration and profile settings.' },
  ],
  farmer: [
    { header: 'Overview Cards', description: 'Totals for farmers: Approved, Pending, Rejected.' },
    { header: 'Farmer Approval Table', description: 'Approve or reject pending farmers.' },
    { header: 'Farmer List', description: 'Browse and manage all farmers.' },
    { header: 'Management', description: 'Comprehensive farmer management: add, edit, remove accounts.' },
    { header: 'All Users', description: 'Manage all platform users including farmers, regular users, and admins.' },
    { header: 'Support', description: 'Help, FAQs, and contact support.' },
  ],
  product: [
    { header: 'Overview', description: 'Key product metrics and trends.' },
    { header: 'Product Management', description: 'Full CRUD on products with filters.' },
    { header: 'Basic Stats', description: 'Category-wise stats and quick insights.' },
    { header: 'Analytics', description: 'Sales performance and growth analytics.' },
    { header: 'Settings', description: 'Profile and product-related preferences.' },
  ],
  order: [
    { header: 'Overview', description: 'Order KPIs at a glance.' },
    { header: 'All Orders', description: 'Search, filter, and manage orders.' },
    { header: 'Delivery Assignment', description: 'Assign deliveries to agents.' },
    { header: 'Shipment Tracking', description: 'Track shipments in real-time.' },
  ],
  finance: [
    { header: 'Overview', description: 'Revenue and commission KPIs.' },
    { header: 'Transaction History', description: 'View and export transactions.' },
    { header: 'Finance Reports', description: 'Generate financial reports.' },
    { header: 'Commission Management', description: 'Manage category commission rates.' },
  ],
};

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAdminType, setActiveAdminType] = useState('super');
  const [activeSection, setActiveSection] = useState('overview');
  const [activeProductSection, setActiveProductSection] = useState('overview');
  const [activeOrderSection, setActiveOrderSection] = useState('overview');
  const [activeFinanceSection, setActiveFinanceSection] = useState('overview');
  const [productFilters, setProductFilters] = useState({});
  const [activeFarmerSection, setActiveFarmerSection] = useState('overview');
  
  // Notification and verification states
  const [notifications, setNotifications] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);

  // Product Admin Settings state
  const [profileFirstName, setProfileFirstName] = useState(user?.firstName || '');
  const [profileLastName, setProfileLastName] = useState(user?.lastName || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);

  useEffect(() => {
    setProfileFirstName(user?.firstName || '');
    setProfileLastName(user?.lastName || '');
    setProfileEmail(user?.email || '');
    setProfileAvatar(user?.avatar || '');
  }, [user]);

  // Load notifications and verification requests
  useEffect(() => {
    const loadNotifications = () => {
      const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      setNotifications(adminNotifications);
    };

    // Load existing admin users from localStorage
    const loadExistingAdmins = () => {
      const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      if (storedAdmins.length > 0) {
        setAdmins(storedAdmins);
      }
    };

    // Ensure tanmay pss softpro account exists in localStorage
    ensureTanmayAccount();
    
    // Ensure default admin accounts exist
    ensureDefaultAdminAccounts();
    
    loadNotifications();
    loadVerificationRequests();
    loadExistingAdmins();

    // Set up real-time updates
    const interval = setInterval(() => {
      // Only update if there are actual changes
      const currentRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      const currentNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      
      // Use functional updates to avoid dependency issues
      setVerificationRequests(prevRequests => {
        if (JSON.stringify(currentRequests) !== JSON.stringify(prevRequests)) {
          return currentRequests;
        }
        return prevRequests;
      });
      
      setNotifications(prevNotifications => {
        if (JSON.stringify(currentNotifications) !== JSON.stringify(prevNotifications)) {
          return currentNotifications;
        }
        return prevNotifications;
      });
    }, 10000); // Check every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once

  // Function to load verification requests (moved outside useEffect for accessibility)
  const loadVerificationRequests = () => {
    const requests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');

    setVerificationRequests(requests);
    
    if (requests.length > 0) {
      // Update farmers state with real verification request data
      const realFarmers = requests.map(request => {
        // Handle different possible data structures
        const farmer = {
          id: request.farmerId || request.id,
          name: request.farmerName || request.name || 'Unknown Farmer',
          status: request.status === 'approved' ? 'Approved' : request.status === 'rejected' ? 'Rejected' : 'Pending',
          location: request.village || request.location || 'Not specified',
          products: request.products ? (typeof request.products === 'string' ? request.products.split(',').length : request.products) : 0,
          email: request.farmerEmail || request.email || 'No email',
          phone: request.phone || 'Not specified',
          verificationData: request
        };

        return farmer;
      });
      

      setFarmers(realFarmers);
    } else {
      // If no verification requests, check if there are any existing farmers in localStorage
      const existingFarmers = JSON.parse(localStorage.getItem('existingFarmers') || '[]');
      if (existingFarmers.length > 0) {

        setFarmers(existingFarmers);
      } else {
        // Use default farmers data as fallback

        const defaultFarmers = [
          { id: 1, name: 'Jyeshtha Saini', status: 'Approved', location: 'Bihar', products: 12, email: 'jyeshtha@example.com', phone: '+91-78906-98978' },
          { id: 2, name: 'Mukul Raj', status: 'Pending', location: 'Mau', products: 8, email: 'mukul@example.com', phone: '+91-67895-66578' },
          { id: 3, name: 'Jeevan Singh', status: 'Approved', location: 'Loni', products: 15, email: 'jeevan@example.com', phone: '+91-70118-89876' },
          { id: 4, name: 'Brijesh Yadav', status: 'Rejected', location: 'Rasra', products: 5, email: 'brijesh@example.com', phone: '+91-93134-67845' },
        ];
        setFarmers(defaultFarmers);
      }
    }
    
    // Check for any manually added farmers (like tanmay pss softpro)
    const manualFarmers = JSON.parse(localStorage.getItem('manualFarmers') || '[]');
    if (manualFarmers.length > 0) {

      setFarmers(prev => {
        const combined = [...prev];
        manualFarmers.forEach(manualFarmer => {
          if (!combined.find(f => f.id === manualFarmer.id)) {
            combined.push(manualFarmer);
          }
        });
        return combined;
      });
    }
    
    // Ensure tanmay pss softpro account is always visible
    const tanmayAccount = {
      id: 999, // Use a unique ID
      name: 'tanmay pss softpro',
      status: 'Approved',
      location: 'Not specified',
      products: 0,
      email: 'tanmay@example.com',
      phone: 'Not specified',
      verificationData: null
    };
    
    setFarmers(prev => {
      if (!prev.find(f => f.name === 'tanmay pss softpro')) {

        return [...prev, tanmayAccount];
      }
      return prev;
    });
  };

  // Function to ensure tanmay pss softpro account exists in localStorage
  const ensureTanmayAccount = () => {
    const manualFarmers = JSON.parse(localStorage.getItem('manualFarmers') || '[]');
    const tanmayExists = manualFarmers.find(f => f.name === 'tanmay pss softpro');
    
    if (!tanmayExists) {
      const tanmayAccount = {
        id: 999,
        name: 'tanmay pss softpro',
        status: 'Approved',
        location: 'Not specified',
        products: 0,
        email: 'tanmay@example.com',
        phone: 'Not specified',
        verificationData: null
      };
      
      manualFarmers.push(tanmayAccount);
      localStorage.setItem('manualFarmers', JSON.stringify(manualFarmers));
  
    }
    
    // Also ensure there's a verification request for tanmay
    const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
    const tanmayRequestExists = verificationRequests.find(req => req.farmerId === 999);
    
    if (!tanmayRequestExists) {
      const tanmayVerificationRequest = {
        farmerId: 999,
        farmerName: 'tanmay pss softpro',
        farmerEmail: 'tanmay@example.com',
        village: 'Not specified',
        products: '',
        phone: 'Not specified',
        status: 'approved',
        timestamp: new Date().toISOString()
      };
      
      verificationRequests.push(tanmayVerificationRequest);
      localStorage.setItem('verificationRequests', JSON.stringify(verificationRequests));
  
    }
  };

  // Function to ensure default admin accounts exist
  const ensureDefaultAdminAccounts = () => {
    const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    
    // Check if Prince (Order Admin) exists
    const princeExists = storedAdmins.find(admin => admin.username === 'Prince');
    if (!princeExists) {
      const princeAdmin = {
        id: 1001,
        username: 'Prince',
        firstName: 'Prince',
        lastName: 'Singh',
        email: 'prince@agritrade.com',
        role: 'Order Admin',
        status: 'Active',
        permissions: {
          canManageProducts: false,
          canManageFarmers: false,
          canManageOrders: true,
          canManageFinance: false,
          canViewReports: true,
          canManageUsers: false
        },
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null
      };
      
      storedAdmins.push(princeAdmin);
      localStorage.setItem('adminUsers', JSON.stringify(storedAdmins));
      
      // Store credentials
      adminCredentials['Prince'] = {
        password: 'softpro',
        role: 'Order Admin'
      };
      localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
      
      console.log('Created default Order Admin account: Prince/softpro');
    }
    
    // Check if default Super Admin exists
    const superAdminExists = storedAdmins.find(admin => admin.username === 'admin');
    if (!superAdminExists) {
      const superAdmin = {
        id: 1000,
        username: 'admin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@agritrade.com',
        role: 'admin',
        status: 'Active',
        permissions: {
          canManageProducts: true,
          canManageFarmers: true,
          canManageOrders: true,
          canManageFinance: true,
          canViewReports: true,
          canManageUsers: true
        },
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null
      };
      
      storedAdmins.push(superAdmin);
      localStorage.setItem('adminUsers', JSON.stringify(storedAdmins));
      
      // Store credentials
      adminCredentials['admin'] = {
        password: 'admin123',
        role: 'admin'
      };
      localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
      
      console.log('Created default Super Admin account: admin/admin123');
    }
  };

  // Mock data for demonstration
  const [overviewData, setOverviewData] = useState({
    totalFarmers: 0, // Will be updated with real verification request count
    totalMerchants: 89,
    totalProducts: 342,
    totalOrders: 1247,
    totalRevenue: 45678.90
  });

  // Update overview data when verification requests change
  useEffect(() => {
    setOverviewData(prev => ({
      ...prev,
      totalFarmers: verificationRequests.length
    }));
  }, [verificationRequests]);

  const [productOverviewData] = useState({
    totalProducts: 342,
    activeProducts: 298,
    lowStockProducts: 15,
    totalCategories: 8,
    totalRevenue: 23456.78,
    monthlyGrowth: 12.5
  });

  const [farmers, setFarmers] = useState([]); // Start with empty array, will be populated by useEffect
  const [farmerFilters, setFarmerFilters] = useState({});
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [supportFarmerId, setSupportFarmerId] = useState(null);
  
  // Remove account functionality state
  const [farmerToRemove, setFarmerToRemove] = useState(null);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, name: 'Wheat', type: 'Wheat', category: 'Seeds', price: 25.99, stock: 150, status: 'Active', sales: 45 },
    { id: 2, name: 'Rice', type: 'Rice', category: 'Seeds', price: 28.50, stock: 0, status: 'Inactive', sales: 12 },
    { id: 3, name: 'Corn', type: 'Corn', category: 'Seeds', price: 30.00, stock: 200, status: 'Active', sales: 67 },
    { id: 4, name: 'Organic Fertilizer', type: 'Other', category: 'Fertilizer', price: 45.50, stock: 75, status: 'Active', sales: 32 },
    { id: 5, name: 'Garden Tools Set', type: 'Other', category: 'Tools', price: 89.99, stock: 25, status: 'Active', sales: 18 },
  ]);

  // Add Product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductType, setNewProductType] = useState('Wheat');
  const [newProductCategory, setNewProductCategory] = useState('Seeds');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductStatus, setNewProductStatus] = useState('Active');

  // Edit Product state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('Wheat');
  const [editCategory, setEditCategory] = useState('Seeds');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  // Summary by product type: totals, active, out-of-stock
  const productTypeSummary = useMemo(() => {
    const summary = {};
    for (const product of products) {
      const type = product.type || 'Other';
      if (!summary[type]) {
        summary[type] = { total: 0, active: 0, outOfStock: 0 };
      }
      summary[type].total += 1;
      if (product.status === 'Active') summary[type].active += 1;
      if (!product.stock || product.stock <= 0) summary[type].outOfStock += 1;
    }
    return summary;
  }, [products]);

  // Filtered products per active filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matches = true;
      if (productFilters.status) {
        matches = matches && product.status === productFilters.status;
      }
      if (productFilters.lowStock) {
        matches = matches && product.stock < 10;
      }
      if (productFilters.type) {
        matches = matches && (product.type || 'Other') === productFilters.type;
      }
      return matches;
    });
  }, [products, productFilters]);

  // Navigation helpers from overview cards
  const openProductsWithFilter = (filter = {}) => {
    setActiveAdminType('product');
    setActiveProductSection('products');
    setProductFilters(filter);
  };
  const openStats = () => {
    setActiveAdminType('product');
    setActiveProductSection('stats');
  };
  const openAnalytics = () => {
    setActiveAdminType('product');
    setActiveProductSection('analytics');
  };
  const clearProductFilters = () => setProductFilters({});
      const approveFarmer = (id) => {
    
    // Update local state
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, status: 'Approved' } : f));
    
    // Update verification requests
    const updatedRequests = verificationRequests.map(req => 
      req.farmerId === id ? { ...req, status: 'approved' } : req
    );
    setVerificationRequests(updatedRequests);
    localStorage.setItem('verificationRequests', JSON.stringify(updatedRequests));
    
    // Also update the farmers state to ensure the approved farmer remains visible
    setFarmers(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, status: 'Approved' } : f);
      return updated;
    });
    
    // Add notification for farmer
    const farmer = farmers.find(f => f.id === id);
    const farmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const notification = {
      id: Date.now(),
      type: 'approval',
      title: 'Verification Approved!',
      message: 'Your farmer verification has been approved. You can now access the farmer dashboard.',
      timestamp: new Date().toISOString(),
      read: false,
      farmerId: id
    };
    farmerNotifications.push(notification);
    localStorage.setItem('farmerNotifications', JSON.stringify(farmerNotifications));
    
    // Remove from admin notifications
    const updatedAdminNotifications = notifications.filter(n => 
      !(n.type === 'farmer_verification' && n.farmerId === id)
    );
    setNotifications(updatedAdminNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedAdminNotifications));
    

  };

  const rejectFarmer = (id) => {
    
    // Update local state
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, status: 'Rejected' } : f));
    
    // Update verification requests
    const updatedRequests = verificationRequests.map(req => 
      req.farmerId === id ? { ...req, status: 'rejected' } : req
    );

    setVerificationRequests(updatedRequests);
    localStorage.setItem('verificationRequests', JSON.stringify(updatedRequests));
    
    // Also update the farmers state to ensure the rejected farmer remains visible
    setFarmers(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, status: 'Rejected' } : f);
      return updated;
    });
    
    // Add notification for farmer
    const farmer = farmers.find(f => f.id === id);
    const farmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const notification = {
      id: Date.now(),
      type: 'rejection',
      title: 'Verification Rejected',
      message: 'Your farmer verification has been rejected. Please contact admin for more information.',
      timestamp: new Date().toISOString(),
      read: false,
      farmerId: id
    };
    farmerNotifications.push(notification);
    localStorage.setItem('farmerNotifications', JSON.stringify(farmerNotifications));
    
    // Remove from admin notifications
    const updatedAdminNotifications = notifications.filter(n => 
      !(n.type === 'farmer_verification' && n.farmerId === id)
    );
    setNotifications(updatedAdminNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedAdminNotifications));
    

  };

  const removeFarmerAccount = (id) => {
    
    // Remove from local state
    setFarmers(prev => prev.filter(f => f.id !== id));
    
    // Remove from verification requests
    const updatedRequests = verificationRequests.filter(req => req.farmerId !== id);

    setVerificationRequests(updatedRequests);
    localStorage.setItem('verificationRequests', JSON.stringify(updatedRequests));
    
    // Remove from admin notifications
    const updatedAdminNotifications = notifications.filter(n => 
      !(n.type === 'farmer_verification' && n.farmerId === id)
    );
    setNotifications(updatedAdminNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedAdminNotifications));
    
    // Remove from farmer notifications
    const farmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const updatedFarmerNotifications = farmerNotifications.filter(n => n.farmerId !== id);
    localStorage.setItem('farmerNotifications', JSON.stringify(updatedFarmerNotifications));
    
    // Close confirmation modal
    setShowRemoveConfirmation(false);
    setFarmerToRemove(null);
    
    // Show success message
    alert('Farmer account has been successfully removed.');
    

  };

  const farmerOverviewData = useMemo(() => {
    const total = verificationRequests.length;
    const approved = verificationRequests.filter(req => req.status === 'approved').length;
    const pending = verificationRequests.filter(req => req.status === 'pending').length;
    const rejected = verificationRequests.filter(req => req.status === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [verificationRequests]);

  const filteredFarmers = useMemo(() => {
    if (!farmerFilters.status) return farmers;
    return farmers.filter(f => f.status === farmerFilters.status);
  }, [farmers, farmerFilters]);

  const openFarmerListWithFilter = (status) => {
    setActiveAdminType('farmer');
    setActiveFarmerSection('list');
    setFarmerFilters(status ? { status } : {});
  };
  const openFarmerApproval = () => {
    setActiveAdminType('farmer');
    setActiveFarmerSection('approval');
  };
  const clearFarmerFilters = () => setFarmerFilters({});

  const openFarmerProfile = (farmer) => setSelectedFarmer(farmer);
  const closeFarmerProfile = () => setSelectedFarmer(null);
  const copyFarmerProfileLink = (farmer) => {
    const url = `${window.location.origin}/farmers/${farmer.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => alert('Profile link copied')).catch(() => alert(url));
    } else {
      alert(url);
    }
  };

  const openRemoveConfirmation = (farmer) => {
    setFarmerToRemove(farmer);
    setShowRemoveConfirmation(true);
  };

  const closeRemoveConfirmation = () => {
    setShowRemoveConfirmation(false);
    setFarmerToRemove(null);
  };

  // Product type options
  const productTypeOptions = Object.keys(PRODUCT_TYPE_ICONS);

  // --- Product Management operations ---
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(newProductPrice);
    const stock = parseInt(newProductStock, 10);
    if (!newProductName || !Number.isFinite(price) || !Number.isFinite(stock)) {
      alert('Please provide valid name, price and stock.');
      return;
    }
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const productToAdd = {
      id: nextId,
      name: newProductName,
      type: newProductType || 'Other',
      category: newProductCategory,
      price,
      stock,
      status: newProductStatus,
      sales: 0,
    };
    setProducts([productToAdd, ...products]);
    // reset form
    setNewProductName('');
    setNewProductType('Wheat');
    setNewProductCategory('Seeds');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductStatus('Active');
    // focus back to name
    setTimeout(() => document.getElementById('add-product-name')?.focus(), 0);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditType(product.type || 'Other');
    setEditCategory(product.category);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditStatus(product.status);
  };

  const handleSaveEdit = () => {
    const price = parseFloat(editPrice);
    const stock = parseInt(editStock, 10);
    if (!editName || !Number.isFinite(price) || !Number.isFinite(stock)) {
      alert('Please provide valid name, price and stock.');
      return;
    }
    setProducts(products.map((p) =>
      p.id === editingProductId
        ? { ...p, name: editName, type: editType || 'Other', category: editCategory, price, stock, status: editStatus }
        : p
    ));
    setEditingProductId(null);
  };

  const handleCancelEdit = () => setEditingProductId(null);

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // --- Product Admin Settings actions ---
  const { login } = useAuth();

  const handleSaveProfile = (e) => {
    e?.preventDefault?.();
    if (!profileFirstName || !profileLastName || !profileEmail) {
      alert('Please complete name and email.');
      return;
    }
    const updatedUser = {
      ...(user || {}),
      firstName: profileFirstName,
      lastName: profileLastName,
      email: profileEmail,
      avatar: profileAvatar,
    };
    login(updatedUser);
    alert('Profile updated');
  };

  const handleChangePassword = (e) => {
    e?.preventDefault?.();
    if (!newPassword || !confirmPassword) {
      alert('Enter and confirm the new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Demo-only: no backend. Just simulate success.
    setNewPassword('');
    setConfirmPassword('');
    alert('Password changed successfully');
  };

  const handleAvatarFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfileAvatar(dataUrl);
      // Persist to user profile immediately for demo
      const updatedUser = { ...(user || {}), avatar: dataUrl };
      login(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePreferences = () => {
    alert(`Preferences saved. Two-Factor Auth: ${enableTwoFactor ? 'Enabled' : 'Disabled'}`);
  };

  const handleResetProfileForm = () => {
    setProfileFirstName(user?.firstName || '');
    setProfileLastName(user?.lastName || '');
    setProfileEmail(user?.email || '');
    setProfileAvatar(user?.avatar || '');
    setNewPassword('');
    setConfirmPassword('');
    setEnableTwoFactor(false);
  };

  const [orders] = useState([
    { id: 1, customer: 'Farmer John', product: 'Wheat Seeds', amount: 259.90, status: 'Delivered', deliveryDate: '2024-01-15', assignedTo: 'John Driver' },
    { id: 2, customer: 'Mary Johnson', product: 'Organic Fertilizer', amount: 227.50, status: 'Processing', deliveryDate: '2024-01-18', assignedTo: 'Unassigned' },
    { id: 3, customer: 'David Wilson', product: 'Corn Seeds', amount: 600.00, status: 'Shipped', deliveryDate: '2024-01-20', assignedTo: 'Sarah Driver' },
    { id: 4, customer: 'Robert Brown', product: 'Garden Tools Set', amount: 179.98, status: 'Pending', deliveryDate: '2024-01-22', assignedTo: 'Unassigned' },
    { id: 5, customer: 'Lisa Davis', product: 'Pesticide Spray', amount: 77.50, status: 'In Transit', deliveryDate: '2024-01-19', assignedTo: 'Mike Driver' },
  ]);

  const [deliveryAgents] = useState([
    { id: 1, name: 'John Driver', phone: '+1-555-0101', status: 'Available', currentLocation: 'Kansas City' },
    { id: 2, name: 'Sarah Driver', phone: '+1-555-0102', status: 'On Delivery', currentLocation: 'Des Moines' },
    { id: 3, name: 'Mike Driver', phone: '+1-555-0103', status: 'Available', currentLocation: 'Omaha' },
    { id: 4, name: 'Emma Driver', phone: '+1-555-0104', status: 'Off Duty', currentLocation: 'St. Louis' },
  ]);

  const [orderOverviewData] = useState({
    totalOrders: 1247,
    pendingOrders: 89,
    processingOrders: 156,
    shippedOrders: 234,
    deliveredOrders: 768,
    totalRevenue: 45678.90,
    averageDeliveryTime: 3.2
  });

  const [transactions] = useState([
    { id: 1, type: 'Commission', amount: 25.99, date: '2024-01-15', status: 'Completed', orderId: 'ORD-001', customer: 'Farmer John' },
    { id: 2, type: 'Commission', amount: 22.75, date: '2024-01-14', status: 'Completed', orderId: 'ORD-002', customer: 'Mary Johnson' },
    { id: 3, type: 'Commission', amount: 60.00, date: '2024-01-13', status: 'Completed', orderId: 'ORD-003', customer: 'David Wilson' },
    { id: 4, type: 'Commission', amount: 18.00, date: '2024-01-12', status: 'Completed', orderId: 'ORD-004', customer: 'Robert Brown' },
    { id: 5, type: 'Commission', amount: 7.75, date: '2024-01-11', status: 'Completed', orderId: 'ORD-005', customer: 'Lisa Davis' },
    { id: 6, type: 'Commission', amount: 45.50, date: '2024-01-10', status: 'Pending', orderId: 'ORD-006', customer: 'Mike Smith' },
  ]);

  const [financeOverviewData] = useState({
    totalRevenue: 45678.90,
    totalCommission: 4567.89,
    pendingCommission: 234.50,
    monthlyGrowth: 15.2,
    totalTransactions: 1247,
    averageOrderValue: 36.67
  });

  const [commissionRates] = useState([
    { category: 'Seeds', rate: 10, minOrder: 50, maxCommission: 100 },
    { category: 'Fertilizer', rate: 8, minOrder: 75, maxCommission: 150 },
    { category: 'Tools', rate: 12, minOrder: 100, maxCommission: 200 },
    { category: 'Chemicals', rate: 15, minOrder: 25, maxCommission: 75 },
  ]);

  const [admins, setAdmins] = useState([
  { 
    id: 1, 
    username: 'superadmin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@agri.com', 
    role: 'Super Admin', 
    status: 'Active',
    permissions: {
      canManageProducts: true,
      canManageFarmers: true,
      canManageOrders: true,
      canManageFinance: true,
      canViewReports: true,
      canManageUsers: true
    },
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  },
  { 
    id: 2, 
    username: 'productadmin',
    firstName: 'Product',
    lastName: 'Admin',
    email: 'product@agri.com', 
    role: 'Product Admin', 
    status: 'Active',
    permissions: {
      canManageProducts: true,
      canManageFarmers: false,
      canManageOrders: false,
      canManageFinance: false,
      canViewReports: true,
      canManageUsers: false
    },
    createdAt: '2024-01-02',
    lastLogin: '2024-01-14'
  },
]);

// Add new state for admin management
const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
const [showEditAdminModal, setShowEditAdminModal] = useState(false);
const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
const [selectedAdminForEdit, setSelectedAdminForEdit] = useState(null);
const [selectedAdminForPasswordReset, setSelectedAdminForPasswordReset] = useState(null);

// Admin creation form state
const [newAdminData, setNewAdminData] = useState({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'Product Admin',
  password: '',
  confirmPassword: '',
  permissions: {
    canManageProducts: true,
    canManageFarmers: false,
    canManageOrders: false,
    canManageFinance: false,
    canViewReports: true,
    canManageUsers: false
  }
});

// Admin edit form state
const [editAdminData, setEditAdminData] = useState({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  status: 'Active',
  permissions: {}
});

// Password reset state for admin management
const [resetPassword, setResetPassword] = useState('');
const [confirmResetPassword, setConfirmResetPassword] = useState('');

  const [productStats] = useState([
    { category: 'Seeds', totalProducts: 156, totalSales: 2340, avgPrice: 28.50 },
    { category: 'Fertilizer', totalProducts: 89, totalSales: 1890, avgPrice: 42.75 },
    { category: 'Tools', totalProducts: 67, totalSales: 1234, avgPrice: 65.25 },
    { category: 'Chemicals', totalProducts: 30, totalSales: 567, avgPrice: 18.90 },
  ]);

  // Admin type navigation handler
  const handleAdminTypeChange = (key) => {
    setActiveAdminType(key);
    if (key !== 'super') {
      setActiveSection('overview');
      setActiveProductSection('overview');
      setActiveFarmerSection('overview');
    }
  };

  // Section navigation handler
  const handleSectionChange = (key) => setActiveSection(key);

  // Product section navigation handler
  const handleProductSectionChange = (key) => setActiveProductSection(key);
  const handleFarmerSectionChange = (key) => setActiveFarmerSection(key);

  // Order section navigation handler
  const handleOrderSectionChange = (key) => setActiveOrderSection(key);

  // Finance section navigation handler
  const handleFinanceSectionChange = (key) => setActiveFinanceSection(key);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  // Admin Management Functions
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAdminData.username || !newAdminData.email || !newAdminData.password || !newAdminData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (newAdminData.password !== newAdminData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (newAdminData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Check if username or email already exists
    const existingAdmin = admins.find(admin => 
      admin.username === newAdminData.username || admin.email === newAdminData.email
    );
    
    if (existingAdmin) {
      alert('Username or email already exists');
      return;
    }
    
    // Create new admin
    const newAdmin = {
      id: Math.max(...admins.map(a => a.id)) + 1,
      username: newAdminData.username,
      firstName: newAdminData.firstName,
      lastName: newAdminData.lastName,
      email: newAdminData.email,
      role: newAdminData.role,
      status: 'Active',
      permissions: newAdminData.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null
    };
    
    // Add to admins list
    setAdmins([...admins, newAdmin]);
    
    // Store in localStorage for persistence
    const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    storedAdmins.push(newAdmin);
    localStorage.setItem('adminUsers', JSON.stringify(storedAdmins));
    
    // Store credentials separately (in real app, this would be hashed)
    const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    adminCredentials[newAdmin.username] = {
      password: newAdminData.password,
      role: newAdmin.role
    };
    localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    
    // Reset form and close modal
    setNewAdminData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'Product Admin',
      password: '',
      confirmPassword: '',
      permissions: {
        canManageProducts: true,
        canManageFarmers: false,
        canManageOrders: false,
        canManageFinance: false,
        canViewReports: true,
        canManageUsers: false
      }
    });
    setShowCreateAdminModal(false);
    
    alert(`Admin account created successfully!\nUsername: ${newAdmin.username}\nPassword: ${newAdminData.password}\n\nPlease share these credentials with the new admin.`);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdminForEdit(admin);
    setEditAdminData({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      status: admin.status,
      permissions: { ...admin.permissions }
    });
    setShowEditAdminModal(true);
  };

  const handleSaveEditAdmin = () => {
    if (!editAdminData.username || !editAdminData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Update admin in list
    const updatedAdmins = admins.map(admin => 
      admin.id === selectedAdminForEdit.id 
        ? { ...admin, ...editAdminData }
        : admin
    );
    
    setAdmins(updatedAdmins);
    
    // Update in localStorage
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    
    // Close modal
    setShowEditAdminModal(false);
    setSelectedAdminForEdit(null);
    
    alert('Admin updated successfully!');
  };

  const handlePasswordReset = (admin) => {
    setSelectedAdminForPasswordReset(admin);
    setResetPassword('');
    setConfirmResetPassword('');
    setShowPasswordResetModal(true);
  };

  const handleSavePasswordReset = () => {
    if (!resetPassword || !confirmResetPassword) {
      alert('Please fill in both password fields');
      return;
    }
    
    if (resetPassword !== confirmResetPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (resetPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Update password in credentials storage
    const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    if (adminCredentials[selectedAdminForPasswordReset.username]) {
      adminCredentials[selectedAdminForPasswordReset.username].password = resetPassword;
      localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
      
      // Close modal
      setShowPasswordResetModal(false);
      setSelectedAdminForPasswordReset(null);
      
      alert(`Password reset successfully!\nNew password: ${resetPassword}\n\nPlease share this new password with ${selectedAdminForPasswordReset.firstName} ${selectedAdminForPasswordReset.lastName}.`);
    } else {
      alert('Admin credentials not found');
    }
  };

  const handleDeleteAdmin = (adminId) => {
    if (adminId === 1) {
      alert('Cannot delete the Super Admin account');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      const updatedAdmins = admins.filter(admin => admin.id !== adminId);
      setAdmins(updatedAdmins);
      
      // Update in localStorage
      localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
      
      // Remove credentials
      const adminToDelete = admins.find(admin => admin.id === adminId);
      if (adminToDelete) {
        const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
        delete adminCredentials[adminToDelete.username];
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
      }
      
      alert('Admin account deleted successfully');
    }
  };

  const handleToggleAdminStatus = (adminId) => {
    if (adminId === 1) {
      alert('Cannot deactivate the Super Admin account');
      return;
    }
    
    const currentAdmin = admins.find(a => a.id === adminId);
    const newStatus = currentAdmin.status === 'Active' ? 'Inactive' : 'Active';
    
    const updatedAdmins = admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: newStatus }
        : admin
    );
    
    setAdmins(updatedAdmins);
    
    // Update in localStorage
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    
    alert(`Admin ${currentAdmin.firstName} ${currentAdmin.lastName} status changed to ${newStatus}`);
  };

  const resetNewAdminForm = () => {
    setNewAdminData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'Product Admin',
      password: '',
      confirmPassword: '',
      permissions: {
        canManageProducts: true,
        canManageFarmers: false,
        canManageOrders: false,
        canManageFinance: false,
        canViewReports: true,
        canManageUsers: false
      }
    });
  };



  // Render Overview Cards
  const renderOverviewCards = () => (
    <div className="row">
      <div className="col-md-2 mb-3">
        <div className="card bg-primary text-white">
          <div className="card-body text-center">
            <h3>{overviewData.totalFarmers}</h3>
            <p className="mb-0">Total Farmers</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-success text-white">
          <div className="card-body text-center">
            <h3>{overviewData.totalMerchants}</h3>
            <p className="mb-0">Total Merchants</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-info text-white">
          <div className="card-body text-center">
            <h3>{overviewData.totalProducts}</h3>
            <p className="mb-0">Total Products</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-warning text-white">
          <div className="card-body text-center">
            <h3>{overviewData.totalOrders}</h3>
            <p className="mb-0">Total Orders</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-danger text-white">
          <div className="card-body text-center">
            <h3>${overviewData.totalRevenue.toLocaleString()}</h3>
            <p className="mb-0">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Product Admin Overview Cards
  const renderProductOverviewCards = () => (
    <div>
    <div className="row ">
      <div className="col-md-2 mb-3">
          <div className="card bg-success text-white" role="button" tabIndex={0} onClick={() => openProductsWithFilter({})} style={{ cursor: 'pointer' }}>
          <div className="card-body text-center">
            <h3>{productOverviewData.totalProducts}</h3>
            <p className="mb-0">Total Products</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
          <div className="card bg-primary text-white" role="button" tabIndex={0} onClick={() => openProductsWithFilter({ status: 'Active' })} style={{ cursor: 'pointer' }}>
          <div className="card-body text-center">
            <h3>{productOverviewData.activeProducts}</h3>
            <p className="mb-0">Active Products</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
          <div className="card bg-warning text-white" role="button" tabIndex={0} onClick={() => openProductsWithFilter({ lowStock: true })} style={{ cursor: 'pointer' }}>
          <div className="card-body text-center">
            <h3>{productOverviewData.lowStockProducts}</h3>
            <p className="mb-0">Low Stock</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
          <div className="card bg-info text-white" role="button" tabIndex={0} onClick={openStats} style={{ cursor: 'pointer' }}>
          <div className="card-body text-center">
            <h3>{productOverviewData.totalCategories}</h3>
            <p className="mb-0">Categories</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
          <div className="card bg-danger text-white" role="button" tabIndex={0} onClick={openAnalytics} style={{ cursor: 'pointer' }}>
          <div className="card-body text-center">
              <h3>{formatINR(productOverviewData.totalRevenue)}</h3>
            <p className="mb-0">Total Revenue</p>
            <small>+{productOverviewData.monthlyGrowth}% this month</small>
          </div>
          </div>
        </div>
      </div>

      {/* Per-product-type summary */}
      <div className="mt-3">
        <h6>By Product Type</h6>
        <div className="row">
          {Object.entries(productTypeSummary).map(([type, stats]) => (
            <div className="col-md-3 mb-3" key={type}>
              <div className="card" role="button" tabIndex={0} onClick={() => openProductsWithFilter({ type })} style={{ cursor: 'pointer' }}>
                <div className="card-body text-center">
                  <div style={{ fontSize: '2rem' }}>{getIconForType(type)}</div>
                  <h6 className="mt-2 mb-2">{type}</h6>
                  <div className="d-flex justify-content-around">
                    <div>
                      <strong>{stats.total}</strong>
                      <div className="text-muted small">Total</div>
                    </div>
                    <div>
                      <strong className="text-success">{stats.active}</strong>
                      <div className="text-muted small">Active</div>
                    </div>
                    <div>
                      <strong className="text-danger">{stats.outOfStock}</strong>
                      <div className="text-muted small">Out</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Product Management
  const renderProductManagement = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Product Management</h5>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2">Add Product</button>
          <button className="btn btn-primary">View All Products</button>
        </div>
      </div>
      
      {Object.keys(productFilters).length > 0 && (
        <div className="mb-3">
          <span className="me-2">Active Filters:</span>
          {productFilters.status && (
            <span className="badge bg-primary me-2">Status: {productFilters.status}</span>
          )}
          {productFilters.lowStock && (
            <span className="badge bg-warning text-dark me-2">Low Stock</span>
          )}
          {productFilters.type && (
            <span className="badge bg-info text-dark me-2">Type: {productFilters.type}</span>
          )}
          <button className="btn btn-sm btn-outline-secondary ms-2" onClick={clearProductFilters}>Clear</button>
        </div>
      )}
      
      {/* Add Product Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h6>Add New Product</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddProductSubmit}>
            <div className="row">
              <div className="col-md-3">
                <input id="add-product-name" type="text" className="form-control" placeholder="Product Name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
              </div>
              <div className="col-md-2">
                <select className="form-select" value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}>
                  <option>Seeds</option>
                  <option>Fertilizer</option>
                  <option>Tools</option>
                  <option>Chemicals</option>
                </select>
              </div>
              <div className="col-md-2">
                <input type="number" className="form-control" placeholder="Price (₹)" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} />
              </div>
              <div className="col-md-2">
                <input type="number" className="form-control" placeholder="Stock" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} />
              </div>
              <div className="col-md-2">
                <select className="form-select" value={newProductStatus} onChange={(e) => setNewProductStatus(e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="col-md-1">
                <select className="form-select" value={newProductType} onChange={(e) => setNewProductType(e.target.value)}>
                  {productTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-success w-100">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{editingProductId === product.id ? (
                  <input className="form-control form-control-sm" value={editName} onChange={(e) => setEditName(e.target.value)} />
                ) : (
                  product.name
                )}</td>
                <td>{editingProductId === product.id ? (
                  <select className="form-select form-select-sm" value={editType} onChange={(e) => setEditType(e.target.value)}>
                    {productTypeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  product.type || 'Other'
                )}</td>
                <td>{editingProductId === product.id ? (
                  <select className="form-select form-select-sm" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                    <option>Seeds</option>
                    <option>Fertilizer</option>
                    <option>Tools</option>
                    <option>Chemicals</option>
                  </select>
                ) : (
                  product.category
                )}</td>
                <td>{editingProductId === product.id ? (
                  <input type="number" className="form-control form-control-sm" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                ) : (
                  formatINR(product.price)
                )}</td>
                <td>{editingProductId === product.id ? (
                  <input type="number" className="form-control form-control-sm" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
                ) : (
                  <span className={product.stock < 10 ? 'text-danger fw-bold' : ''}>{product.stock}</span>
                )}</td>
                <td>{product.sales}</td>
                <td>{editingProductId === product.id ? (
                  <select className="form-select form-select-sm" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                ) : (
                  <span className={`badge ${product.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {product.status}
                  </span>
                )}</td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={handleSaveEdit}>Save</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-primary me-1" onClick={() => handleEditClick(product)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Product Admin Settings (profile settings)
  const renderProductSettings = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Profile Settings</h5>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h6>Update Profile</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-success">Update Profile</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleResetProfileForm}>Reset</button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h6>Change Password</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-primary" onClick={handleChangePassword}>Change Password</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h6>Avatar</h6>
            </div>
            <div className="card-body text-center">
              {profileAvatar ? (
                <img src={profileAvatar} alt="avatar" className="rounded-circle mb-3" style={{ width: 100, height: 100, objectFit: 'cover' }} />
              ) : (
                <div className="rounded-circle bg-light mb-3 d-flex align-items-center justify-content-center" style={{ width: 100, height: 100 }}>
                  <span className="text-muted">No Photo</span>
                </div>
              )}
              <div>
                <label className="btn btn-outline-primary mb-0">
                  Upload New
                  <input type="file" accept="image/*" hidden onChange={(e) => handleAvatarFile(e.target.files?.[0])} />
                </label>
                {profileAvatar && (
                  <button className="btn btn-outline-danger ms-2" onClick={() => { setProfileAvatar(''); login({ ...(user || {}), avatar: '' }); }}>Remove</button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h6>Preferences</h6>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="twoFactorSwitch" checked={enableTwoFactor} onChange={(e) => setEnableTwoFactor(e.target.checked)} />
                <label className="form-check-label" htmlFor="twoFactorSwitch">Enable Two-Factor Authentication</label>
              </div>
              <button className="btn btn-success w-100" onClick={handleSavePreferences}>Save Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Basic Stats
  const renderBasicStats = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Product Statistics</h5>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary">Export Report</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Category-wise Statistics</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Products</th>
                      <th>Total Sales</th>
                       <th>Avg Price (₹)</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.map((stat, index) => (
                      <tr key={index}>
                        <td>
                          <span className="badge bg-primary me-2">{stat.category}</span>
                        </td>
                        <td>{stat.totalProducts}</td>
                        <td>{stat.totalSales}</td>
                         <td>{formatINR(stat.avgPrice)}</td>
                        <td>
                          <div className="progress" style={{ height: '20px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${(stat.totalSales / 3000) * 100}%` }}
                            >
                              {Math.round((stat.totalSales / 3000) * 100)}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Quick Stats</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Top Selling Category</label>
                <h4 className="text-success">Seeds</h4>
                <small className="text-muted">2,340 units sold</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Low Stock Alert</label>
                <h4 className="text-warning">{productOverviewData.lowStockProducts} Products</h4>
                <small className="text-muted">Need restocking</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Monthly Growth</label>
                <h4 className="text-info">+{productOverviewData.monthlyGrowth}%</h4>
                <small className="text-muted">vs last month</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Order Admin Overview Cards
  const renderOrderOverviewCards = () => (
    <div className="row ">
      <div className="col-md-2 mb-3">
        <div className="card bg-primary text-white">
          <div className="card-body text-center">
            <h3>{orderOverviewData.totalOrders}</h3>
            <p className="mb-0">Total Orders</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-warning text-white">
          <div className="card-body text-center">
            <h3>{orderOverviewData.pendingOrders}</h3>
            <p className="mb-0">Pending</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-info text-white">
          <div className="card-body text-center">
            <h3>{orderOverviewData.processingOrders}</h3>
            <p className="mb-0">Processing</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-secondary text-white">
          <div className="card-body text-center">
            <h3>{orderOverviewData.shippedOrders}</h3>
            <p className="mb-0">Shipped</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-success text-white">
          <div className="card-body text-center">
            <h3>{orderOverviewData.deliveredOrders}</h3>
            <p className="mb-0">Delivered</p>
            <small>Avg: {orderOverviewData.averageDeliveryTime} days</small>
          </div>
        </div>
      </div>
    </div>
  );

  // Render All Orders
  const renderAllOrders = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>All Orders</h5>
        </div>
        <div className="col-md-6 text-end">
          <select className="form-select d-inline-block w-auto me-2">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>In Transit</option>
          </select>
          <button className="btn btn-primary">Export Orders</button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>${order.amount}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'Delivered' ? 'bg-success' : 
                    order.status === 'Shipped' ? 'bg-secondary' : 
                    order.status === 'In Transit' ? 'bg-info' :
                    order.status === 'Processing' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.deliveryDate}</td>
                <td>
                  <span className={order.assignedTo === 'Unassigned' ? 'text-muted' : 'text-primary'}>
                    {order.assignedTo}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-1">Update Status</button>
                  <button className="btn btn-sm btn-info">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Delivery Assignment
  const renderDeliveryAssignment = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Delivery Assignment</h5>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success">Assign All Pending</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Pending Orders for Assignment</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Delivery Date</th>
                      <th>Location</th>
                      <th>Assign To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.status === 'Pending' || order.assignedTo === 'Unassigned').map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.deliveryDate}</td>
                        <td>Kansas</td>
                        <td>
                          <select className="form-select form-select-sm">
                            <option>Select Driver</option>
                            {deliveryAgents.filter(agent => agent.status === 'Available').map(agent => (
                              <option key={agent.id}>{agent.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-success">Assign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Available Delivery Agents</h6>
            </div>
            <div className="card-body">
              {deliveryAgents.map(agent => (
                <div key={agent.id} className="mb-3 p-2 border rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{agent.name}</h6>
                      <small className="text-muted">{agent.phone}</small>
                    </div>
                    <span className={`badge ${
                      agent.status === 'Available' ? 'bg-success' : 
                      agent.status === 'On Delivery' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <small className="text-muted">Location: {agent.currentLocation}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Finance Admin Overview Cards
  const renderFinanceOverviewCards = () => (
    <div className="row">
      <div className="col-md-2 mb-3">
        <div className="card bg-success text-white">
          <div className="card-body text-center">
            <h3>${financeOverviewData.totalRevenue.toLocaleString()}</h3>
            <p className="mb-0">Total Revenue</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-primary text-white">
          <div className="card-body text-center">
            <h3>${financeOverviewData.totalCommission.toLocaleString()}</h3>
            <p className="mb-0">Total Commission</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-warning text-white">
          <div className="card-body text-center">
            <h3>${financeOverviewData.pendingCommission}</h3>
            <p className="mb-0">Pending Commission</p>
          </div>
        </div>
      </div>
      <div className="col-md-2 mb-3">
        <div className="card bg-info text-white">
          <div className="card-body text-center">
            <h3>{financeOverviewData.totalTransactions}</h3>
            <p className="mb-0">Total Transactions</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-danger text-white">
          <div className="card-body text-center">
            <h3>${financeOverviewData.averageOrderValue}</h3>
            <p className="mb-0">Avg Order Value</p>
            <small>+{financeOverviewData.monthlyGrowth}% this month</small>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Transaction History
  const renderTransactionHistory = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Transaction History</h5>
        </div>
        <div className="col-md-6 text-end">
          <select className="form-select d-inline-block w-auto me-2">
            <option>All Types</option>
            <option>Commission</option>
            <option>Payment</option>
            <option>Refund</option>
          </select>
          <button className="btn btn-success me-2" onClick={() => alert('Exporting transaction history...')}>
            Export CSV
          </button>
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>#{transaction.id}</td>
                <td>{transaction.orderId}</td>
                <td>{transaction.customer}</td>
                <td>
                  <span className="badge bg-primary">{transaction.type}</span>
                </td>
                <td>${transaction.amount}</td>
                <td>{transaction.date}</td>
                <td>
                  <span className={`badge ${transaction.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-1" onClick={() => alert(`Viewing transaction #${transaction.id}`)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-info" onClick={() => alert(`Downloading receipt for transaction #${transaction.id}`)}>
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Finance Reports
  const renderFinanceReports = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Finance Reports</h5>
        </div>
        <div className="col-md-6 text-end">
          <select className="form-select d-inline-block w-auto me-2">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
          <button className="btn btn-success me-2" onClick={() => alert('Generating revenue report...')}>
            Revenue Report
          </button>
          <button className="btn btn-primary" onClick={() => alert('Generating commission report...')}>
            Commission Report
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Revenue Summary</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h4 className="text-success">{formatINR(financeOverviewData.totalRevenue)}</h4>
                  <small className="text-muted">Total Revenue</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-primary">{formatINR(financeOverviewData.totalCommission)}</h4>
                  <small className="text-muted">Total Commission</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-warning">{formatINR(financeOverviewData.pendingCommission)}</h4>
                  <small className="text-muted">Pending Commission</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-info">{financeOverviewData.totalTransactions}</h4>
                  <small className="text-muted">Total Transactions</small>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress mb-2">
                  <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                </div>
                <small className="text-muted">75% of monthly target achieved</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Quick Actions</h6>
            </div>
            <div className="card-body">
              <button className="btn btn-success w-100 mb-2" onClick={() => alert('Exporting monthly report...')}>
                Export Monthly Report
              </button>
              <button className="btn btn-primary w-100 mb-2" onClick={() => alert('Generating quarterly report...')}>
                Quarterly Report
              </button>
              <button className="btn btn-info w-100 mb-2" onClick={() => alert('Generating annual report...')}>
                Annual Report
              </button>
              <button className="btn btn-warning w-100" onClick={() => alert('Sending reports to stakeholders...')}>
                Send to Stakeholders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Commission Management
  const renderCommissionManagement = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Commission Management</h5>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={() => alert('Exporting commission report...')}>
            Export Report
          </button>
          <button className="btn btn-primary" onClick={() => alert('Updating commission rates...')}>
            Update Rates
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Commission Rates by Category</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Commission Rate</th>
                      <th>Min Order</th>
                      <th>Max Commission</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionRates.map((rate, index) => (
                      <tr key={index}>
                        <td>
                          <span className="badge bg-primary me-2">{rate.category}</span>
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <input type="number" className="form-control" defaultValue={rate.rate} />
                            <span className="input-group-text">%</span>
                          </div>
                        </td>
                        <td>${rate.minOrder}</td>
                        <td>${rate.maxCommission}</td>
                        <td>
                          <button className="btn btn-sm btn-primary me-1" onClick={() => alert(`Updating commission rate for ${rate.category}`)}>
                            Update
                          </button>
                          <button className="btn btn-sm btn-info" onClick={() => alert(`Viewing commission history for ${rate.category}`)}>
                            History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Commission Summary</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Total Commission Earned</label>
                <h4 className="text-success">${financeOverviewData.totalCommission.toLocaleString()}</h4>
              </div>
              <div className="mb-3">
                <label className="form-label">Pending Commission</label>
                <h4 className="text-warning">${financeOverviewData.pendingCommission}</h4>
              </div>
              <div className="mb-3">
                <label className="form-label">Average Commission Rate</label>
                <h4 className="text-info">11.25%</h4>
              </div>
              <button className="btn btn-primary w-100" onClick={() => alert('Calculating commission for all orders...')}>
                Calculate Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Shipment Tracking
  const renderShipmentTracking = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Shipment Tracking</h5>
        </div>
        <div className="col-md-6 text-end">
          <input type="text" className="form-control d-inline-block w-auto me-2" placeholder="Search Order ID" />
          <button className="btn btn-primary">Track</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Active Shipments</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Driver</th>
                      <th>Current Location</th>
                      <th>Status</th>
                      <th>ETA</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.status === 'Shipped' || order.status === 'In Transit').map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.assignedTo}</td>
                        <td>
                          <span className="text-primary">
                            {order.status === 'In Transit' ? 'En Route' : 'Warehouse'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            order.status === 'In Transit' ? 'bg-info' : 'bg-secondary'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.deliveryDate}</td>
                        <td>
                          <button className="btn btn-sm btn-primary me-1">Track Live</button>
                          <button className="btn btn-sm btn-info">Update Location</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Tracking Map</h6>
            </div>
            <div className="card-body">
              <div className="text-center p-4 bg-light rounded">
                <h6 className="text-muted">Live Tracking Map</h6>
                <p className="text-muted">Real-time location tracking for active deliveries</p>
                <button className="btn btn-primary">View Map</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Product Analytics
  const renderProductAnalytics = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Product Analytics</h5>
        </div>
        <div className="col-md-6 text-end">
          <select className="form-select d-inline-block w-auto me-2">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Sales Performance</h6>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h2 className="text-success">{formatINR(productOverviewData.totalRevenue)}</h2>
                <p className="text-muted">Total Sales Revenue</p>
                <div className="progress mb-3">
                  <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                </div>
                <small className="text-muted">75% of monthly target achieved</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Product Performance</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <h4 className="text-primary">{productOverviewData.activeProducts}</h4>
                  <small className="text-muted">Active Products</small>
                </div>
                <div className="col-6">
                  <h4 className="text-warning">{productOverviewData.lowStockProducts}</h4>
                  <small className="text-muted">Low Stock Items</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Farmer Admin - Overview cards (clickable)
  const renderFarmerOverviewCards = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Farmer Overview</h6>
        <button 
          className="btn btn-sm btn-outline-primary" 
          onClick={() => {
        
            loadVerificationRequests();
          }}
          title="Refresh farmers data"
        >
          <i className="fas fa-sync-alt me-1"></i>Refresh
        </button>
      </div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white" role="button" tabIndex={0} onClick={() => openFarmerListWithFilter()} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h3>{farmerOverviewData.total}</h3>
              <p className="mb-0">Total Farmers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white" role="button" tabIndex={0} onClick={() => openFarmerListWithFilter('Approved')} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h3>{farmerOverviewData.approved}</h3>
              <p className="mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white" role="button" tabIndex={0} onClick={() => openFarmerApproval()} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h3>{farmerOverviewData.pending}</h3>
              <p className="mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white" role="button" tabIndex={0} onClick={() => openFarmerListWithFilter('Rejected')} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h3>{farmerOverviewData.rejected}</h3>
              <p className="mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Farmer Approval Table
  const renderFarmerApprovalTable = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Pending Verification Requests</h6>
        <button className="btn btn-sm btn-outline-secondary" onClick={openFarmerListWithFilter}>Go to List</button>
      </div>
      
      {verificationRequests.filter(req => req.status === 'pending').length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No pending verification requests at the moment.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Farmer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Products to Sell</th>
                <th>Land Area</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verificationRequests.filter(req => req.status === 'pending').map(request => (
                <tr key={request.id}>
                  <td>{request.farmerId}</td>
                  <td>{request.farmerName}</td>
                  <td>{request.farmerEmail}</td>
                  <td>{request.village}, {request.address}</td>
                  <td>{request.products}</td>
                  <td>{request.landArea}</td>
                  <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success me-1" 
                      onClick={() => approveFarmer(request.farmerId)}
                      title="Approve this farmer"
                    >
                      <i className="fas fa-check me-1"></i>Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger me-1" 
                      onClick={() => rejectFarmer(request.farmerId)}
                      title="Reject this farmer"
                    >
                      <i className="fas fa-times me-1"></i>Reject
                    </button>
                    <button 
                      className="btn btn-sm btn-info me-1" 
                      onClick={() => openFarmerProfile({
                        id: request.farmerId,
                        name: request.farmerName,
                        email: request.farmerEmail,
                        location: `${request.village}, ${request.address}`,
                        products: request.products,
                        landArea: request.landArea,
                        aadharNumber: request.aadharNumber,
                        productsGrown: request.productsGrown,
                        additionalInfo: request.additionalInfo
                      })}
                      title="View full details"
                    >
                      <i className="fas fa-eye me-1"></i>View
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => openRemoveConfirmation({
                        id: request.farmerId,
                        name: request.farmerName,
                        email: request.farmerEmail
                      })}
                      title="Remove this farmer account"
                    >
                      <i className="fas fa-trash me-1"></i>Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Farmer List with actions
  const renderFarmerList = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">All Farmers</h6>
        {farmerFilters.status && (
          <div>
            <span className="badge bg-info text-dark me-2">Filter: {farmerFilters.status}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFarmerFilters}>Clear</button>
          </div>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Location</th>
              <th>Products</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map(farmer => (
              <tr key={farmer.id}>
                <td>{farmer.id}</td>
                <td>{farmer.name}</td>
                <td>
                  <span className={`badge ${farmer.status === 'Approved' ? 'bg-success' : farmer.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>{farmer.status}</span>
                </td>
                <td>{farmer.location}</td>
                <td>{farmer.products}</td>
                <td>{farmer.email}</td>
                <td>{farmer.phone}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-1" onClick={() => openFarmerProfile(farmer)}>View</button>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => copyFarmerProfileLink(farmer)}>Copy Profile Link</button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => openRemoveConfirmation(farmer)}
                    title="Remove this farmer account"
                  >
                    <i className="fas fa-trash me-1"></i>Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFarmerSupport = () => (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header"><h6>Contact Farmer</h6></div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Select Farmer</label>
              <select className="form-select" value={supportFarmerId || ''} onChange={(e) => setSupportFarmerId(Number(e.target.value))}>
                <option value="">Choose...</option>
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.status})</option>
                ))}
              </select>
            </div>
            {supportFarmerId && (
              <div className="d-flex gap-2">
                <a className="btn btn-outline-primary" href={`mailto:${farmers.find(f=>f.id===supportFarmerId)?.email}`}>
                  Email
                </a>
                <a className="btn btn-outline-success" href={`tel:${farmers.find(f=>f.id===supportFarmerId)?.phone}`}>
                  Call
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header"><h6>FAQs</h6></div>
          <div className="card-body">
            <ul className="mb-0">
              <li>Approve or reject pending farmers in the Approval tab.</li>
              <li>View detailed profile via the Farmer List.</li>
              <li>Use Email/Call buttons here to contact selected farmer.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Farmer Management
  const renderFarmerManagement = () => (
    <div>
      {/* Farmer Overview Cards */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Farmer Overview</h5>
        <button 
          className="btn btn-sm btn-outline-primary" 
          onClick={() => {
        
            loadVerificationRequests();
          }}
          title="Refresh farmers data"
        >
          <i className="fas fa-sync-alt me-1"></i>Refresh
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{verificationRequests.length}</h3>
              <p className="mb-0">Total Farmers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{verificationRequests.filter(req => req.status === 'approved').length}</h3>
              <p className="mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3>{verificationRequests.filter(req => req.status === 'pending').length}</h3>
              <p className="mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h3>{verificationRequests.filter(req => req.status === 'rejected').length}</h3>
              <p className="mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verification Requests Section */}
      <div className="card mb-4 border-warning">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Pending Verification Requests ({verificationRequests.filter(req => req.status === 'pending').length})
          </h5>
        </div>
        <div className="card-body">
          {verificationRequests.filter(req => req.status === 'pending').length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Products</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationRequests.filter(req => req.status === 'pending').map(request => (
                    <tr key={request.farmerId}>
                      <td>{request.farmerId}</td>
                      <td>{request.farmerName}</td>
                      <td>{request.farmerEmail}</td>
                      <td>{request.village || 'Not specified'}</td>
                      <td>{request.products || 'Not specified'}</td>
                      <td>{request.phone || 'Not specified'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-success me-1" 
                          onClick={() => approveFarmer(request.farmerId)}
                          title="Approve this farmer"
                        >
                          <i className="fas fa-check me-1"></i>Approve
                        </button>
                        <button 
                          className="btn btn-sm btn-danger me-1" 
                          onClick={() => rejectFarmer(request.farmerId)}
                          title="Reject this farmer"
                        >
                          <i className="fas fa-times me-1"></i>Reject
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => openRemoveConfirmation({id: request.farmerId, name: request.farmerName, email: request.farmerEmail})}
                          title="Remove this farmer account"
                        >
                          <i className="fas fa-trash me-1"></i>Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <p className="mb-0">No pending verification requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Approved Farmers Section */}
      <div className="card mb-4 border-success">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="fas fa-check-circle me-2"></i>
            Approved Farmers ({verificationRequests.filter(req => req.status === 'approved').length})
          </h5>
        </div>
        <div className="card-body">
          {verificationRequests.filter(req => req.status === 'approved').length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Products</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationRequests.filter(req => req.status === 'approved').map(request => (
                    <tr key={request.farmerId}>
                      <td>{request.farmerId}</td>
                      <td>{request.farmerName}</td>
                      <td>{request.farmerEmail}</td>
                      <td>{request.village || 'Not specified'}</td>
                      <td>{request.products || 'Not specified'}</td>
                      <td>{request.phone || 'Not specified'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary me-1" 
                          onClick={() => openFarmerProfile({id: request.farmerId, name: request.farmerName, email: request.farmerEmail, location: request.village, products: request.products, phone: request.phone, status: 'Approved'})}
                          title="View farmer details"
                        >
                          <i className="fas fa-eye me-1"></i>View
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => openRemoveConfirmation({id: request.farmerId, name: request.farmerName, email: request.farmerEmail})}
                          title="Remove this farmer account"
                        >
                          <i className="fas fa-trash me-1"></i>Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              <i className="fas fa-info-circle fa-2x mb-2"></i>
              <p className="mb-0">No approved farmers yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejected Farmers Section */}
      <div className="card mb-4 border-danger">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">
            <i className="fas fa-times-circle me-2"></i>
            Rejected Farmers ({verificationRequests.filter(req => req.status === 'rejected').length})
          </h5>
        </div>
        <div className="card-body">
          {verificationRequests.filter(req => req.status === 'rejected').length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Products</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationRequests.filter(req => req.status === 'rejected').map(request => (
                    <tr key={request.farmerId}>
                      <td>{request.farmerId}</td>
                      <td>{request.farmerName}</td>
                      <td>{request.farmerEmail}</td>
                      <td>{request.village || 'Not specified'}</td>
                      <td>{request.products || 'Not specified'}</td>
                      <td>{request.phone || 'Not specified'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary me-1" 
                          onClick={() => openFarmerProfile({id: request.farmerId, name: request.farmerName, email: request.farmerEmail, location: request.village, products: request.products, phone: request.phone, status: 'Rejected'})}
                          title="View farmer details"
                        >
                          <i className="fas fa-eye me-1"></i>View
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => openRemoveConfirmation({id: request.farmerId, name: request.farmerName, email: request.farmerEmail})}
                          title="Remove this farmer account"
                        >
                          <i className="fas fa-trash me-1"></i>Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              <i className="fas fa-info-circle fa-2x mb-2"></i>
              <p className="mb-0">No rejected farmers</p>
            </div>
          )}
        </div>
      </div>

      {/* All Farmers Section */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            All Farmers ({farmers.length})
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Products</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td>{farmer.id}</td>
                    <td>{farmer.name}</td>
                    <td>
                      <span className={`badge ${
                        farmer.status === 'Approved' ? 'bg-success' : 
                        farmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                      }`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td>{farmer.location}</td>
                    <td>{farmer.products}</td>
                    <td>{farmer.email}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-1" 
                        onClick={() => openFarmerProfile(farmer)}
                        title="View farmer details"
                      >
                        <i className="fas fa-eye me-1"></i>View
                      </button>
                      {farmer.status === 'Pending' && (
                        <>
                          <button 
                            className="btn btn-sm btn-success me-1" 
                            onClick={() => approveFarmer(farmer.id)}
                            title="Approve this farmer"
                          >
                            <i className="fas fa-check me-1"></i>Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-danger me-1" 
                            onClick={() => rejectFarmer(farmer.id)}
                            title="Reject this farmer"
                          >
                            <i className="fas fa-times me-1"></i>Reject
                          </button>
                        </>
                      )}
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => openRemoveConfirmation(farmer)}
                        title="Remove this farmer account"
                      >
                        <i className="fas fa-trash me-1"></i>Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Farmer Profile Modal */}
      {selectedFarmer && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-user-farmer me-2"></i>
                  Farmer Profile - {selectedFarmer.name}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeFarmerProfile}></button>
              </div>
              <div className="modal-body">
                {/* Basic Information Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-info-circle me-2 text-primary"></i>
                      Basic Information
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Farmer ID</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-id-card me-2 text-primary"></i>
                        {selectedFarmer.id}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Full Name</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-user me-2 text-primary"></i>
                        {selectedFarmer.name}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Email Address</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        {selectedFarmer.email || 'Not specified'}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Phone Number</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-phone me-2 text-primary"></i>
                        {selectedFarmer.phone || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Location/Village</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        {selectedFarmer.location || 'Not specified'}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Products/Produce</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-seedling me-2 text-primary"></i>
                        {selectedFarmer.products || 'Not specified'}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Account Status</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <span className={`badge fs-6 ${
                          selectedFarmer.status === 'Approved' ? 'bg-success' : 
                          selectedFarmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          <i className="fas fa-circle me-1"></i>
                          {selectedFarmer.status}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Profile Completion</label>
                      <div className="progress" style={{height: '25px'}}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{
                            width: `${(() => {
                              const fields = ['name', 'email', 'phone', 'location', 'products'];
                              const completed = fields.filter(field => selectedFarmer[field] && selectedFarmer[field] !== 'Not specified');
                              return (completed.length / fields.length) * 100;
                            })()}%`
                          }}
                        >
                          {(() => {
                            const fields = ['name', 'email', 'phone', 'location', 'products'];
                            const completed = fields.filter(field => selectedFarmer[field] && selectedFarmer[field] !== 'Not specified');
                            return `${completed.length}/${fields.length} fields completed`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Details Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-clipboard-check me-2 text-success"></i>
                      Verification Details
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Verification Request Date</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-calendar me-2 text-success"></i>
                        {(() => {
                          const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                          return request ? new Date(request.timestamp).toLocaleDateString() : 'Not available';
                        })()}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Verification Status</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <span className={`badge fs-6 ${
                          selectedFarmer.status === 'Approved' ? 'bg-success' : 
                          selectedFarmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          <i className="fas fa-clipboard-check me-1"></i>
                          {selectedFarmer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Last Updated</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-clock me-2 text-success"></i>
                        {(() => {
                          const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                          return request ? new Date(request.timestamp).toLocaleString() : 'Not available';
                        })()}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">Verification Notes</label>
                      <div className="form-control-plaintext bg-light p-2 rounded">
                        <i className="fas fa-sticky-note me-2 text-success"></i>
                        {(() => {
                          const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                          return request?.notes || 'No notes available';
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-tools me-2 text-info"></i>
                      Quick Actions
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <a 
                        className="btn btn-outline-primary" 
                        href={`mailto:${selectedFarmer.email}`}
                        disabled={!selectedFarmer.email || selectedFarmer.email === 'Not specified'}
                      >
                        <i className="fas fa-envelope me-2"></i>
                        Send Email
                      </a>
                      <a 
                        className="btn btn-outline-success" 
                        href={`tel:${selectedFarmer.phone}`}
                        disabled={!selectedFarmer.phone || selectedFarmer.phone === 'Not specified'}
                      >
                        <i className="fas fa-phone me-2"></i>
                        Call Farmer
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => copyFarmerProfileLink(selectedFarmer)}
                      >
                        <i className="fas fa-link me-2"></i>
                        Copy Profile Link
                      </button>
                      <button 
                        className="btn btn-outline-info" 
                        onClick={() => {
                          // Export farmer data as JSON
                          const dataStr = JSON.stringify(selectedFarmer, null, 2);
                          const dataBlob = new Blob([dataStr], {type: 'application/json'});
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `farmer-${selectedFarmer.id}-${selectedFarmer.name}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <i className="fas fa-download me-2"></i>
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Management Actions Section */}
                {selectedFarmer.status === 'Pending' && (
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="border-bottom pb-2 mb-3">
                        <i className="fas fa-cogs me-2 text-danger"></i>
                        Management Actions
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <div className="d-grid">
                        <button 
                          className="btn btn-success btn-lg" 
                          onClick={() => {
                            approveFarmer(selectedFarmer.id);
                            closeFarmerProfile();
                          }}
                        >
                          <i className="fas fa-check me-2"></i>
                          Approve Farmer
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-grid">
                        <button 
                          className="btn btn-danger btn-lg" 
                          onClick={() => {
                            rejectFarmer(selectedFarmer.id);
                            closeFarmerProfile();
                          }}
                        >
                          <i className="fas fa-times me-2"></i>
                          Reject Farmer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeFarmerProfile}>
                  <i className="fas fa-times me-1"></i>Close
                </button>
                {selectedFarmer.status === 'Pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success" 
                      onClick={() => {
                        approveFarmer(selectedFarmer.id);
                        closeFarmerProfile();
                      }}
                    >
                      <i className="fas fa-check me-1"></i>Approve
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => {
                        rejectFarmer(selectedFarmer.id);
                        closeFarmerProfile();
                      }}
                    >
                      <i className="fas fa-times me-1"></i>Reject
                    </button>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    openRemoveConfirmation(selectedFarmer);
                    closeFarmerProfile();
                  }}
                >
                  <i className="fas fa-trash me-1"></i>Remove Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render Order Management
  const renderOrderManagement = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Order Management</h5>
        </div>
        <div className="col-md-6 text-end">
          <select className="form-select d-inline-block w-auto me-2">
            <option>All Status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <button className="btn btn-primary">Track Orders</button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>${order.amount}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'Delivered' ? 'bg-success' : 
                    order.status === 'Shipped' ? 'bg-info' : 'bg-warning'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-1">View</button>
                  <button className="btn btn-sm btn-info">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Finance Management
  const renderFinanceManagement = () => (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Finance Management</h5>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2">Generate Report</button>
          <button className="btn btn-primary">Export Data</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Transaction History</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td>#{transaction.id}</td>
                        <td>{transaction.type}</td>
                        <td>${transaction.amount}</td>
                        <td>{transaction.date}</td>
                        <td>
                          <span className="badge bg-success">{transaction.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Commission Report</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Commission Rate</label>
                <div className="input-group">
                  <input type="number" className="form-control" defaultValue="10" />
                  <span className="input-group-text">%</span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Total Commission</label>
                <h4 className="text-success">{formatINR(overviewData.totalRevenue * 0.1)}</h4>
              </div>
              <button className="btn btn-primary w-100">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Admin Management
  const renderAdminManagement = () => (
    <div className="admin-management" style={{ padding: '20px' }}>
      <div className="section-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Admin Management</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Manage system administrators and their permissions</p>
      </div>
      
      <div className="admin-stats" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="stat-card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Total Admins</h3>
          <p className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{admins.length}</p>
        </div>
        <div className="stat-card" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Active Admins</h3>
          <p className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{admins.filter(a => a.status === 'Active').length}</p>
        </div>
        <div className="stat-card" style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Admin Types</h3>
          <p className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{new Set(admins.map(a => a.role)).size}</p>
        </div>
      </div>
      
      <div className="admin-actions" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateAdminModal(true)}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginRight: '10px'
          }}
        >
          <i className="fas fa-plus me-2"></i> Create New Admin
        </button>
        
        <button 
          className="btn btn-success" 
          onClick={() => {
            ensureDefaultAdminAccounts();
            loadExistingAdmins();
            alert('Default admin accounts created! Prince/softpro (Order Admin) and admin/admin123 (Super Admin)');
          }}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginRight: '10px'
          }}
        >
          <i className="fas fa-magic me-2"></i> Create Default Admins
        </button>
        
        <button 
          className="btn btn-info" 
          onClick={() => {
            const admins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const credentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
            console.log('Admin Users:', admins);
            console.log('Admin Credentials:', credentials);
            alert(`Current admins: ${admins.length}\nCheck console for details`);
          }}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <i className="fas fa-eye me-2"></i> View Current Admins
        </button>
      </div>
      
      <div className="admin-table" style={{ 
        background: 'white', 
        borderRadius: '10px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Username</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Created</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Last Login</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                  <td style={{ padding: '15px', textAlign: 'left' }}>{admin.id}</td>
                  <td style={{ padding: '15px', textAlign: 'left', fontWeight: '500' }}>{admin.firstName} {admin.lastName}</td>
                  <td style={{ padding: '15px', textAlign: 'left', fontFamily: 'monospace' }}>{admin.username}</td>
                  <td style={{ padding: '15px', textAlign: 'left' }}>{admin.email}</td>
                  <td style={{ padding: '15px', textAlign: 'left' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      background: admin.role === 'Super Admin' ? '#e74c3c' : 
                                 admin.role === 'Product Admin' ? '#27ae60' : 
                                 admin.role === 'Farmer Admin' ? '#f39c12' : 
                                 admin.role === 'Order Admin' ? '#9b59b6' : 
                                 admin.role === 'Finance Admin' ? '#3498db' : '#95a5a6',
                      color: 'white'
                    }}>
                      {admin.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'left' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      background: admin.status === 'Active' ? '#27ae60' : '#e74c3c',
                      color: 'white'
                    }}>
                      {admin.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>{admin.createdAt}</td>
                  <td style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>{admin.lastLogin || 'Never'}</td>
                  <td style={{ padding: '15px', textAlign: 'left' }}>
                    <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handleEditAdmin(admin)}
                        title="Edit Admin"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-warning" 
                        onClick={() => handlePasswordReset(admin)}
                        title="Reset Password"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <i className="fas fa-key"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => handleToggleAdminStatus(admin.id)}
                        title={admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                        disabled={admin.id === 1}
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <i className={`fas fa-${admin.status === 'Active' ? 'pause' : 'play'}`}></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteAdmin(admin.id)}
                        title="Delete Admin"
                        disabled={admin.id === 1}
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Settings
  const renderSettings = () => (
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Commission Settings</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Commission Rate (%)</label>
                <input type="number" className="form-control" defaultValue="10" min="0" max="100" />
              </div>
              <div className="mb-3">
                <label className="form-label">Minimum Order Amount</label>
                <input type="number" className="form-control" defaultValue="50" />
              </div>
              <button className="btn btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Profile Settings</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" defaultValue={user?.firstName + ' ' + user?.lastName} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" defaultValue={user?.email} />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="Enter new password" />
              </div>
              <button className="btn btn-primary">Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid text-black vh-100 d-flex">
      {/* Full Screen Sidebar */}
      <div className="col-md-2 bg-d text-black p-0 cbc">
        <div className="p-3 border-bottom">
          <h5 className="mb-1">Admin Panel</h5>
          <small className="text-black">Welcome, {user?.firstName || 'Admin'}</small>
        </div>
        <div className="p-3 text-black ">
          <button onClick={handleLogout} className="btn btn-outline-light cbc  btn-sm w-100 mb-3">
            Logout
          </button>
          {/* Sidebar: Admins list */}
          <div className="mb-3 ">
            <h6 className="text-black-50 mb-2">Admins</h6>
            <div className="list-group ">
              {admins.map((a) => (
                <div key={a.id} className="list-group-item list-group-item-action p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{a.name}</div>
                      <small className="text-muted">{a.role}</small>
                    </div>
                    <span className={`badge ${a.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          {ADMIN_TYPES.map(adminType => (
            <li key={adminType.key} className="list-group-item cbc border-0 p-0">
              <button
                className={`btn w-100 text-start p-3 ${activeAdminType === adminType.key ? `btn-${adminType.color}` : 'btn-dark'}`}
                style={{ borderRadius: 0, border: 'none' }}
                onClick={() => handleAdminTypeChange(adminType.key)}
              >
                <span className="me-2">{adminType.icon}</span>
                {adminType.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="col-md-10 p-0">
        {/* Header with Super Admin Sections */}
        {activeAdminType === 'super' && (
          <div className="bg-d border-bottom p-3 cbc">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h4 className="mb-0">Super Admin Dashboard</h4>
                <small className="text-muted">Welcome {user?.firstName || 'Admin'}, have a productive day!</small>
              </div>
              <div className="col-md-6 d-flex ">
                <div className=" gap-2  ">
                  {SUPER_ADMIN_SECTIONS.map(section => (
                    <button
                      key={section.key}
                      className={`btn btn-sm  ${activeSection === section.key ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleSectionChange(section.key)}
                    >
                      <span className="me-1 ">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-2 text-end">
                <Notification 
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDelete={handleDeleteNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Header with Product Admin Sections */}
        {activeAdminType === 'product' &&(
          <div className="bg-light border-bottom p-3 cbc">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h4 className="mb-0">Product Admin Dashboard</h4>
                <small className="text-muted">Welcome {user?.firstName || 'Admin'}, manage products efficiently.</small>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  {PRODUCT_ADMIN_SECTIONS.map(section => (
                    <button
                      key={section.key}
                      className={`btn btn-sm ${activeProductSection === section.key ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleProductSectionChange(section.key)}
                    >
                      <span className="me-1">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-2 text-end">
                <Notification 
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDelete={handleDeleteNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Header with Order Admin Sections */}
        {activeAdminType === 'order' && (
          <div className="bg-light border-bottom p-3 cbc">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h4 className="mb-0">Order Admin Dashboard</h4>
                <small className="text-muted">Welcome {user?.firstName || 'Admin'}, track and deliver on time.</small>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  {ORDER_ADMIN_SECTIONS.map(section => (
                    <button
                      key={section.key}
                      className={`btn btn-sm ${activeOrderSection === section.key ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleOrderSectionChange(section.key)}
                    >
                      <span className="me-1">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-2 text-end">
                <Notification 
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDelete={handleDeleteNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Header with Farmer Admin Sections */}
        {activeAdminType === 'farmer' && (
          <div className="bg-light border-bottom p-3 cbc">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h4 className="mb-0">Farmer Admin Dashboard</h4>
                <small className="text-muted">Welcome {user?.firstName || 'Admin'}, manage farmers effectively.</small>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  {FARMER_ADMIN_SECTIONS.map(section => (
                    <button
                      key={section.key}
                      className={`btn btn-sm ${activeFarmerSection === section.key ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleFarmerSectionChange(section.key)}
                    >
                      <span className="me-1">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-2 text-end">
                <Notification 
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDelete={handleDeleteNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Header with Finance Admin Sections */}
        {activeAdminType === 'finance' && (
          <div className="bg-light border-bottom p-3 cbc">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h4 className="mb-0">Finance Admin Dashboard</h4>
                <small className="text-muted">Welcome {user?.firstName || 'Admin'}, keep finances in check.</small>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  {FINANCE_ADMIN_SECTIONS.map(section => (
                    <button
                      key={section.key}
                      className={`btn btn-sm ${activeFinanceSection === section.key ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => handleFinanceSectionChange(section.key)}
                    >
                      <span className="me-1">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-2 text-end">
                <Notification 
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDelete={handleDeleteNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4">
          {/* Below-navigation role guide for the active admin type */}
          <div className="alert alert-info" role="region" aria-label="Role Guide">
            <div className="d-flex align-items-center mb-2">
              <span className="me-2">ℹ️</span>
              <strong>Quick Guide</strong>
            </div>
            <div className="row">
              {(ROLE_GUIDE[activeAdminType] || ROLE_GUIDE.super).map((item, idx) => (
                <div className="col-md-6 col-lg-4 mb-2" key={idx}>
                  <div className="border rounded p-2 bg-white">
                    <div className="fw-semibold">{item.header}</div>
                    <div className="text-muted small">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeAdminType === 'super' && (
            <div>
              {activeSection === 'overview' && (
                <div>
                  <h4>Overview Dashboard</h4>
                  {renderOverviewCards()}
                </div>
              )}
              {activeSection === 'farmers' && (
                <div>
                  <h4>Farmer Management</h4>
                  {renderFarmerManagement()}
                </div>
              )}
              {activeSection === 'products' && (
                <div>
                  <h4>Product Management</h4>
                  {renderProductManagement()}
                </div>
              )}
              {activeSection === 'orders' && (
                <div>
                  <h4>Order Management</h4>
                  {renderOrderManagement()}
                </div>
              )}
              {activeSection === 'finance' && (
                <div>
                  <h4>Finance Management</h4>
                  {renderFinanceManagement()}
                </div>
              )}
              {activeSection === 'admins' && (
                <div>
                  <h4>Admin Management</h4>
                  {renderAdminManagement()}
                </div>
              )}
              {activeSection === 'settings' && (
                <div>
                  <h4>Settings</h4>
                  {renderSettings()}
                </div>
              )}
            </div>
          )}

          {activeAdminType === 'product' && (
            <div>
              {activeProductSection === 'overview' && (
                <div>
                  <h4>Product Overview</h4>
                  {renderProductOverviewCards()}
                </div>
              )}
              {activeProductSection === 'products' && (
                <div>
                  <h4>Product Management</h4>
                  {renderProductManagement()}
                </div>
              )}
              {activeProductSection === 'stats' && (
                <div>
                  <h4>Basic Statistics</h4>
                  {renderBasicStats()}
                </div>
              )}
              {activeProductSection === 'analytics' && (
                <div>
                  <h4>Product Analytics</h4>
                  {renderProductAnalytics()}
                </div>
              )}
              {activeProductSection === 'settings' && (
                <div>
                  <h4>Settings</h4>
                  {renderProductSettings()}
                </div>
              )}
            </div>
          )}

          {activeAdminType === 'order' && (
            <div>
              {activeOrderSection === 'overview' && (
                <div>
                  <h4>Order Overview</h4>
                  {renderOrderOverviewCards()}
                </div>
              )}
              {activeOrderSection === 'orders' && (
                <div>
                  <h4>All Orders</h4>
                  {renderAllOrders()}
                </div>
              )}
              {activeOrderSection === 'delivery' && (
                <div>
                  <h4>Delivery Assignment</h4>
                  {renderDeliveryAssignment()}
                </div>
              )}
              {activeOrderSection === 'tracking' && (
                <div>
                  <h4>Shipment Tracking</h4>
                  {renderShipmentTracking()}
                </div>
              )}
            </div>
          )}

          {activeAdminType === 'finance' && (
            <div>
              {activeFinanceSection === 'overview' && (
                <div>
                  <h4>Finance Overview</h4>
                  {renderFinanceOverviewCards()}
                </div>
              )}
              {activeFinanceSection === 'transactions' && (
                <div>
                  <h4>Transaction History</h4>
                  {renderTransactionHistory()}
                </div>
              )}
              {activeFinanceSection === 'reports' && (
                <div>
                  <h4>Finance Reports</h4>
                  {renderFinanceReports()}
                </div>
              )}
              {activeFinanceSection === 'commission' && (
                <div>
                  <h4>Commission Management</h4>
                  {renderCommissionManagement()}
                </div>
              )}
            </div>
          )}



          {activeAdminType === 'farmer' && (
            <div>
              {activeFarmerSection === 'overview' && (
                <div>
                  <h4>Overview</h4>
                  {renderFarmerOverviewCards()}
                </div>
              )}
              {activeFarmerSection === 'approval' && (
                <div>
                  <h4>Farmer Approval</h4>
                  {renderFarmerApprovalTable()}
                </div>
              )}
              {activeFarmerSection === 'list' && (
                <div>
                  <h4>Farmer List</h4>
                  {renderFarmerList()}
                  {selectedFarmer && (
                    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                      <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                          <div className="modal-header bg-success text-white">
                            <h5 className="modal-title">
                              <i className="fas fa-user-farmer me-2"></i>
                              Farmer Profile - {selectedFarmer.name}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={closeFarmerProfile}></button>
                          </div>
                          <div className="modal-body">
                            {/* Basic Information Section */}
                            <div className="row mb-4">
                              <div className="col-12">
                                <h6 className="border-bottom pb-2 mb-3">
                                  <i className="fas fa-info-circle me-2 text-success"></i>
                                  Basic Information
                                </h6>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Farmer ID</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-id-card me-2 text-success"></i>
                                    {selectedFarmer.id}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Full Name</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-user me-2 text-success"></i>
                                    {selectedFarmer.name}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Email Address</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-envelope me-2 text-success"></i>
                                    {selectedFarmer.email || 'Not specified'}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Phone Number</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-phone me-2 text-success"></i>
                                    {selectedFarmer.phone || 'Not specified'}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Location/Village</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                                    {selectedFarmer.location || 'Not specified'}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Products/Produce</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-seedling me-2 text-success"></i>
                                    {selectedFarmer.products || 'Not specified'}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Account Status</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <span className={`badge fs-6 ${
                                      selectedFarmer.status === 'Approved' ? 'bg-success' : 
                                      selectedFarmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                                    }`}>
                                      <i className="fas fa-circle me-1"></i>
                                      {selectedFarmer.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Profile Completion</label>
                                  <div className="progress" style={{height: '25px'}}>
                                    <div 
                                      className="progress-bar bg-success" 
                                      style={{
                                        width: `${(() => {
                                          const fields = ['name', 'email', 'phone', 'location', 'products'];
                                          const completed = fields.filter(field => selectedFarmer[field] && selectedFarmer[field] !== 'Not specified');
                                          return (completed.length / fields.length) * 100;
                                        })()}%`
                                      }}
                                    >
                                      {(() => {
                                        const fields = ['name', 'email', 'phone', 'location', 'products'];
                                        const completed = fields.filter(field => selectedFarmer[field] && selectedFarmer[field] !== 'Not specified');
                                        return `${completed.length}/${fields.length} fields completed`;
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Verification Details Section */}
                            <div className="row mb-4">
                              <div className="col-12">
                                <h6 className="border-bottom pb-2 mb-3">
                                  <i className="fas fa-clipboard-check me-2 text-info"></i>
                                  Verification Details
                                </h6>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Verification Request Date</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-calendar me-2 text-info"></i>
                                    {(() => {
                                      const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                                      return request ? new Date(request.timestamp).toLocaleDateString() : 'Not available';
                                    })()}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Verification Status</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <span className={`badge fs-6 ${
                                      selectedFarmer.status === 'Approved' ? 'bg-success' : 
                                      selectedFarmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                                    }`}>
                                      <i className="fas fa-clipboard-check me-1"></i>
                                      {selectedFarmer.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Last Updated</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-clock me-2 text-info"></i>
                                    {(() => {
                                      const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                                      return request ? new Date(request.timestamp).toLocaleString() : 'Not available';
                                    })()}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label fw-bold text-muted small">Verification Notes</label>
                                  <div className="form-control-plaintext bg-light p-2 rounded">
                                    <i className="fas fa-sticky-note me-2 text-info"></i>
                                    {(() => {
                                      const request = verificationRequests.find(req => req.farmerId === selectedFarmer.id);
                                      return request?.notes || 'No notes available';
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions Section */}
                            <div className="row mb-4">
                              <div className="col-12">
                                <h6 className="border-bottom pb-2 mb-3">
                                  <i className="fas fa-tools me-2 text-warning"></i>
                                  Quick Actions
                                </h6>
                              </div>
                              <div className="col-md-6">
                                <div className="d-grid gap-2">
                                  <a 
                                    className="btn btn-outline-primary" 
                                    href={`mailto:${selectedFarmer.email}`}
                                    disabled={!selectedFarmer.email || selectedFarmer.email === 'Not specified'}
                                  >
                                    <i className="fas fa-envelope me-2"></i>
                                    Send Email
                                  </a>
                                  <a 
                                    className="btn btn-outline-success" 
                                    href={`tel:${selectedFarmer.phone}`}
                                    disabled={!selectedFarmer.phone || selectedFarmer.phone === 'Not specified'}
                                  >
                                    <i className="fas fa-phone me-2"></i>
                                    Call Farmer
                                  </a>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="d-grid gap-2">
                                  <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => copyFarmerProfileLink(selectedFarmer)}
                                  >
                                    <i className="fas fa-link me-2"></i>
                                    Copy Profile Link
                                  </button>
                                  <button 
                                    className="btn btn-outline-info" 
                                    onClick={() => {
                                      // Export farmer data as JSON
                                      const dataStr = JSON.stringify(selectedFarmer, null, 2);
                                      const dataBlob = new Blob([dataStr], {type: 'application/json'});
                                      const url = URL.createObjectURL(dataBlob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `farmer-${selectedFarmer.id}-${selectedFarmer.name}.json`;
                                      link.click();
                                      URL.revokeObjectURL(url);
                                    }}
                                  >
                                    <i className="fas fa-download me-2"></i>
                                    Export Data
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Management Actions Section */}
                            {selectedFarmer.status === 'Pending' && (
                              <div className="row mb-4">
                                <div className="col-12">
                                  <h6 className="border-bottom pb-2 mb-3">
                                    <i className="fas fa-cogs me-2 text-danger"></i>
                                    Management Actions
                                  </h6>
                                </div>
                                <div className="col-md-6">
                                  <div className="d-grid">
                                    <button 
                                      className="btn btn-success btn-lg" 
                                      onClick={() => {
                                        approveFarmer(selectedFarmer.id);
                                        closeFarmerProfile();
                                      }}
                                    >
                                      <i className="fas fa-check me-2"></i>
                                      Approve Farmer
                                    </button>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="d-grid">
                                    <button 
                                      className="btn btn-danger btn-lg" 
                                      onClick={() => {
                                        rejectFarmer(selectedFarmer.id);
                                        closeFarmerProfile();
                                      }}
                                    >
                                      <i className="fas fa-times me-2"></i>
                                      Reject Farmer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeFarmerProfile}>
                              <i className="fas fa-times me-1"></i>Close
                            </button>
                            {selectedFarmer.status !== 'Pending' && (
                              <button 
                                type="button" 
                                className="btn btn-warning" 
                                onClick={() => {
                                  openRemoveConfirmation(selectedFarmer);
                                  closeFarmerProfile();
                                }}
                              >
                                <i className="fas fa-edit me-1"></i>Edit Status
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeFarmerSection === 'management' && (
                <div>
                  <h4>Farmer Management</h4>
                  {renderFarmerManagement()}
                </div>
              )}
              {activeFarmerSection === 'users' && (
                <div>
                  <h4>All Users Management</h4>
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="card bg-info text-white">
                        <div className="card-body text-center">
                          <h3>{farmers.length + 50}</h3>
                          <p className="mb-0">Total Users</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <h3>{farmers.length}</h3>
                          <p className="mb-0">Farmers</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                          <h3>50</h3>
                          <p className="mb-0">Regular Users</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <h3>{admins.length}</h3>
                          <p className="mb-0">Admin Users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header">
                      <h5>All Platform Users</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Join Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {farmers.map(farmer => (
                              <tr key={farmer.id}>
                                <td>{farmer.id}</td>
                                <td>{farmer.name}</td>
                                <td>{farmer.email}</td>
                                <td><span className="badge bg-success">Farmer</span></td>
                                <td>
                                  <span className={`badge ${
                                    farmer.status === 'Approved' ? 'bg-success' : 
                                    farmer.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                                  }`}>
                                    {farmer.status}
                                  </span>
                                </td>
                                <td>2024-01-01</td>
                                <td>
                                  <button className="btn btn-sm btn-primary me-1" onClick={() => openFarmerProfile(farmer)}>
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="btn btn-sm btn-danger" onClick={() => openRemoveConfirmation(farmer)}>
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {admins.filter(admin => admin.role !== 'Super Admin').map(admin => (
                              <tr key={`admin-${admin.id}`}>
                                <td>A{admin.id}</td>
                                <td>{admin.firstName} {admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td><span className="badge bg-info">Admin</span></td>
                                <td>
                                  <span className={`badge ${admin.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                    {admin.status}
                                  </span>
                                </td>
                                <td>{admin.createdAt}</td>
                                <td>
                                  <button className="btn btn-sm btn-primary me-1" title="View Details">
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="btn btn-sm btn-warning me-1" title="Edit">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeFarmerSection === 'support' && (
                <div>
                  <h4>Support</h4>
                  {renderFarmerSupport()}
                </div>
              )}
            </div>
          )}

          {/* Remove Account Confirmation Modal */}
          {showRemoveConfirmation && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-danger text-white">
                    <h5 className="modal-title">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Remove Farmer Account
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeRemoveConfirmation}></button>
                  </div>
                  <div className="modal-body">
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      <strong>Warning:</strong> This action cannot be undone!
                    </div>
                    <p>Are you sure you want to remove the account for:</p>
                    <div className="card bg-light">
                      <div className="card-body">
                        <p className="mb-1"><strong>Name:</strong> {farmerToRemove?.name}</p>
                        <p className="mb-1"><strong>Email:</strong> {farmerToRemove?.email}</p>
                        <p className="mb-0"><strong>ID:</strong> {farmerToRemove?.id}</p>
                      </div>
                    </div>
                    <p className="text-danger mt-3">
                      <i className="fas fa-info-circle me-1"></i>
                      This will permanently remove the farmer account and all associated data including:
                    </p>
                    <ul className="text-danger">
                      <li>Verification requests</li>
                      <li>Notifications</li>
                      <li>Profile information</li>
                      <li>All related records</li>
                    </ul>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeRemoveConfirmation}>
                      <i className="fas fa-times me-1"></i>Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => removeFarmerAccount(farmerToRemove.id)}
                    >
                      <i className="fas fa-trash me-1"></i>Remove Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Admin Modal */}
          {showCreateAdminModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      <i className="fas fa-user-plus me-2"></i>
                      Create New Admin Account
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateAdminModal(false)}></button>
                  </div>
                  <form onSubmit={handleCreateAdmin}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Username *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={newAdminData.username}
                              onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                              placeholder="Enter username"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={newAdminData.email}
                              onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                              placeholder="Enter email"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">First Name *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={newAdminData.firstName}
                              onChange={(e) => setNewAdminData({...newAdminData, firstName: e.target.value})}
                              placeholder="Enter first name"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Last Name *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={newAdminData.lastName}
                              onChange={(e) => setNewAdminData({...newAdminData, lastName: e.target.value})}
                              placeholder="Enter last name"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Role *</label>
                            <select 
                              className="form-select" 
                              value={newAdminData.role}
                              onChange={(e) => setNewAdminData({...newAdminData, role: e.target.value})}
                              required
                            >
                              <option value="Product Admin">Product Admin</option>
                              <option value="Farmer Admin">Farmer Admin</option>
                              <option value="Order Admin">Order Admin</option>
                              <option value="Finance Admin">Finance Admin</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Password *</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              value={newAdminData.password}
                              onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                              placeholder="Enter password"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Confirm Password *</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              value={newAdminData.confirmPassword}
                              onChange={(e) => setNewAdminData({...newAdminData, confirmPassword: e.target.value})}
                              placeholder="Confirm password"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Permissions</label>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canManageProducts"
                                checked={newAdminData.permissions.canManageProducts}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canManageProducts: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canManageProducts">
                                Manage Products
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canManageFarmers"
                                checked={newAdminData.permissions.canManageFarmers}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canManageFarmers: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canManageFarmers">
                                Manage Farmers
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canManageOrders"
                                checked={newAdminData.permissions.canManageOrders}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canManageOrders: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canManageOrders">
                                Manage Orders
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canManageFinance"
                                checked={newAdminData.permissions.canManageFinance}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canManageFinance: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canManageFinance">
                                Manage Finance
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canViewReports"
                                checked={newAdminData.permissions.canViewReports}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canViewReports: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canViewReports">
                                View Reports
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="canManageUsers"
                                checked={newAdminData.permissions.canManageUsers}
                                onChange={(e) => setNewAdminData({
                                  ...newAdminData, 
                                  permissions: {...newAdminData.permissions, canManageUsers: e.target.checked}
                                })}
                              />
                              <label className="form-check-label" htmlFor="canManageUsers">
                                Manage Users
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowCreateAdminModal(false)}>
                        <i className="fas fa-times me-1"></i>Cancel
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={resetNewAdminForm}>
                        <i className="fas fa-undo me-1"></i>Reset
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save me-1"></i>Create Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Admin Modal */}
          {showEditAdminModal && selectedAdminForEdit && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-warning text-dark">
                    <h5 className="modal-title">
                      <i className="fas fa-user-edit me-2"></i>
                      Edit Admin Account
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditAdminModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Username</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editAdminData.username}
                            onChange={(e) => setEditAdminData({...editAdminData, username: e.target.value})}
                            placeholder="Enter username"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            value={editAdminData.email}
                            onChange={(e) => setEditAdminData({...editAdminData, email: e.target.value})}
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editAdminData.firstName}
                            onChange={(e) => setEditAdminData({...editAdminData, firstName: e.target.value})}
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editAdminData.lastName}
                            onChange={(e) => setEditAdminData({...editAdminData, lastName: e.target.value})}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <select 
                            className="form-select" 
                            value={editAdminData.role}
                            onChange={(e) => setEditAdminData({...editAdminData, role: e.target.value})}
                          >
                            <option value="Product Admin">Product Admin</option>
                            <option value="Farmer Admin">Farmer Admin</option>
                            <option value="Order Admin">Order Admin</option>
                            <option value="Finance Admin">Finance Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select 
                            className="form-select" 
                            value={editAdminData.status}
                            onChange={(e) => setEditAdminData({...editAdminData, status: e.target.value})}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Permissions</label>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanManageProducts"
                              checked={editAdminData.permissions.canManageProducts || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canManageProducts: e.target.checked}
                              })}
                            />
                            <label className="form-check-label" htmlFor="editCanManageProducts">
                              Manage Products
                            </label>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanManageFarmers"
                              checked={editAdminData.permissions.canManageFarmers || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canManageFarmers: e.target.checked}
                              })}
                            />
                            <label className="form-check-label" htmlFor="editCanManageFarmers">
                              Manage Farmers
                            </label>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanManageOrders"
                              checked={editAdminData.permissions.canManageOrders || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canManageOrders: e.target.checked}
                              })}
                            />
                            <label className="form-check-label" htmlFor="editCanManageOrders">
                              Manage Orders
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanManageFinance"
                              checked={editAdminData.permissions.canManageFinance || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canManageFinance: e.target.checked}
                              })}
                            />
                            <label className="form-check-label" htmlFor="editCanManageFinance">
                              Manage Finance
                            </label>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanViewReports"
                              checked={editAdminData.permissions.canViewReports || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canViewReports: e.target.checked}
                              })}
                            />
                            <label className="form-check-label" htmlFor="editCanViewReports">
                              View Reports
                            </label>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="editCanManageUsers"
                              checked={editAdminData.permissions.canManageUsers || false}
                              onChange={(e) => setEditAdminData({
                                ...editAdminData, 
                                permissions: {...editAdminData.permissions, canManageUsers: e.target.checked}
                              })}
                            />
                                                         <label className="form-check-label" htmlFor="editCanManageUsers">
                               Manage Users
                             </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditAdminModal(false)}>
                      <i className="fas fa-times me-1"></i>Cancel
                    </button>
                    <button type="button" className="btn btn-warning" onClick={handleSaveEditAdmin}>
                      <i className="fas fa-save me-1"></i>Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Reset Modal */}
          {showPasswordResetModal && selectedAdminForPasswordReset && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-warning text-dark">
                    <h5 className="modal-title">
                      <i className="fas fa-key me-2"></i>
                      Reset Admin Password
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowPasswordResetModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Password Reset for:</strong> {selectedAdminForPasswordReset.firstName} {selectedAdminForPasswordReset.lastName} ({selectedAdminForPasswordReset.username})
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">New Password *</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password *</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={confirmResetPassword}
                        onChange={(e) => setConfirmResetPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordResetModal(false)}>
                      <i className="fas fa-times me-1"></i>Cancel
                    </button>
                    <button type="button" className="btn btn-warning" onClick={handleSavePasswordReset}>
                      <i className="fas fa-key me-1"></i>Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;