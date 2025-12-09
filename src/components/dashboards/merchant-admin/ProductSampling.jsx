import React, { useState } from 'react';
import { useMerchant } from './MerchantContext';

const ProductSampling = () => {
  const { addToCart, openCart, showNotification } = useMerchant();
  const [activeTab, setActiveTab] = useState('available');

  // Sample data for available samples
  const availableSamples = [
    {
      id: 1,
      name: 'Premium Basmati Rice',
      farmer: 'Rajesh Kumar',
      location: 'Punjab',
      category: 'Grains',
      sampleSize: '100g',
      price: 'Free',
      image: '/rice.jpg',
      description: 'High-quality aromatic basmati rice sample'
    },
    {
      id: 2,
      name: 'Organic Turmeric Powder',
      farmer: 'Sunita Devi',
      location: 'Kerala',
      category: 'Spices',
      sampleSize: '50g',
      price: 'Free',
      image: '/turmeric.jpg',
      description: 'Pure organic turmeric powder for testing'
    },
    {
      id: 3,
      name: 'Fresh Black Pepper',
      farmer: 'Mohan Singh',
      location: 'Karnataka',
      category: 'Spices',
      sampleSize: '25g',
      price: 'Free',
      image: '/black pepper.jpg',
      description: 'Premium quality black pepper sample'
    },
    {
      id: 4,
      name: 'Cumin Seeds (Jeera)',
      farmer: 'Amit Patel',
      location: 'Rajasthan',
      category: 'Spices',
      sampleSize: '40g',
      price: 'Free',
      image: '/Jeera (cummin seeds).jpg',
      description: 'Aromatic cumin seeds sample for cooking'
    },
    {
      id: 5,
      name: 'Cardamom Green',
      farmer: 'Deepa Nair',
      location: 'Kerala',
      category: 'Spices',
      sampleSize: '20g',
      price: 'Free',
      image: '/cardomom green.jpg',
      description: 'Premium green cardamom sample'
    },
    {
      id: 6,
      name: 'Coriander Seeds',
      farmer: 'Vikram Sharma',
      location: 'Madhya Pradesh',
      category: 'Spices',
      sampleSize: '40g',
      price: 'Free',
      image: '/coriander seed.webp',
      description: 'Fresh coriander seeds sample'
    },
    {
      id: 7,
      name: 'Red Chillies',
      farmer: 'Kavita Sharma',
      location: 'Andhra Pradesh',
      category: 'Spices',
      sampleSize: '30g',
      price: 'Free',
      image: '/red chillies.jpg',
      description: 'Dried red chillies sample'
    },
    {
      id: 8,
      name: 'Chickpeas (Chana)',
      farmer: 'Harpreet Singh',
      location: 'Punjab',
      category: 'Pulses',
      sampleSize: '80g',
      price: 'Free',
      image: '/chick-pea (chana).jpg',
      description: 'Protein-rich chickpeas sample'
    },
    {
      id: 9,
      name: 'Lentils (Masoor)',
      farmer: 'Suresh Yadav',
      location: 'Uttar Pradesh',
      category: 'Pulses',
      sampleSize: '80g',
      price: 'Free',
      image: '/lentils (masoor).jpg',
      description: 'Nutritious red lentils sample'
    },
    {
      id: 10,
      name: 'Urad (Black Matpe)',
      farmer: 'Mukesh Jain',
      location: 'Rajasthan',
      category: 'Pulses',
      sampleSize: '80g',
      price: 'Free',
      image: '/Urad (Black Matpe).jpg',
      description: 'Urad dal (black gram) sample'
    },
    {
      id: 11,
      name: 'Tur Dal (Pigeon Pea)',
      farmer: 'Nilesh Patil',
      location: 'Maharashtra',
      category: 'Pulses',
      sampleSize: '80g',
      price: 'Free',
      image: '/tur daal (pigeon pea).jpg',
      description: 'Popular pigeon pea sample'
    },
    {
      id: 12,
      name: 'Peas',
      farmer: 'Anita Kumari',
      location: 'Bihar',
      category: 'Pulses',
      sampleSize: '80g',
      price: 'Free',
      image: '/peas.jpg',
      description: 'Dried green peas sample'
    },
    {
      id: 13,
      name: 'Groundnut (Peanut)',
      farmer: 'Ravi Patel',
      location: 'Gujarat',
      category: 'Oilseed',
      sampleSize: '80g',
      price: 'Free',
      image: '/groundnuts.jpg',
      description: 'Fresh groundnut sample'
    },
    {
      id: 14,
      name: 'Mustard Seeds',
      farmer: 'Prakash Meena',
      location: 'Rajasthan',
      category: 'Oilseed',
      sampleSize: '60g',
      price: 'Free',
      image: '/rapeseed(mustard seed).avif',
      description: 'Premium mustard seeds sample'
    },
    {
      id: 15,
      name: 'Soyabean Seeds',
      farmer: 'Mahesh Chouhan',
      location: 'Madhya Pradesh',
      category: 'Oilseed',
      sampleSize: '80g',
      price: 'Free',
      image: '/soyabean seeds.jpg',
      description: 'High-quality soybean seeds sample'
    },
    {
      id: 16,
      name: 'Yellow Corn (Maize)',
      farmer: 'Sanjay Verma',
      location: 'Bihar',
      category: 'Grains',
      sampleSize: '100g',
      price: 'Free',
      image: '/maize.jpg',
      description: 'Fresh yellow corn sample'
    },
    {
      id: 17,
      name: 'Premium Wheat',
      farmer: 'Karan Chauhan',
      location: 'Punjab',
      category: 'Grains',
      sampleSize: '100g',
      price: 'Free',
      image: '/wheat.jpeg',
      description: 'High-quality wheat grains sample'
    }
  ];

  // Sample data for requested samples
  const requestedSamples = [
    {
      id: 1,
      name: 'Premium Basmati Rice',
      farmer: 'Rajesh Kumar',
      requestDate: '2024-01-15',
      status: 'Pending',
      trackingId: 'SP001',
      expectedDelivery: '2024-01-20'
    },
    {
      id: 2,
      name: 'Organic Turmeric Powder',
      farmer: 'Sunita Devi',
      requestDate: '2024-01-12',
      status: 'Shipped',
      trackingId: 'SP002',
      expectedDelivery: '2024-01-18'
    }
  ];

  const handleRequestSample = (sample) => {
    // Add a zero-price sample item to cart
    const cartItem = {
      id: `sample-${sample.id}`,
      name: sample.name,
      category: `${sample.category} (Sample)`,
      image: sample.image,
      currentPrice: '₹0',
      originalPrice: '₹0',
      discount: 'FREE',
      isSample: true,
      sampleSize: sample.sampleSize
    };
    addToCart(cartItem);
    showNotification('Sample added to cart (Free)', 'success');
    openCart();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Shipped':
        return 'bg-info text-white';
      case 'Delivered':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Product Sampling</h2>
        <p className="text-muted">Request and track product samples from farmers</p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => setActiveTab('available')}
            >
              <i className="bi bi-gift me-2"></i>
              Available Samples
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'requested' ? 'active' : ''}`}
              onClick={() => setActiveTab('requested')}
            >
              <i className="bi bi-clock me-2"></i>
              My Requests
            </button>
          </li>
        </ul>
      </div>

      {/* Available Samples Tab */}
      {activeTab === 'available' && (
        <div className="row">
          {availableSamples.map(sample => (
            <div key={sample.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '12px'}}>
                <div className="position-relative">
                  <img 
                    src={sample.image} 
                    className="card-img-top" 
                    alt={sample.name}
                    loading="lazy"
                    width="100%"
                    height="200"
                    style={{height: '200px', objectFit: 'cover'}}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-success text-white px-2 py-1">
                      FREE SAMPLE
                    </span>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <div className="mb-2">
                    <span className="badge bg-light text-muted text-uppercase" style={{fontSize: '10px'}}>
                      {sample.category}
                    </span>
                  </div>
                  
                  <h5 className="card-title fw-bold mb-2">{sample.name}</h5>
                  
                  <p className="text-muted mb-3" style={{fontSize: '14px'}}>
                    {sample.description}
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-muted mb-1" style={{fontSize: '14px'}}>
                      <i className="bi bi-person me-1"></i>
                      Farmer: {sample.farmer}
                    </p>
                    <p className="text-muted mb-1" style={{fontSize: '14px'}}>
                      <i className="bi bi-geo-alt me-1"></i>
                      Location: {sample.location}
                    </p>
                    <p className="text-muted mb-0" style={{fontSize: '14px'}}>
                      <i className="bi bi-box me-1"></i>
                      Sample Size: {sample.sampleSize}
                    </p>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleRequestSample(sample)}
                    >
                      <i className="bi bi-download me-2"></i>
                      Request Sample (Free)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requested Samples Tab */}
      {activeTab === 'requested' && (
        <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
          <div className="card-header bg-white border-bottom p-4">
            <h5 className="mb-0 fw-bold">Sample Requests</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">PRODUCT</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">FARMER</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">REQUEST DATE</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">STATUS</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">TRACKING ID</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">EXPECTED DELIVERY</th>
                    <th className="border-0 text-muted fw-semibold py-3 px-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {requestedSamples.map(request => (
                    <tr key={request.id}>
                      <td className="fw-semibold py-3 px-4">{request.name}</td>
                      <td className="py-3 px-4">{request.farmer}</td>
                      <td className="text-muted py-3 px-4">{request.requestDate}</td>
                      <td className="py-3 px-4">
                        <span className={`badge px-3 py-2 ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="fw-semibold py-3 px-4">{request.trackingId}</td>
                      <td className="text-muted py-3 px-4">{request.expectedDelivery}</td>
                      <td className="py-3 px-4">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <i className="bi bi-truck"></i> Track
                        </button>
                        {request.status === 'Delivered' && (
                          <button className="btn btn-sm btn-outline-success">
                            <i className="bi bi-star"></i> Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Requested Samples */}
      {activeTab === 'requested' && requestedSamples.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">No sample requests yet</h3>
          <p className="text-muted">Start by requesting samples from the available products</p>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('available')}
          >
            Browse Available Samples
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSampling;
