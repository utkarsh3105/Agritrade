import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/Home.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'farmer'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get selected role from localStorage
  useEffect(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        userType: selectedRole
      }));
      setShowRoleSelection(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'User ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      userType: role
    }));
    localStorage.setItem('selectedRole', role);
    setShowRoleSelection(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (validateForm()) {
      setIsLoading(true);
      
      // Use immediate execution instead of setTimeout to avoid potential issues
      const userId = formData.email.trim();
      const password = formData.password;
        
      // First, check if it's an admin login
      let adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
      let adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      
      // Auto-create default admin accounts if they don't exist
      if (adminUsers.length === 0 || !adminUsers.find(admin => admin.username === 'Utkarsh')) {
        // Create Utkarsh (Order Admin) account
        const princeAdmin = {
          id: 1001,
          username: 'Utkarsh',
          firstName: 'Utkarsh',
          lastName: 'Gupta',
          email: 'utk@agritrade.com',
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
        
        adminUsers.push(princeAdmin);
        localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
        
        // Store credentials
        adminCredentials['Utkarsh'] = {
          password: 'softpro',
          role: 'Order Admin'
        };
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
        
        console.log('Auto-created Order Admin account: Utkarsh/softpro');
      }
      
      // Find admin by username
      const admin = adminUsers.find(a => a.username === userId);
      
      if (admin && adminCredentials[userId]?.password === password) {
        // Admin login successful
        if (admin.status !== 'Active') {
          setLoginError('Account is deactivated. Please contact Super Admin.');
          setIsLoading(false);
          return;
        }
        
        // Create admin user object
        const adminUser = {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions
        };
        
        // Update the AuthContext state
        login(adminUser);
        
        // Update last login
        const updatedAdmin = { ...admin, lastLogin: new Date().toISOString().split('T')[0] };
        const updatedAdminUsers = adminUsers.map(a => a.id === admin.id ? updatedAdmin : a);
        localStorage.setItem('adminUsers', JSON.stringify(updatedAdminUsers));
        
        // Redirect based on admin role
        switch (admin.role) {
          case 'Order Admin':
            navigate('/order-admin');
            break;
          case 'Finance Admin':
            navigate('/finance-admin');
            break;
          case 'Product Admin':
            navigate('/product-admin');
            break;
          case 'admin': // Super Admin
            navigate('/super-admin');
            break;
          default:
            navigate('/admin-dashboard');
        }
        
        localStorage.removeItem('selectedRole');
        setIsLoading(false);
        return;
      }
      
      // If not admin, check regular user credentials and hardcoded Super Admin
      const isSuperAdminLogin = userId === 'utkarsh' && password === 'softpro';
      const isFarmerLogin = userId === 'tanmay' && password === 'softpro';
      const isMerchantLogin = userId === 'softpro' && password === 'softpro';
      
      if (isSuperAdminLogin || isFarmerLogin || isMerchantLogin) {
        const mockUser = {
          id: 1,
          firstName: isSuperAdminLogin ? 'utkarsh' : isMerchantLogin ? 'Softpro' : 'Super',
          lastName: '',
          email: formData.email,
          role: isSuperAdminLogin ? 'admin' : isMerchantLogin ? 'merchant' : 'farmer'
        };
        
        login(mockUser);
        
        // Route users to their respective dashboards based on role
        if (mockUser.role === 'admin') {
          // Super Admin goes to super admin dashboard
          navigate('/super-admin');
        } else if (mockUser.role === 'farmer') {
          const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
          let farmerRequest = verificationRequests.find(req => req.farmerId === mockUser.id);
          
          if (farmerRequest && farmerRequest.status === 'approved') {
            // If farmer is approved, go directly to farmer dashboard
            navigate('/farmer-dashboard');
          } else {
            // If no request or not approved, go to verification page
            navigate('/farmer-verification');
          }
        } else if (mockUser.role === 'merchant') {
          // Merchant goes to new merchant admin dashboard with softpro ID
          navigate('/merchant-dashboard/softpro');
        }
        
        localStorage.removeItem('selectedRole');
      } else {
        setLoginError('Invalid ID or password. Available accounts: Super Admin (utkarsh/softpro), Order Admin (Utkarsh/softpro), Farmer (tanmay/softpro), Merchant (softpro/softpro)');
      }
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Sell your agricultural products directly to merchants',
      icon: '🌾',
      color: '#28a745'
    },
    {
      id: 'merchant',
      title: 'Merchant',
      description: 'Buy quality products from verified farmers',
      icon: '🏪',
      color: '#007bff'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage and oversee the marketplace operations',
      icon: '⚙️',
      color: '#6c757d'
    }
  ];

  if (showRoleSelection) {
    return (
      <div className="container-fluid" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 0'
      }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <img 
                src="/agri-logo.png" 
                alt="Agri Logo" 
                width="100" 
                height="100" 
                style={{ background: 'white', borderRadius: '50%', marginBottom: '20px' }}
              />
              <h1 className="fw-bold text-white mb-3">Welcome Back!</h1>
              <p className="text-white-50 fs-5">Choose your role to continue</p>
            </div>
            
            <div className="row g-4">
              {roles.map((role) => (
                <div key={role.id} className="col-md-4">
                  <div 
                    className="card h-100 shadow-lg border-0" 
                    style={{ 
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `3px solid transparent`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.borderColor = role.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="card-body text-center p-4">
                      <div 
                        className="mb-3" 
                        style={{ 
                          fontSize: '3rem',
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
                        }}
                      >
                        {role.icon}
                      </div>
                      <h4 className="fw-bold mb-2" style={{ color: role.color }}>
                        {role.title}
                      </h4>
                      <p className="text-muted mb-0">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white-50 mb-0">
                Don't have an account?{' '}
                <Link to="/role-selection" className="text-white text-decoration-none fw-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-d mb-5" style={{ 

      padding: '20px 0'
    }}>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body cbc p-5">
              <div className="text-center mb-4">
                <img 
                  src="/agri-logo.png" 
                  alt="Agri Logo" 
                  width="80" 
                  height="80" 
                  style={{ borderRadius: '50%', marginBottom: '20px' }}
                />
                <h2 className="fw-bold text-white">Welcome Back</h2>
                <p className="text-white">Sign in to your account</p>
                

                

              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">User ID</label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your user ID (utkarsh)"
                    disabled={isLoading}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                {loginError && <div className="alert alert-danger py-2">{loginError}</div>}

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 mb-3" 
                  style={{ 
                    backgroundColor: '#2E7D32', 
                    border: 'none', 
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      loging In...
                    </>
                  ) : (
                    'login'
                  )}
                </button>

                <div className="text-center mb-3">
                  <Link to="/forgot-password" className="underline-animate fw-semibold" style={{ color: '#ffffffff' }}>
                    Forgot your password?
                  </Link>
                </div>

                <div className="text-center">
                  <p className="mb-0 text-black">
                    Don't have an account?{' '}
                    <Link to="/signup" className="underline-animate fw-semibold" style={{ color: '#ffffffff' }}>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
