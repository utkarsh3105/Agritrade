import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const navItems = [
  { label: 'Home', to: '/', dropDown: true },
  { label: 'Commodities', to: '#', isCommodities: true },
  { label: 'About Us', to: '/about' },
  { isLogo: true },
  { label: 'Contact Us', to: '/Contact' },
  { label: 'Signup', to: '/role-selection' },
  { label: 'Login', to: '/login' },
];

const commodityCategories = [
  'Cotton', 'Grains', 'Guar', 'Oilmeal', 'Oilseed', 'Pulses', 'Spices', 'Sugar', 'Vegoils'
];

const commodityData = {
  Cotton: ['Cotton'],
  Grains: ['Maize (Corn)', 'Rice', 'Wheat'],
  Guar: ['Guar Gum', 'Guar Seed'],
  Oilmeal: ['Rapeseed Meal', 'Soymeal'],
  Oilseed: ['Groundnut (Peanut)', 'Rapeseed (Mustard Seed)', 'Soyabean'],
  Pulses: ['Chana (Chickpeas)', 'Masoor (Lentils)', 'Moong (Mung Bean)', 'Peas', 'Tur (Pigeon Pea)', 'Urad (Black Matpe)'],
  Spices: ['Black Pepper', 'Cardamom', 'Coriander', 'Jeera (Cumin Seed)', 'Red Chillies', 'Turmeric'],
  Sugar: ['Sugar'],
  Vegoils: ['Vegoils'],
};

const ALL = 'All Commodities';

// Helper: For All Commodities, split categories into 3 columns, top-to-bottom
function getColumnsForAllCommodities(numCols = 3) {
  const entries = Object.entries(commodityData);
  const columns = Array.from({ length: numCols }, () => []);
  // Distribute categories top-to-bottom, then left-to-right
  entries.forEach(([cat, items], idx) => {
    columns[idx % numCols].push([cat, items]);
  });
  return columns;
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  // Helper: get categories to show in right grid
  const getGridContent = () => {
    if (selectedCategory === ALL) {
      return getColumnsForAllCommodities(3);
    } else {
      return [[[selectedCategory, commodityData[selectedCategory]]]];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'farmer':
        return '/farmer-dashboard';
      case 'merchant':
        return '/merchant-dashboard';
      case 'admin':
        return '/super-admin';
      case 'Order Admin':
        return '/order-admin';
      case 'Finance Admin':
        return '/finance-admin';
      case 'Product Admin':
        return '/product-admin';
      default:
        return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'farmer':
        return 'Farmer Dashboard';
      case 'merchant':
        return 'Merchant Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'Order Admin':
        return 'Order Admin Dashboard';
      case 'Finance Admin':
        return 'Finance Admin Dashboard';
      case 'Product Admin':
        return 'Product Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Get navigation items based on authentication status
  const getNavItems = () => {
    if (isAuthenticated()) {
      return [
        { label: 'Home', to: '/', dropDown: true },
        { label: 'Commodities', to: '#', isCommodities: true },
        { label: 'About Us', to: '/about' },
        { isLogo: true },
        { label: 'Contact Us', to: '/Contact us' },
        { label: getDashboardLabel(), to: getDashboardLink() },
        { label: 'Logout', to: '#', isLogout: true },
      ];
    }
    return navItems;
  };

  const currentNavItems = getNavItems();

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #eee', width: '100%', padding: '0 40px' }}>
      <nav style={{ width: '100%', background: '#fff', padding: '40px 0', position: 'relative' }}>
        <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
          {currentNavItems.map((item, idx) =>
            item.isLogo ? (
              <div key="logo" className="d-flex flex-column align-items-center justify-content-end" style={{ minWidth: 100 }}>
                <img src="/agri-logo.png" alt="AgriTrade" style={{ width: 110, marginBottom: 4 }} />
                <span className="fw-bold text-uppercase text-center" style={{ color: '#184c3a', letterSpacing: 1, fontSize: '1.1rem', lineHeight: 1 }}>
                  AGRITRADE
                </span>
              </div>
            ) : item.isCommodities ? (
              <div
                key={item.label}
                className="d-flex flex-column align-items-center flex-grow-1 position-relative"
                style={{ minWidth: 0 }}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <span
                  className={styles.navLinkButton}
                  style={{ opacity: 1, cursor: 'pointer', marginTop: 0 }}
                >
                  {item.label}
                </span>
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      display: 'flex',
                      background: '#f8fdfa',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      minWidth: 700,
                      minHeight: 320,
                      marginTop: 8,
                    }}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    {/* Left: Categories */}
                    <div style={{ minWidth: 180, borderRight: '1px solid #e0e0e0', background: '#eaf6f2' }}>
                      <ul className="list-unstyled mb-0" style={{ padding: 0 }}>
                        <li
                          onMouseEnter={() => setSelectedCategory(ALL)}
                          style={{
                            fontWeight: selectedCategory === ALL ? 600 : 400,
                            color: selectedCategory === ALL ? '#1a7f6b' : '#222',
                            background: selectedCategory === ALL ? '#d6f0e6' : '#eaf6f2',
                            padding: '12px 18px',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          {ALL}
                        </li>
                        {commodityCategories.map((cat) => (
                          <li
                            key={cat}
                            onMouseEnter={() => setSelectedCategory(cat)}
                            style={{
                              cursor: 'pointer',
                              background: selectedCategory === cat ? '#d6f0e6' : 'transparent',
                              color: selectedCategory === cat ? '#1a7f6b' : '#222',
                              fontWeight: selectedCategory === cat ? 600 : 400,
                              padding: '10px 18px',
                              transition: 'background 0.2s',
                            }}
                          >
                            {cat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Right: Items grid */}
                    <div style={{ padding: '24px 32px', minWidth: 520, display: 'flex', gap: '0 48px' }}>
                      {getGridContent().map((col, colIdx) => (
                        <div key={colIdx} style={{ minWidth: 150, marginBottom: 16 }}>
                          {col.map(([cat, items]) => (
                            <div key={cat} style={{ marginBottom: 16 }}>
                              <div style={{ fontWeight: 700, marginBottom: 8 }}>{cat}</div>
                              {items.map((item) => (
                                <div key={item} style={{ fontWeight: 400, marginBottom: 4 }}>{item}</div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : item.isLogout ? (
              <div key={item.label} className="d-flex flex-column align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                <button
                  onClick={handleLogout}
                  className={styles.navLinkButton}
                  style={{
                    opacity: 0.85,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              </div>
            ) : (
              <div key={item.label} className="d-flex flex-column align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                <Link
                  to={item.to}
                  className={styles.navLinkButton}
                  style={{
                    opacity: location.pathname === item.to ? 1 : 0.85,
                  }}
                >
                  {item.label}
                </Link>
              </div>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
