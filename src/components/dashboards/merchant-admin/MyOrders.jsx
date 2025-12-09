import React, { useState } from 'react';

const MyOrders = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample orders data matching your design
  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      product: 'Fresh Tomatoes',
      quantity: '50',
      price: '$45.00',
      status: 'Completed',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      product: 'Organic Carrots',
      quantity: '30',
      price: '$32.50',
      status: 'Pending',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      product: 'Fresh Lettuce',
      quantity: '25',
      price: '$28.75',
      status: 'Completed',
      date: '2024-01-13'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      product: 'Bell Peppers',
      quantity: '40',
      price: '$36.00',
      status: 'Pending',
      date: '2024-01-12'
    },
    {
      id: 'ORD-005',
      customer: 'David Brown',
      product: 'Cucumbers',
      quantity: '35',
      price: '$31.50',
      status: 'Completed',
      date: '2024-01-11'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'in transit', label: 'In Transit' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success-subtle text-success';
      case 'pending':
        return 'bg-warning-subtle text-warning';
      case 'in transit':
        return 'bg-info-subtle text-info';
      case 'cancelled':
        return 'bg-danger-subtle text-danger';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-success-subtle text-success';
      case 'pending':
        return 'bg-warning-subtle text-warning';
      case 'refunded':
        return 'bg-info-subtle text-info';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  return (
    <div>
      {/* Orders Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">My Orders</h2>
        <p className="text-muted">Manage and track your orders</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-4 col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body d-flex align-items-center p-4">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{width: '60px', height: '60px', backgroundColor: '#4285f4'}}>
                <i className="bi bi-box text-white" style={{fontSize: '28px'}}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1" style={{fontSize: '14px'}}>Total Orders</h6>
                <h2 className="fw-bold mb-0" style={{fontSize: '32px'}}>{orders.length}</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body d-flex align-items-center p-4">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{width: '60px', height: '60px', backgroundColor: '#ff9800'}}>
                <i className="bi bi-clock text-white" style={{fontSize: '28px'}}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1" style={{fontSize: '14px'}}>Pending Orders</h6>
                <h2 className="fw-bold mb-0" style={{fontSize: '32px'}}>
                  {orders.filter(order => order.status === 'Pending').length}
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body d-flex align-items-center p-4">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{width: '60px', height: '60px', backgroundColor: '#34a853'}}>
                <i className="bi bi-check-circle text-white" style={{fontSize: '28px'}}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1" style={{fontSize: '14px'}}>Completed Orders</h6>
                <h2 className="fw-bold mb-0" style={{fontSize: '32px'}}>
                  {orders.filter(order => order.status === 'Completed').length}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Table */}
      <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
        <div className="card-header bg-white border-bottom-0 p-4">
          <h5 className="mb-0 fw-bold">Order Details</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead style={{backgroundColor: '#f8f9fa'}}>
                <tr>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>ORDER ID</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>CUSTOMER</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>PRODUCT</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>QUANTITY</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>PRICE</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>STATUS</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>ORDER DATE</th>
                  <th className="border-0 text-muted fw-semibold py-3 px-4" style={{fontSize: '12px'}}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                    <td className="fw-semibold py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4" style={{color: '#4285f4'}}>{order.product}</td>
                    <td className="py-3 px-4">{order.quantity}</td>
                    <td className="fw-semibold py-3 px-4">{order.price}</td>
                    <td className="py-3 px-4">
                      {order.status === 'Completed' ? (
                        <span className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span className="text-success fw-semibold">Completed</span>
                        </span>
                      ) : (
                        <span className="d-flex align-items-center">
                          <i className="bi bi-clock-fill text-warning me-2"></i>
                          <span className="text-warning fw-semibold">Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="text-muted py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className="text-primary me-3" style={{cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>
                        View
                      </span>
                      <span className="text-primary" style={{cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>
                        Update
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-bag-x display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">No orders found</h3>
          <p className="text-muted">No orders match the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
