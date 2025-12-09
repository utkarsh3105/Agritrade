import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FarmerVerification = () => {
  const [formData, setFormData] = useState({
    products: '',
    quantity: '',
    landArea: '',
    address: '',
    village: '',
    aadharNumber: '',
    productsGrown: '',
    additionalInfo: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if farmer already has a verification request
    const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
    
    const farmerRequest = verificationRequests.find(req => req.farmerId === user?.id);
    
    if (farmerRequest) {
      if (farmerRequest.status === 'approved') {
        // If approved, go directly to dashboard
        navigate('/farmer-dashboard');
      } else {
        // If pending or rejected, show status page
        setExistingRequest(farmerRequest);
      }
    }
    // If no request exists, show the form (default behavior)
  }, [user?.id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.products.trim()) {
      newErrors.products = 'Products to sell is required';
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }
    if (!formData.landArea.trim()) {
      newErrors.landArea = 'Land area is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.village.trim()) {
      newErrors.village = 'Village name is required';
    }
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }
    if (!formData.productsGrown.trim()) {
      newErrors.productsGrown = 'Products grown is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
        const newRequest = {
          id: Date.now(),
          farmerId: user?.id,
          farmerName: `${user?.firstName} ${user?.lastName}`,
          farmerEmail: user?.email,
          ...formData,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          read: false
        };
        
        verificationRequests.push(newRequest);
        localStorage.setItem('verificationRequests', JSON.stringify(verificationRequests));
        
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        const notification = {
          id: Date.now(),
          type: 'farmer_verification',
          title: 'New Farmer Verification Request',
          message: `${user?.firstName} ${user?.lastName} has submitted a verification request`,
          timestamp: new Date().toISOString(),
          read: false,
          farmerId: user?.id,
          verificationId: newRequest.id
        };
        
        adminNotifications.push(notification);
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setExistingRequest(newRequest);
      }, 2000);
    }
  };

     // Show approval status if request already exists
   if (existingRequest) {
     return (
       <div className="container-fluid" style={{ 
         minHeight: '100vh', 
         background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
         padding: '20px 0'
       }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 text-center" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                {existingRequest.status === 'pending' && (
                  <>
                    <div className="mb-4">
                      <i className="fas fa-clock text-warning" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="fw-bold text-warning mb-3">Waiting for Approval</h2>
                    <p className="text-muted mb-4">
                      Your verification request is currently under review by our admin team.
                    </p>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>What happens next?</strong>
                      <ul className="mb-0 mt-2 text-start">
                        <li>Admin will review your details</li>
                        <li>You'll receive approval or rejection notification</li>
                        <li>Upon approval, you can access the farmer dashboard</li>
                      </ul>
                    </div>
                  </>
                )}

                {existingRequest.status === 'rejected' && (
                  <>
                    <div className="mb-4">
                      <i className="fas fa-times-circle text-danger" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="fw-bold text-danger mb-3">Verification Rejected</h2>
                    <p className="text-muted mb-4">
                      Your verification request has been rejected. Please contact admin for more information.
                    </p>
                    <div className="alert alert-danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      <strong>Next Steps:</strong>
                      <ul className="mb-0 mt-2 text-start">
                        <li>Contact admin for clarification</li>
                        <li>Update your information if needed</li>
                        <li>Resubmit verification request</li>
                      </ul>
                    </div>
                  </>
                )}

                                 <div className="mt-4">
                                       <button 
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => {
                        // Clear user session and go to login
                        localStorage.removeItem('user');
                        navigate('/login');
                      }}
                    >
                      Back to Login
                    </button>
                                       {existingRequest.status === 'rejected' && (
                      <button 
                        className="btn btn-outline-primary w-100 mb-2"
                        onClick={() => {
                          // Remove the rejected request so farmer can submit new one
                          const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
                          const updatedRequests = verificationRequests.filter(req => req.farmerId !== user?.id);
                          localStorage.setItem('verificationRequests', JSON.stringify(updatedRequests));
                          
                          // Reset state to show form
                          setExistingRequest(null);
                          setIsSubmitted(false);
                        }}
                      >
                        Update Information
                      </button>
                    )}
                   
                   
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

     // Show success message after submission
   if (isSubmitted) {
     return (
       <div className="container-fluid" style={{ 
         minHeight: '100vh', 
         background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
         padding: '20px 0'
       }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 text-center" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="fw-bold text-success mb-3">Details Submitted Successfully!</h2>
                <p className="text-muted mb-4">
                  Your verification request has been sent to our admin team. 
                  We will review your details and contact you soon.
                </p>
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>What happens next?</strong>
                  <ul className="mb-0 mt-2 text-start">
                    <li>Admin will review your details</li>
                    <li>You'll receive approval or rejection notification</li>
                    <li>Upon approval, you can access the farmer dashboard</li>
                  </ul>
                </div>
                                 <button 
                   className="btn btn-success w-100"
                   style={{ backgroundColor: '#2E7D32', border: 'none' }}
                   onClick={() => {
                     // Redirect to login, and when they login again, they'll see "Waiting for Approval"
                     navigate('/login');
                   }}
                 >
                   Back to Login
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

     // Modern form design (less form-like)
   return (
     <div className="container-fluid" style={{ 
       minHeight: '100vh', 
       background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
       padding: '20px 0'
     }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body p-5">
                             <div className="text-center mb-5">
                 <img 
                   src="/agri-logo.png" 
                   alt="Agri Logo" 
                   width="80" 
                   height="80" 
                   style={{ background: 'white', borderRadius: '50%', marginBottom: '20px' }}
                 />
                 <h2 className="fw-bold text-dark mb-2">Farmer Verification</h2>
                 <p className="text-muted">Tell us about your farming details</p>
                                   <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Important:</strong> This information will be reviewed by our admin team to verify your farmer status.
                  </div>
                  
                  
                 
                 
               </div>

              <form onSubmit={handleSubmit}>
                {/* Products Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 bg-light" style={{ borderRadius: '12px' }}>
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">
                          <i className="fas fa-seedling text-success me-2"></i>
                          Products & Quantity
                        </h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              What products do you want to sell? <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.products ? 'is-invalid' : ''}`}
                              name="products"
                              value={formData.products}
                              onChange={handleChange}
                              placeholder="e.g., Wheat, Rice, Corn"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.products && <div className="invalid-feedback">{errors.products}</div>}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              How much quantity do you have? <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleChange}
                              placeholder="e.g., 1000 kg"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Land & Location Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 bg-light" style={{ borderRadius: '12px' }}>
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">
                          <i className="fas fa-map-marker-alt text-primary me-2"></i>
                          Land & Location Details
                        </h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              How much land do you have? <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.landArea ? 'is-invalid' : ''}`}
                              name="landArea"
                              value={formData.landArea}
                              onChange={handleChange}
                              placeholder="e.g., 5 acres"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.landArea && <div className="invalid-feedback">{errors.landArea}</div>}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              Your Aadhar Number <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.aadharNumber ? 'is-invalid' : ''}`}
                              name="aadharNumber"
                              value={formData.aadharNumber}
                              onChange={handleChange}
                              placeholder="12-digit Aadhar number"
                              maxLength="12"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.aadharNumber && <div className="invalid-feedback">{errors.aadharNumber}</div>}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Your complete address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your complete address"
                            rows="3"
                            style={{ borderRadius: '8px' }}
                          ></textarea>
                          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              Village name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.village ? 'is-invalid' : ''}`}
                              name="village"
                              value={formData.village}
                              onChange={handleChange}
                              placeholder="Enter village name"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.village && <div className="invalid-feedback">{errors.village}</div>}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              What do you grow? <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.productsGrown ? 'is-invalid' : ''}`}
                              name="productsGrown"
                              value={formData.productsGrown}
                              onChange={handleChange}
                              placeholder="e.g., Wheat, Rice, Vegetables"
                              style={{ borderRadius: '8px' }}
                            />
                            {errors.productsGrown && <div className="invalid-feedback">{errors.productsGrown}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 bg-light" style={{ borderRadius: '12px' }}>
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">
                          <i className="fas fa-info-circle text-info me-2"></i>
                          Additional Information
                        </h5>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Tell us more about your farming
                          </label>
                          <textarea
                            className="form-control"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Any additional information about your farming practices, certifications, experience, etc."
                            rows="3"
                            style={{ borderRadius: '8px' }}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                                     <button 
                     type="submit" 
                     className="btn btn-success btn-lg px-5" 
                     style={{ 
                       backgroundColor: '#2E7D32', 
                       border: 'none', 
                       padding: '15px 40px',
                       fontSize: '18px',
                       fontWeight: '600',
                       borderRadius: '12px'
                     }}
                     disabled={isSubmitting}
                   >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit for Verification
                      </>
                    )}
                  </button>

                  <div className="mt-3">
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/login')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerVerification;
