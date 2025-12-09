import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'farmer' // farmer, merchant, admin
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Get selected role from localStorage
  useEffect(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        userType: selectedRole
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically make an API call to register the user
      console.log('Form submitted:', formData);
      // Clear the selected role from localStorage
      localStorage.removeItem('selectedRole');
      // Navigate to login
      navigate('/login');
    }
  };

  return (
    <div className="container-fluid bg-d mb-0" style={{ 
 
     
      padding: '50px 0'
    }}>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card cbc shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body p-5">
                             <div className="text-center mb-4">
                 <img 
                   src="/agri-logo.png" 
                   alt="Agri Logo" 
                   width="80" 
                   height="80" 
                   style={{  borderRadius: '50%', marginBottom: '20px' }}
                 />
                 <h2 className="fw-bold text-white mb-2">Create Account</h2>
                 <p className="text-black">Join our agricultural community</p>
                 {formData.userType && (
                   <div className="mt-3">
                     <span className={`badge fs-6 px-3 py-2`} style={{ 
                       backgroundColor: formData.userType === 'farmer' ? '#2E7D32' : formData.userType === 'merchant' ? '#1976D2' : '#424242',
                       color: 'white'
                     }}>
                       {formData.userType === 'farmer' ? '🌾' : formData.userType === 'merchant' ? '🏪' : '⚙️'} 
                       {formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)}
                     </span>
                   </div>
                 )}
               </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                  <div className="mb-3">
                   <label htmlFor="userType" className="form-label fw-semibold">I am a:</label>
                   <select
                     className="form-select"
                     id="userType"
                     name="userType"
                     value={formData.userType}
                     onChange={handleChange}
                   >
                     <option value="farmer">Farmer</option>
                     <option value="merchant">Merchant</option>
                   </select>
                 </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3" style={{ 
                  backgroundColor: '#2E7D32', 
                  border: 'none', 
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Create Account
                </button>

                <div className="text-center">
                  <p className="mb-0 text-black">
                    Already have an account?{' '}
                    <Link to="/login" className="underline-animate fw-semibold" style={{ color: '#ffffffff' }}>
                      Sign In
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

export default SignUp;
