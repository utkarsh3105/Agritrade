import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';

const sampleOrders = [
  { id: 'ORD-1001', farmer: 'Farmer A', merchant: 'Merchant X', status: 'Pending', date: '2025-07-20', deliveryPerson: null },
  { id: 'ORD-1002', farmer: 'Farmer B', merchant: 'Merchant Y', status: 'In Progress', date: '2025-07-18', deliveryPerson: 'Rohan' },
  { id: 'ORD-1003', farmer: 'Farmer C', merchant: 'Merchant Z', status: 'Delivered', date: '2025-06-30', deliveryPerson: 'Asha' },
  { id: 'ORD-1004', farmer: 'Farmer A', merchant: 'Merchant Y', status: 'Pending', date: '2025-07-22', deliveryPerson: null },
];

const deliveryPeopleSample = ['Rohan', 'Asha', 'Vikas', 'Sita', 'Unassigned'];

function OrderManagementDashboard() {
  const [orders, setOrders] = useState(sampleOrders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const totals = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    return { total, pending, delivered };
  }, [orders]);

  function updateStatus(orderId, newStatus) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  }

  function assignDeliveryPerson(orderId, person) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPerson: person } : o));
  }

  function exportCSV() {
    const header = ['Order ID', 'Farmer', 'Merchant', 'Status', 'Date', 'Delivery Person'];
    const rows = orders.map(o => [o.id, o.farmer, o.merchant, o.status, o.date, o.deliveryPerson || '']);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const filtered = orders.filter(o => {
    if (filterStatus !== 'All' && o.status !== filterStatus) return false;
    if (search && ![o.id, o.farmer, o.merchant].join(' ').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', 
        color: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        position: 'relative'
      }}>
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🚪 Logout
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>Order Management Dashboard</h1>
          <p style={{ margin: '0', fontSize: '1.2em', opacity: 0.9 }}>
            Manage orders, assign deliveries and track status
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        <Card title="Total Orders" value={totals.total} color="#9b59b6" />
        <Card title="Pending Orders" value={totals.pending} color="#e74c3c" />
        <Card title="Delivered Orders" value={totals.delivered} color="#27ae60" />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
              </select>
              <input 
                placeholder="Search orders..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              />
              <button 
                onClick={exportCSV}
                style={{
                  padding: '8px 16px',
                  background: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Export CSV
              </button>
            </div>
            <OrdersTable orders={filtered} onUpdateStatus={updateStatus} onAssignDelivery={assignDeliveryPerson} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <AssignDemo orders={orders} deliveryPeople={deliveryPeopleSample} onAssign={assignDeliveryPerson} />
          </div>
          <div style={{ 
            height: '150px', 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
            margin: '20px 0', 
            textAlign: 'center', 
            lineHeight: '150px',
            borderRadius: '10px',
            border: '2px dashed #dee2e6',
            color: '#6c757d'
          }}>
            Map Integration Coming Soon
          </div>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50' }}>Orders Trend</h3>
            <OrdersChart orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ 
      padding: '25px', 
      background: 'white',
      borderRadius: '15px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      textAlign: 'center',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>{title}</div>
      <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  );
}

function OrdersTable({ orders, onUpdateStatus, onAssignDelivery }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Order ID</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Farmer</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Merchant</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Delivery</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
              <td style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#9b59b6' }}>{o.id}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{o.farmer}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{o.merchant}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: o.status === 'Pending' ? '#f39c12' :
                             o.status === 'In Progress' ? '#3498db' :
                             o.status === 'Delivered' ? '#27ae60' : '#95a5a6',
                  color: 'white'
                }}>
                  {o.status}
                </span>
              </td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                {o.deliveryPerson ? (
                  <span style={{
                    padding: '4px 8px',
                    background: '#e8f5e8',
                    color: '#27ae60',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {o.deliveryPerson}
                  </span>
                ) : (
                  <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>Unassigned</span>
                )}
              </td>
              <td style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>{o.date}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <select 
                    value={o.status} 
                    onChange={e => onUpdateStatus(o.id, e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Delivered</option>
                  </select>
                  <select 
                    value={o.deliveryPerson || 'Unassigned'} 
                    onChange={e => onAssignDelivery(o.id, e.target.value === 'Unassigned' ? null : e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <option>Unassigned</option>
                    <option>Rohan</option>
                    <option>Asha</option>
                    <option>Vikas</option>
                    <option>Sita</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssignDemo({ orders, deliveryPeople, onAssign }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders.length ? orders[0].id : '');
  const [person, setPerson] = useState('Unassigned');
  
  return (
    <div>
      <h3 style={{ marginTop: '0', color: '#2c3e50', marginBottom: '20px' }}>Assign Delivery Person</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <select 
          value={selectedOrderId} 
          onChange={e => setSelectedOrderId(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          {orders.map(o => <option key={o.id} value={o.id}>{o.id} - {o.farmer}</option>)}
        </select>
        <select 
          value={person} 
          onChange={e => setPerson(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option>Unassigned</option>
          {deliveryPeople.map(d => <option key={d}>{d}</option>)}
        </select>
        <button 
          onClick={() => onAssign(selectedOrderId, person === 'Unassigned' ? null : person)}
          style={{
            padding: '8px 16px',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Assign
        </button>
      </div>
      <p style={{ color: '#6c757d', fontSize: '14px', margin: '0' }}>
        Select an order and delivery person to assign them
      </p>
    </div>
  );
}

function OrdersChart({ orders }) {
  const monthly = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const month = new Date(o.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.keys(map).map(k => ({ month: k, orders: map[k] }));
  }, [orders]);

  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={monthly}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="orders" stroke="#9b59b6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Export the component wrapped with ProtectedRoute
export default function ProtectedOrderAdmin() {
  return (
    <ProtectedRoute requiredRole="Order Admin">
      <OrderManagementDashboard />
    </ProtectedRoute>
  );
}
