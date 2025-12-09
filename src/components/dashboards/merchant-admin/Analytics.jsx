import React from 'react';

const Analytics = () => {
  return (
    <div>
      {/* Analytics Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Analytics</h2>
        <p className="text-muted">Track your business performance and insights</p>
      </div>

      {/* Analytics Stats Cards */}
      <div className="row mb-4">
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
                  <h3 className="mb-0 fw-bold">$45,231</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +17.6% vs last month
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: '50px', height: '50px', backgroundColor: '#4285f4'}}>
                  <i className="bi bi-box text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3 className="mb-0 fw-bold">156</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +9.9% vs last month
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
                  <i className="bi bi-grid-3x3-gap text-white" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Active Products</h6>
                  <h3 className="mb-0 fw-bold">89</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +17.1% vs last month
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
                  <h3 className="mb-0 fw-bold">1234</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> +6.7% vs last month
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        {/* Revenue Trend */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Revenue Trend</h5>
            </div>
            <div className="card-body">
              <div className="revenue-chart">
                {[
                  { month: 'Jan', amount: '$35,000', percentage: 70 },
                  { month: 'Feb', amount: '$42,000', percentage: 84 },
                  { month: 'Mar', amount: '$38,000', percentage: 76 },
                  { month: 'Apr', amount: '$45,000', percentage: 90 },
                  { month: 'May', amount: '$52,000', percentage: 100 },
                  { month: 'Jun', amount: '$48,000', percentage: 92 }
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-muted" style={{width: '40px'}}>{item.month}</span>
                    <span className="fw-semibold me-3" style={{width: '80px', textAlign: 'right'}}>{item.amount}</span>
                    <div className="flex-grow-1 mx-3">
                      <div className="progress" style={{height: '8px'}}>
                        <div 
                          className="progress-bar" 
                          style={{width: `${item.percentage}%`, backgroundColor: '#34a853'}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Orders Trend</h5>
            </div>
            <div className="card-body">
              <div className="orders-chart">
                {[
                  { month: 'Jan', count: '120', percentage: 67 },
                  { month: 'Feb', count: '145', percentage: 81 },
                  { month: 'Mar', count: '135', percentage: 75 },
                  { month: 'Apr', count: '160', percentage: 89 },
                  { month: 'May', count: '180', percentage: 100 },
                  { month: 'Jun', count: '170', percentage: 94 }
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-muted" style={{width: '40px'}}>{item.month}</span>
                    <span className="fw-semibold me-3" style={{width: '50px', textAlign: 'right'}}>{item.count}</span>
                    <div className="flex-grow-1 mx-3">
                      <div className="progress" style={{height: '8px'}}>
                        <div 
                          className="progress-bar" 
                          style={{width: `${item.percentage}%`, backgroundColor: '#4285f4'}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">Top Selling Products</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 text-muted fw-semibold">PRODUCT</th>
                  <th className="border-0 text-muted fw-semibold">SALES</th>
                  <th className="border-0 text-muted fw-semibold">REVENUE</th>
                  <th className="border-0 text-muted fw-semibold">PERFORMANCE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { product: 'Fresh Tomatoes', sales: '234', revenue: '$11,700', performance: 95 },
                  { product: 'Organic Carrots', sales: '189', revenue: '$9,450', performance: 80 },
                  { product: 'Fresh Lettuce', sales: '156', revenue: '$7,800', performance: 65 },
                  { product: 'Bell Peppers', sales: '134', revenue: '$6,700', performance: 55 },
                  { product: 'Cucumbers', sales: '123', revenue: '$6,150', performance: 50 }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{item.product}</td>
                    <td>{item.sales}</td>
                    <td className="fw-semibold">{item.revenue}</td>
                    <td style={{width: '200px'}}>
                      <div className="progress" style={{height: '8px'}}>
                        <div 
                          className="progress-bar" 
                          style={{width: `${item.performance}%`, backgroundColor: '#34a853'}}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
