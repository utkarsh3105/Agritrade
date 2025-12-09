import React, { useState } from 'react';
import { useMerchant } from './MerchantContext';

const MerchantProfile = () => {
  const { profileData, updateProfile, quickActions } = useMerchant();
  const [localProfileData, setLocalProfileData] = useState(profileData);

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setLocalProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateProfile(localProfileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalProfileData(profileData);
    setIsEditing(false);
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Merchant Profile</h2>
        {!isEditing ? (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </button>
        ) : (
          <div>
            <button 
              className="btn btn-success me-2"
              onClick={handleSave}
            >
              <i className="bi bi-check me-2"></i>
              Save
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              <i className="bi bi-x me-2"></i>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Summary Card */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="position-relative">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                  style={{width: '80px', height: '80px', fontSize: '32px'}}
                >
                  <i className="bi bi-person"></i>
                </div>
                <div 
                  className="position-absolute bottom-0 end-0 bg-success rounded-circle d-flex align-items-center justify-content-center"
                  style={{width: '24px', height: '24px'}}
                >
                  <i className="bi bi-check text-white" style={{fontSize: '12px'}}></i>
                </div>
              </div>
            </div>
            <div className="col">
              <h4 className="fw-bold mb-1">{profileData.fullName}</h4>
              <p className="text-muted mb-1">{profileData.businessName}</p>
              <p className="text-muted mb-0">{profileData.businessType}</p>
            </div>
            <div className="col-auto text-end">
              <div className="row g-4">
                <div className="col-auto text-center">
                  <h4 className="fw-bold mb-0">{profileData.totalSales}</h4>
                  <small className="text-muted">Total Sales</small>
                </div>
                <div className="col-auto text-center">
                  <h4 className="fw-bold mb-0">{profileData.totalOrders}</h4>
                  <small className="text-muted">Orders</small>
                </div>
                <div className="col-auto text-center">
                  <h4 className="fw-bold mb-0 d-flex align-items-center">
                    {profileData.rating}
                    <i className="bi bi-star-fill text-warning ms-1" style={{fontSize: '16px'}}></i>
                  </h4>
                  <small className="text-muted">Rating</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Personal Information</h5>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={localProfileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.fullName}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.email}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.phone}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Address</label>
              {isEditing ? (
                <textarea
                  className="form-control"
                  rows="1"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Business Information</h5>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Business Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profileData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.businessName}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Business Type</label>
              {isEditing ? (
                <select
                  className="form-select"
                  value={profileData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  <option value="Agricultural Supplies">Agricultural Supplies</option>
                  <option value="Agricultural Trading">Agricultural Trading</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Wholesale Distribution">Wholesale Distribution</option>
                </select>
              ) : (
                <p className="fw-semibold mb-0">{profileData.businessType}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profileData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.gstNumber}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">PAN Number</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profileData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.panNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banking Information */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Banking Information</h5>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">Bank Account</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profileData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.bankAccount}</p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label text-muted">IFSC Code</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profileData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                />
              ) : (
                <p className="fw-semibold mb-0">{profileData.ifscCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Account Status</h5>
          <div className="row">
            <div className="col-md-4 mb-4">
              <label className="form-label text-muted">Verification</label>
              <div className="d-flex align-items-center">
                <span className="badge bg-success text-white me-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {profileData.verification}
                </span>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <label className="form-label text-muted">Member Since</label>
              <p className="fw-semibold mb-0">{profileData.memberSince}</p>
            </div>
            <div className="col-md-4 mb-4">
              <label className="form-label text-muted">Account Type</label>
              <p className="fw-semibold mb-0 text-primary">{profileData.accountType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Quick Actions</h5>
          <div className="row text-center">
            <div className="col">
              <button 
                className="btn btn-light w-100 h-100 p-4 border-0" 
                style={{borderRadius: '12px'}}
                onClick={quickActions.viewAnalytics}
              >
                <i className="bi bi-bar-chart text-primary d-block mb-2" style={{fontSize: '32px'}}></i>
                <div className="fw-medium">View Analytics</div>
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-light w-100 h-100 p-4 border-0" 
                style={{borderRadius: '12px'}}
                onClick={quickActions.manageProducts}
              >
                <i className="bi bi-box text-primary d-block mb-2" style={{fontSize: '32px'}}></i>
                <div className="fw-medium">Manage Products</div>
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-light w-100 h-100 p-4 border-0" 
                style={{borderRadius: '12px'}}
                onClick={quickActions.viewOrders}
              >
                <i className="bi bi-clipboard-check text-primary d-block mb-2" style={{fontSize: '32px'}}></i>
                <div className="fw-medium">View Orders</div>
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-light w-100 h-100 p-4 border-0" 
                style={{borderRadius: '12px'}}
                onClick={quickActions.paymentHistory}
              >
                <i className="bi bi-currency-rupee text-primary d-block mb-2" style={{fontSize: '32px'}}></i>
                <div className="fw-medium">Payment History</div>
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-light w-100 h-100 p-4 border-0" 
                style={{borderRadius: '12px'}}
                onClick={quickActions.securitySettings}
              >
                <i className="bi bi-shield-lock text-primary d-block mb-2" style={{fontSize: '32px'}}></i>
                <div className="fw-medium">Security Settings</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantProfile;
