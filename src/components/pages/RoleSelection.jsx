import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Sell your agricultural products directly to merchants',
      icon: '🌾',
      color: 'success',
      features: [
        'List your products',
        'Get better prices',
        'Direct merchant connection',
        'Track your earnings'
      ]
    },
    {
      id: 'merchant',
      title: 'Merchant',
      description: 'Buy fresh products directly from farmers',
      icon: '🏪',
      color: 'primary',
      features: [
        'Browse farmer products',
        'No middlemen costs',
        'Quality assurance',
        'Direct farmer contact'
      ]
    }
  ];

  const handleRoleSelect = (roleId) => {
    // Store selected role in localStorage or state
    localStorage.setItem('selectedRole', roleId);
    // Navigate to signup page
    navigate('/signup');
  };

  return (
    <div className="container-fluid bg-d" style={{ 
      minHeight: '100vh', 
      // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0'
    }}>
      <div className="row text-center text-black justify-content-center align-items-center">
        <div className="col-12">
          <div className="text-centermb-5">
            <img 
              src="/agri-logo.png" 
              alt="Agri Logo" 
              width="100" 
              height="100" 
              style={{ background: 'white', borderRadius: '50%', marginBottom: '20px' }}
            />
            <h1 className="text-black fw-bold mb-3">Welcome to AgriConnect</h1>
            <p className="text-black fs-5 mb-4">Choose your role to get started</p>
            <p className="text-black-50">Connect farmers directly with merchants, eliminating middlemen</p>
          </div>

          <div className="row justify-content-center">
            {roles.map((role) => (
              <div key={role.id} className="col-md-4 col-lg-3 mb-4">
                <div 
                  className="card h-100 shadow-lg border-0" 
                  style={{ 
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="card-body text-center p-4">
                    <div 
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                      style={{
                        width: '80px',
                        height: '80px',
                        fontSize: '2.5rem',
                        background: `var(--bs-${role.color})`,
                        color: 'white'
                      }}
                    >
                      {role.icon}
                    </div>
                    
                    <h3 className="fw-bold mb-3">{role.title}</h3>
                    <p className="text-muted mb-4">{role.description}</p>
                    
                    <div className="text-start">
                      <h6 className="fw-semibold mb-3">What you can do:</h6>
                      <ul className="list-unstyled">
                        {role.features.map((feature, index) => (
                          <li key={index} className="mb-2">
                            <span className="text-success me-2">✓</span>
                            <small>{feature}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      className={`btn btn-${role.color} w-100 mt-4`}
                      style={{
                        borderRadius: '25px',
                        padding: '12px 24px',
                        fontWeight: '600'
                      }}
                    >
                      Continue as {role.title}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center  mt-5">
            <p className="text-black-50  mb-2">Already have an account?</p>
            <Link 
              to="/login" 
              className="btn cbc  text-white btn-outline-green"
              style={{ borderRadius: '25px', padding: '10px 30px' }}
            >
              LogIn Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

