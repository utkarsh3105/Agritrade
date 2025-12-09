import React from 'react';

const Sidebar = ({ isOpen, onClose, onMenuClick }) => {
  const menuItems = [
    {
      id: 'profile',
      icon: 'bi bi-person',
      label: 'Merchant Profile',
      action: () => onMenuClick('profile')
    },
    {
      id: 'cart',
      icon: 'bi bi-cart',
      label: 'Cart',
      action: () => onMenuClick('cart')
    },
    {
      id: 'analytics',
      icon: 'bi bi-bar-chart',
      label: 'Analytics',
      action: () => onMenuClick('analytics')
    },
    {
      id: 'sampling',
      icon: 'bi bi-gift',
      label: 'Product Sampling',
      action: () => onMenuClick('sampling')
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div className="position-fixed top-0 start-0 h-100 bg-white shadow-lg" 
           style={{width: '320px', zIndex: 1050, transition: 'transform 0.3s ease'}}>
        
        {/* Sidebar Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">Quick Access</h5>
          <button className="btn btn-link p-0 text-muted" onClick={onClose}>
            <i className="bi bi-x-lg" style={{fontSize: '18px'}}></i>
          </button>
        </div>

        {/* Green Accent Bar */}
        <div style={{height: '4px', backgroundColor: '#28a745'}}></div>

        {/* Menu Items */}
        <div className="p-3">
          {menuItems.map(item => (
            <div key={item.id} className="mb-2">
              <button
                className="btn btn-link w-100 text-start p-3 border-0 text-decoration-none"
                onClick={item.action}
                style={{
                  color: '#6c757d',
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.color = '#495057';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                <div className="d-flex align-items-center">
                  <i className={`${item.icon} me-3`} style={{fontSize: '18px'}}></i>
                  <span className="fw-medium">{item.label}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{zIndex: 1040}}
        onClick={onClose}
      ></div>
    </>
  );
};

export default Sidebar;
