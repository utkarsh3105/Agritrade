import React, { useState, useEffect } from 'react';

const Notification = ({ notifications, onMarkAsRead, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const handleMarkAsRead = (notificationId) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleDelete = (notificationId) => {
    if (onDelete) {
      onDelete(notificationId);
    }
  };

  return (
    <div className="position-relative">
      {/* Notification Bell */}
      <button
        className="btn btn-outline-light position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: 'none' }}
      >
        <i className="fas fa-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" 
             style={{ width: '350px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}>
          <div className="p-3 border-bottom">
            <h6 className="mb-0 fw-bold">Notifications</h6>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-3 text-center text-muted">
              <i className="fas fa-bell-slash fs-4 mb-2"></i>
              <p className="mb-0">No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span className={`badge me-2 ${
                          notification.type === 'success' ? 'bg-success' :
                          notification.type === 'warning' ? 'bg-warning' :
                          notification.type === 'error' ? 'bg-danger' : 'bg-info'
                        }`}>
                          {notification.type === 'farmer_verification' ? '🌾' :
                           notification.type === 'approval' ? '✅' :
                           notification.type === 'rejection' ? '❌' : '📢'}
                        </span>
                        <small className="text-muted">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </small>
                      </div>
                      <h6 className="mb-1 fw-semibold">{notification.title}</h6>
                      <p className="mb-0 text-muted small">{notification.message}</p>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="p-2 border-top">
            <button 
              className="btn btn-sm btn-outline-primary w-100"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Notification;
