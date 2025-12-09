import React from 'react';

const Overview = ({ merchantId }) => {
  return (
    <div>
      {/* Welcome Header */}
      <div className="card mb-4" style={{background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)', border: 'none'}}>
        <div className="card-body text-white p-4">
          <h2 className="mb-2 fw-bold">Welcome, Merchant {merchantId || 'tanmay'}!</h2>
          <p className="mb-0 opacity-90">Here's what's happening with your business today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '50px', height: '50px', backgroundColor: '#4285f4'}}>
                  <i className="bi bi-box text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3 className="mb-0 fw-bold">156</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +12% from last month
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '50px', height: '50px', backgroundColor: '#34a853'}}>
                  <i className="bi bi-currency-rupee text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h3 className="mb-0 fw-bold">₹4,52,310</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +20.1% from last month
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '50px', height: '50px', backgroundColor: '#ff9800'}}>
                  <i className="bi bi-graph-up text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Active Orders</h6>
                  <h3 className="mb-0 fw-bold">23</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +5.2% from last month
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '50px', height: '50px', backgroundColor: '#9c27b0'}}>
                  <i className="bi bi-people text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Customers</h6>
                  <h3 className="mb-0 fw-bold">1,234</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +8.1% from last month
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">Recent Orders</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 text-muted fw-semibold">ORDER ID</th>
                  <th className="border-0 text-muted fw-semibold">CUSTOMER</th>
                  <th className="border-0 text-muted fw-semibold">PRODUCT</th>
                  <th className="border-0 text-muted fw-semibold">AMOUNT</th>
                  <th className="border-0 text-muted fw-semibold">STATUS</th>
                  <th className="border-0 text-muted fw-semibold">DATE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">#ORD-001</td>
                  <td>John Doe</td>
                  <td>Wheat Seeds</td>
                  <td className="fw-semibold">₹4,500</td>
                  <td>
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                      Completed
                    </span>
                  </td>
                  <td className="text-muted">2024-01-15</td>
                </tr>
                <tr>
                  <td className="fw-semibold">#ORD-002</td>
                  <td>Jane Smith</td>
                  <td>Organic Fertilizer</td>
                  <td className="fw-semibold">₹3,250</td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning px-3 py-2">
                      Pending
                    </span>
                  </td>
                  <td className="text-muted">2024-01-14</td>
                </tr>
                <tr>
                  <td className="fw-semibold">#ORD-003</td>
                  <td>Mike Johnson</td>
                  <td>Farming Tools</td>
                  <td className="fw-semibold">₹2,875</td>
                  <td>
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                      Completed
                    </span>
                  </td>
                  <td className="text-muted">2024-01-13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
