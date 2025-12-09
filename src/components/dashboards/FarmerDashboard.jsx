import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../common/Notification';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load farmer notifications
    const farmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const userNotifications = farmerNotifications.filter(notification => notification.farmerId === user?.id);
    setNotifications(userNotifications);
  }, [user?.id]);

  const handleMarkNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    const allFarmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const updatedAllNotifications = allFarmerNotifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    localStorage.setItem('farmerNotifications', JSON.stringify(updatedAllNotifications));
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    const allFarmerNotifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');
    const updatedAllNotifications = allFarmerNotifications.filter(notification => notification.id !== notificationId);
    localStorage.setItem('farmerNotifications', JSON.stringify(updatedAllNotifications));
  };

  // Mock Data
  const mockOrders = [
    { id: 1, product: 'Wheat', quantity: '100kg', buyer: 'ABC Traders', status: 'Completed', date: '2024-01-15', amount: '₹2,500' },
    { id: 2, product: 'Rice', quantity: '150kg', buyer: 'XYZ Foods', status: 'Pending', date: '2024-01-18', amount: '₹5,250' },
    { id: 3, product: 'Corn', quantity: '50kg', buyer: 'DEF Corp', status: 'Completed', date: '2024-01-10', amount: '₹1,000' },
  ];
  const mockReceipts = [
    { id: 1, orderId: 1, date: '2024-01-15', amount: '₹2,500', file: '#' },
    { id: 2, orderId: 3, date: '2024-01-10', amount: '₹1,000', file: '#' },
  ];
  const mockTransactions = [
    { id: 1, date: '2024-01-15', description: 'Order #1 Payment', amount: '+₹2,500', type: 'Credit', balance: '₹10,000' },
    { id: 2, date: '2024-01-10', description: 'Order #3 Payment', amount: '+₹1,000', type: 'Credit', balance: '₹7,500' },
    { id: 3, date: '2024-01-05', description: 'Platform Fee', amount: '-₹100', type: 'Debit', balance: '₹6,500' },
  ];
  const mockNotifications = [
    { id: 1, message: 'Order #2 is pending confirmation.', date: '2024-01-18' },
    { id: 2, message: 'Payment received for Order #1.', date: '2024-01-15' },
    { id: 3, message: 'Order #3 completed successfully.', date: '2024-01-10' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row bg-success text-white p-3 mb-4">
        <div className="col-md-6">
          <h2>Farmer Dashboard</h2>
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
              <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>My Orders</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'receipts' ? 'active' : ''}`} onClick={() => setActiveTab('receipts')}>Receipts</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>Support</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Orders</h5>
                    <h3>{mockOrders.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Sales</h5>
                    <h3>₹8,750</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <h5 className="card-title">Pending Orders</h5>
                    <h3>{mockOrders.filter(o => o.status === 'Pending').length}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">My Orders / Sales History</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Buyer</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.product}</td>
                          <td>{order.quantity}</td>
                          <td>{order.buyer}</td>
                          <td>
                            <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{order.status}</span>
                          </td>
                          <td>{order.date}</td>
                          <td>{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receipts' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Receipts</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Receipt ID</th>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReceipts.map(receipt => (
                        <tr key={receipt.id}>
                          <td>#{receipt.id}</td>
                          <td>#{receipt.orderId}</td>
                          <td>{receipt.date}</td>
                          <td>{receipt.amount}</td>
                          <td><a href={receipt.file} className="btn btn-sm btn-primary">Download</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Transaction History</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map(tx => (
                        <tr key={tx.id}>
                          <td>{tx.date}</td>
                          <td>{tx.description}</td>
                          <td>{tx.amount}</td>
                          <td>{tx.type}</td>
                          <td>{tx.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Notifications</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {mockNotifications.map(note => (
                    <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {note.message}
                      <span className="badge bg-secondary">{note.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Profile & Settings</h5>
              </div>
              <div className="card-body">
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email/ID:</strong> {user?.email}</p>
                <p><strong>Bank Details:</strong> (Not set)</p>
                <button className="btn btn-primary btn-sm me-2">Edit Profile</button>
                <button className="btn btn-secondary btn-sm">Change Password</button>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Support</h5>
              </div>
              <div className="card-body">
                <p>Need help? Contact our support team 24/7.</p>
                <button className="btn btn-info">Contact Support</button>
                <a href="#" className="btn btn-link">FAQ</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
