import React, { useState } from 'react';
import { useMerchant } from './MerchantContext';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useMerchant();

  // Enhanced product data matching your marketplace design
  const products = [
    {
      id: 1,
      name: 'Basmati Rice',
      category: 'GRAINS',
      description: 'Premium long-grain aromatic rice',
      originalPrice: '₹5,000',
      currentPrice: '₹4,500',
      discount: '-10%',
      rating: 4.2,
      reviews: 95,
      image: '/rice.jpg'
    },
    {
      id: 2,
      name: 'Black Gram (Urad)',
      category: 'PULSES',
      description: 'Traditional black gram for authentic dishes',
      originalPrice: '₹4,500',
      currentPrice: '₹3,800',
      discount: '-15%',
      rating: 4.1,
      reviews: 89,
      image: '/Urad (Black Matpe).jpg'
    },
    {
      id: 3,
      name: 'Black Pepper',
      category: 'SPICES',
      description: 'Premium black pepper for seasoning',
      originalPrice: '₹7,500',
      currentPrice: '₹6,500',
      discount: '-13%',
      rating: 4.3,
      reviews: 134,
      image: '/black pepper.jpg'
    },
    {
      id: 4,
      name: 'Chickpeas (Chana)',
      category: 'PULSES',
      description: 'High-protein chickpeas for cooking',
      originalPrice: '₹4,000',
      currentPrice: '₹3,500',
      discount: '-12%',
      rating: 4.0,
      reviews: 67,
      image: '/chick-pea (chana).jpg'
    },
    {
      id: 5,
      name: 'Premium Wheat',
      category: 'GRAINS',
      description: 'High-quality wheat grains for optimal nutrition',
      originalPrice: '₹3,000',
      currentPrice: '₹2,500',
      discount: '-17%',
      rating: 4.2,
      reviews: 128,
      image: '/wheat.jpeg'
    },
    {
      id: 6,
      name: 'Soybean Seeds',
      category: 'OILSEED',
      description: 'High-quality soybean for oil and protein',
      originalPrice: '₹5,000',
      currentPrice: '₹4,200',
      discount: '-16%',
      rating: 3.9,
      reviews: 45,
      image: '/soyabean seeds.jpg'
    },
    {
      id: 7,
      name: 'Turmeric Powder',
      category: 'SPICES',
      description: 'Pure turmeric powder for health benefits',
      originalPrice: '₹6,800',
      currentPrice: '₹5,800',
      discount: '-15%',
      rating: 4.4,
      reviews: 187,
      image: '/turmeric.jpg'
    },
    {
      id: 8,
      name: 'Yellow Corn',
      category: 'GRAINS',
      description: 'Fresh yellow corn for animal feed and processing',
      originalPrice: '₹3,500',
      currentPrice: '₹2,800',
      discount: '-20%',
      rating: 4.1,
      reviews: 203,
      image: '/corn.jpeg'
    },
    {
      id: 9,
      name: 'Cumin Seeds (Jeera)',
      category: 'SPICES',
      description: 'Aromatic cumin seeds for cooking',
      originalPrice: '₹8,500',
      currentPrice: '₹7,200',
      discount: '-15%',
      rating: 4.3,
      reviews: 156,
      image: '/Jeera (cummin seeds).jpg'
    },
    {
      id: 10,
      name: 'Groundnut (Peanut)',
      category: 'OILSEED',
      description: 'Fresh groundnuts for oil and consumption',
      originalPrice: '₹5,500',
      currentPrice: '₹4,800',
      discount: '-13%',
      rating: 4.0,
      reviews: 92,
      image: '/groundnuts.jpg'
    },
    {
      id: 11,
      name: 'Lentils (Masoor)',
      category: 'PULSES',
      description: 'Nutritious red lentils for healthy meals',
      originalPrice: '₹3,800',
      currentPrice: '₹3,200',
      discount: '-16%',
      rating: 4.2,
      reviews: 156,
      image: '/lentils (masoor).jpg'
    },
    {
      id: 12,
      name: 'Mustard Seeds',
      category: 'OILSEED',
      description: 'Premium mustard seeds for oil extraction',
      originalPrice: '₹6,500',
      currentPrice: '₹5,500',
      discount: '-15%',
      rating: 3.8,
      reviews: 73,
      image: '/rapeseed(mustard seed).avif'
    }
  ];

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'oilseed', label: 'Oilseed' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Marketplace Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Marketplace</h2>
        <p className="text-muted">Discover quality farming products and supplies</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="row align-items-center mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>Sort by Name</option>
            <option>Sort by Price</option>
            <option>Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm position-relative" style={{borderRadius: '12px', overflow: 'hidden'}}>
              {/* Discount Badge */}
              <div className="position-absolute top-0 start-0 m-3" style={{zIndex: 10}}>
                <span className="badge text-white px-2 py-1" style={{backgroundColor: '#dc3545', fontSize: '12px', fontWeight: '600'}}>
                  {product.discount}
                </span>
              </div>
              
              {/* Heart Icon */}
              <div className="position-absolute top-0 end-0 m-3" style={{zIndex: 10}}>
                <button className="btn btn-light rounded-circle p-2" style={{width: '40px', height: '40px', border: 'none'}}>
                  <i className="bi bi-heart text-muted"></i>
                </button>
              </div>

              {/* Product Image */}
              <div className="position-relative">
                <img 
                  src={product.image} 
                  className="card-img-top" 
                  alt={product.name}
                  loading="lazy"
                  width="100%"
                  height="220"
                  style={{height: '220px', objectFit: 'cover'}}
                />
              </div>

              {/* Card Body */}
              <div className="card-body p-4">
                {/* Category */}
                <div className="mb-2">
                  <span className="badge bg-light text-muted text-uppercase" style={{fontSize: '10px', fontWeight: '600'}}>
                    {product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h5 className="card-title fw-bold mb-2" style={{fontSize: '18px'}}>
                  {product.name}
                </h5>

                {/* Description */}
                <p className="text-muted mb-3" style={{fontSize: '14px', lineHeight: '1.4'}}>
                  {product.description}
                </p>

                {/* Rating */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="me-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`bi bi-star${star <= Math.floor(product.rating) ? '-fill' : ''}`}
                        style={{color: '#ffc107', fontSize: '14px'}}
                      ></i>
                    ))}
                  </div>
                  <span className="text-muted" style={{fontSize: '14px'}}>({product.reviews})</span>
                </div>

                {/* Pricing */}
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <h4 className="fw-bold mb-0 me-3" style={{fontSize: '20px'}}>
                      {product.currentPrice}
                    </h4>
                    <span className="text-muted text-decoration-line-through" style={{fontSize: '16px'}}>
                      {product.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <div className="row g-2">
                    <div className="col-6">
                      <button 
                        className="btn btn-primary w-100" 
                        style={{fontSize: '14px', fontWeight: '600'}}
                        onClick={() => addToCart(product)}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Add to Cart
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn btn-success w-100" 
                        style={{fontSize: '14px', fontWeight: '600'}}
                        onClick={() => {
                          addToCart(product);
                          // Could add buy now logic here
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">No products found</h3>
          <p className="text-muted">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
