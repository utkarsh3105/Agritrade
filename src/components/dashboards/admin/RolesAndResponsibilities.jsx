import React from 'react';

const ROLES = [
  {
    key: 'super',
    label: 'Super Admin',
    responsibilities: [
      'Full access to all dashboard features',
      'Manage users',
      'Manage products',
      'View and manage transactions',
      'View and generate reports'
    ]
  },
  {
    key: 'product',
    label: 'Product Admin',
    responsibilities: [
      'Add new products',
      'Remove products',
      'View product list'
    ]
  },

  {
    key: 'farmer',
    label: 'Farmer Admin',
    responsibilities: [
      'Approve/reject farmer verification requests',
      'Manage farmer profiles and accounts',
      'Add/edit/remove farmer accounts',
      'Manage all platform users (farmers and regular users)',
      'View user statistics and reports',
      'Provide farmer and user support',
      'User account management and administration'
    ]
  },

];

const RolesAndResponsibilities = ({ onClose }) => (
  <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Roles & Responsibilities</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {ROLES.map(role => (
            <div key={role.key} className="mb-3">
              <h6>{role.label}</h6>
              <ul>
                {role.responsibilities.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
              {/* For Super Admin, show all actions as enabled */}
              {role.key === 'super' && (
                <div className="mt-2">
                  <span className="badge bg-success me-2">Can Add/Remove Products</span>
                  <span className="badge bg-success me-2">Can Add/Remove Users</span>
                  <span className="badge bg-success me-2">Can Add/Remove Transactions</span>
                  <span className="badge bg-success me-2">Can Add/Remove Reports</span>
                  <span className="badge bg-success">Can View/Generate All</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

export default RolesAndResponsibilities;
