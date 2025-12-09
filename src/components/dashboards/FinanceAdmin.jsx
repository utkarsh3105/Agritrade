import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';

const sampleFinancialData = [
  { id: 'TXN-001', type: 'Payment', amount: 25000, status: 'Completed', date: '2025-07-20', farmer: 'Farmer A', merchant: 'Merchant X' },
  { id: 'TXN-002', type: 'Refund', amount: 5000, status: 'Pending', date: '2025-07-18', farmer: 'Farmer B', merchant: 'Merchant Y' },
  { id: 'TXN-003', type: 'Payment', amount: 15000, status: 'Completed', date: '2025-07-15', farmer: 'Farmer C', merchant: 'Merchant Z' },
  { id: 'TXN-004', type: 'Payment', amount: 30000, status: 'In Progress', date: '2025-07-22', farmer: 'Farmer D', merchant: 'Merchant W' },
  { id: 'TXN-005', type: 'Refund', amount: 8000, status: 'Completed', date: '2025-07-10', farmer: 'Farmer E', merchant: 'Merchant V' },
];

const sampleRevenueData = [
  { month: 'Jan', revenue: 120000, expenses: 80000, profit: 40000 },
  { month: 'Feb', revenue: 150000, expenses: 90000, profit: 60000 },
  { month: 'Mar', revenue: 180000, expenses: 100000, profit: 80000 },
  { month: 'Apr', revenue: 200000, expenses: 110000, profit: 90000 },
  { month: 'May', revenue: 220000, expenses: 120000, profit: 100000 },
  { month: 'Jun', revenue: 250000, expenses: 130000, profit: 120000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function FinanceAdminDashboard() {
  const [transactions, setTransactions] = useState(sampleFinancialData);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const totals = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completedAmount = transactions
      .filter(t => t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions
      .filter(t => t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { totalTransactions, totalAmount, completedAmount, pendingAmount };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'All' && t.type !== filterType) return false;
      if (filterStatus !== 'All' && t.status !== filterStatus) return false;
      if (search && ![t.id, t.farmer, t.merchant].join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filterType, filterStatus, search]);

  const updateTransactionStatus = (transactionId, newStatus) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: newStatus } : t));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const exportFinancialReport = () => {
    const header = ['Transaction ID', 'Type', 'Amount', 'Status', 'Date', 'Farmer', 'Merchant'];
    const rows = filteredTransactions.map(t => [t.id, t.type, t.amount, t.status, t.date, t.farmer, t.merchant]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', 
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
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>Finance Management Dashboard</h1>
          <p style={{ margin: '0', fontSize: '1.2em', opacity: 0.9 }}>
            Monitor financial transactions, revenue, and payment status
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        <Card title="Total Transactions" value={totals.totalTransactions} color="#3498db" />
        <Card title="Total Amount" value={`₹${totals.totalAmount.toLocaleString()}`} color="#27ae60" />
        <Card title="Completed Amount" value={`₹${totals.completedAmount.toLocaleString()}`} color="#2ecc71" />
        <Card title="Pending Amount" value={`₹${totals.pendingAmount.toLocaleString()}`} color="#e74c3c" />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          {/* Transactions Table */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="All">All Types</option>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
              </select>
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
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
              <input 
                placeholder="Search transactions..." 
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
                onClick={exportFinancialReport}
                style={{
                  padding: '8px 16px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Export Report
              </button>
            </div>
            <TransactionsTable 
              transactions={filteredTransactions} 
              onUpdateStatus={updateTransactionStatus} 
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {/* Revenue Chart */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50', marginBottom: '20px' }}>Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sampleRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Types Pie Chart */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50', marginBottom: '20px' }}>Transaction Types</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Payments', value: transactions.filter(t => t.type === 'Payment').length },
                    { name: 'Refunds', value: transactions.filter(t => t.type === 'Refund').length }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50', marginBottom: '20px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                padding: '12px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Generate Monthly Report
              </button>
              <button style={{
                padding: '12px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Process Pending Payments
              </button>
              <button style={{
                padding: '12px',
                background: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Review Refund Requests
              </button>
            </div>
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
      <div style={{ fontSize: '2em', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  );
}

function TransactionsTable({ transactions, onUpdateStatus }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>ID</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Type</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Amount</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Farmer</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Merchant</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
              <td style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#3498db' }}>{t.id}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: t.type === 'Payment' ? '#27ae60' : '#e74c3c',
                  color: 'white'
                }}>
                  {t.type}
                </span>
              </td>
              <td style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>₹{t.amount.toLocaleString()}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: t.status === 'Completed' ? '#27ae60' :
                             t.status === 'Pending' ? '#f39c12' :
                             t.status === 'In Progress' ? '#3498db' : '#95a5a6',
                  color: 'white'
                }}>
                  {t.status}
                </span>
              </td>
              <td style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>{t.date}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{t.farmer}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{t.merchant}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>
                <select 
                  value={t.status} 
                  onChange={e => onUpdateStatus(t.id, e.target.value)}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Export the component wrapped with ProtectedRoute
export default function ProtectedFinanceAdmin() {
  return (
    <ProtectedRoute requiredRole="Finance Admin">
      <FinanceAdminDashboard />
    </ProtectedRoute>
  );
}
