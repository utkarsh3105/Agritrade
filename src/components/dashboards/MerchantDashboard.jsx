import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../common/Notification';

const MerchantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load merchant notifications (empty for now, can be extended later)
    const merchantNotifications = JSON.parse(localStorage.getItem('merchantNotifications') || '[]');
    setNotifications(merchantNotifications);
  }, []);

  const handleMarkNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('merchantNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('merchantNotifications', JSON.stringify(updatedNotifications));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const mockAvailableProducts = [
    { id: 1, farmer: 'John Doe', product: 'Wheat', quantity: '500kg', price: '₹25/kg', location: 'Punjab', rating: 4.5 },
    { id: 2, farmer: 'Jane Smith', product: 'Rice', quantity: '300kg', price: '₹35/kg', location: 'Haryana', rating: 4.8 },
    { id: 3, farmer: 'Mike Johnson', product: 'Corn', quantity: '200kg', price: '₹20/kg', location: 'UP', rating: 4.2 },
    { id: 4, farmer: 'Sarah Wilson', product: 'Pulses', quantity: '150kg', price: '₹45/kg', location: 'MP', rating: 4.6 },
  ];

  const mockMyOrders = [
    { id: 1, farmer: 'John Doe', product: 'Wheat', quantity: '100kg', amount: '₹2,500', status: 'Pending', date: '2024-01-15' },
    { id: 2, farmer: 'Jane Smith', product: 'Rice', quantity: '150kg', amount: '₹5,250', status: 'Completed', date: '2024-01-10' },
    { id: 3, farmer: 'Mike Johnson', product: 'Corn', quantity: '75kg', amount: '₹1,500', status: 'In Transit', date: '2024-01-12' },
  ];

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row bg-primary text-white p-3 mb-4">
        <div className="col-md-6">
          <h2>Merchant Dashboard</h2>
          <p className="mb-0">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="col-md-6 text-end d-flex align-items-center justify-content-end gap-3">
          <Notification 
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onDelete={handleDeleteNotification}
          />
          <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                My Orders
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Orders</h5>
                    <h3>{mockMyOrders.length}</h3>
                    <p className="mb-0">This month</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Spent This Month</h5>
                    <h3>₹9,250</h3>
                    <p className="mb-0">Total purchases</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <h5 className="card-title">Active Orders</h5>
                    <h3>2</h3>
                    <p className="mb-0">In progress</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Farmers Connected</h5>
                    <h3>8</h3>
                    <p className="mb-0">Direct suppliers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Available Products from Farmers</h5>
                <div>
                  <input type="text" className="form-control d-inline-block me-2" placeholder="Search products..." style={{width: '200px'}} />
                  <select className="form-select d-inline-block" style={{width: '150px'}}>
                    <option>All Products</option>
                    <option>Wheat</option>
                    <option>Rice</option>
                    <option>Corn</option>
                    <option>Pulses</option>
                  </select>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  {mockAvailableProducts.map(product => (
                    <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{product.product}</h6>
                          <p className="card-text">
                            <small className="text-muted">Farmer: {product.farmer}</small><br/>
                            <small className="text-muted">Location: {product.location}</small><br/>
                            <strong>Quantity: {product.quantity}</strong><br/>
                            <strong className="text-success">Price: {product.price}</strong>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="text-warning">★ {product.rating}</span>
                            </div>
                            <button className="btn btn-primary btn-sm">Place Order</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">My Orders</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Farmer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMyOrders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.farmer}</td>
                          <td>{order.product}</td>
                          <td>{order.quantity}</td>
                          <td>{order.amount}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'Completed' ? 'bg-success' : 
                              order.status === 'In Transit' ? 'bg-info' : 'bg-warning'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.date}</td>
                          <td>
                            <button className="btn btn-sm btn-primary me-2">Track</button>
                            <button className="btn btn-sm btn-success">Rate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Purchase Analytics</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <h4 className="text-primary">₹9,250</h4>
                        <p>This Month</p>
                      </div>
                      <div className="col-md-4">
                        <h4 className="text-success">₹28,500</h4>
                        <p>Last 3 Months</p>
                      </div>
                      <div className="col-md-4">
                        <h4 className="text-info">₹1,85,000</h4>
                        <p>Total Spent</p>
                      </div>
                    </div>
                    <hr/>
                    <h6>Top Products Purchased</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p>Wheat - 45%</p>
                        <div className="progress mb-2">
                          <div className="progress-bar" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p>Rice - 30%</p>
                        <div className="progress mb-2">
                          <div className="progress-bar bg-success" style={{width: '30%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <button className="btn btn-primary w-100 mb-2">Browse Marketplace</button>
                    <button className="btn btn-success w-100 mb-2">View Reports</button>
                    <button className="btn btn-info w-100">Contact Support</button>
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

export default MerchantDashboard;
