import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentAdmin') || 'null');
    if (currentUser) {
      redirectToDashboard(currentUser.role);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'Super Admin':
        navigate('/super-admin');
        break;
      case 'Order Admin':
        navigate('/order-admin');
        break;
      case 'Finance Admin':
        navigate('/finance-admin');
        break;
      case 'Product Admin':
        navigate('/product-admin');
        break;
      default:
        navigate('/admin-dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get stored admin credentials
      const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

      // Find admin by username
      const admin = adminUsers.find(a => a.username === credentials.username);
      
      if (!admin) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Check if admin is active
      if (admin.status !== 'Active') {
        setError('Account is deactivated. Please contact Super Admin.');
        setLoading(false);
        return;
      }

      // Check password
      const storedPassword = adminCredentials[credentials.username]?.password;
      if (storedPassword !== credentials.password) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Update last login
      const updatedAdmin = { ...admin, lastLogin: new Date().toISOString().split('T')[0] };
      const updatedAdminUsers = adminUsers.map(a => a.id === admin.id ? updatedAdmin : a);
      localStorage.setItem('adminUsers', JSON.stringify(updatedAdminUsers));

      // Store current admin session
      const currentAdmin = {
        id: admin.id,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));

      // Redirect to appropriate dashboard
      redirectToDashboard(admin.role);

    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    navigate('/admin-login');
  };

  return (
    <div className="admin-login-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="login-card" style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div className="login-header" style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#2c3e50', 
            marginBottom: '10px',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Admin Login
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer" style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e8ed',
          color: '#7f8c8d',
          fontSize: '14px'
        }}>
          <p>Need help? Contact your Super Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
