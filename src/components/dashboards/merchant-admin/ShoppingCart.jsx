import React from 'react';
import { useMerchant } from './MerchantContext';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    getCartTotal, 
    navigateToTab 
  } = useMerchant();

  const handleContinueShopping = () => {
    navigateToTab('marketplace');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" 
         style={{width: '400px', zIndex: 1050, overflowY: 'auto'}}>
      
      {/* Cart Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0 fw-bold">Shopping Cart</h5>
        <button className="btn btn-link p-0" onClick={onClose}>
          <i className="bi bi-x-lg" style={{fontSize: '18px'}}></i>
        </button>
      </div>

      {/* Cart Content */}
      <div className="p-3">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-cart" style={{fontSize: '60px', color: '#ccc'}}></i>
            </div>
            <h5 className="mb-3">Your cart is empty</h5>
            <p className="text-muted mb-4">Add some products to get started!</p>
            <button 
              className="btn btn-primary px-4"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="d-flex align-items-center border-bottom py-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="rounded"
                  style={{width: '60px', height: '60px', objectFit: 'cover'}}
                />
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-1 fw-semibold">{item.name}</h6>
                  <p className="text-muted mb-1" style={{fontSize: '14px'}}>
                    {item.category}
                    {item.isSample && (
                      <span className="badge bg-success ms-2">Sample</span>
                    )}
                    {item.isSample && item.sampleSize && (
                      <span className="text-muted ms-2">({item.sampleSize})</span>
                    )}
                  </p>
                  {item.isSample ? (
                    <div className="text-muted" style={{fontSize: '12px'}}>Quantity: 1 (fixed)</div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={{width: '30px', height: '30px', padding: '0'}}
                      >
                        -
                      </button>
                      <span className="mx-2 fw-semibold">{item.quantity}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={{width: '30px', height: '30px', padding: '0'}}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-end">
                  <p className="mb-1 fw-bold">{item.currentPrice}</p>
                  <button 
                    className="btn btn-link p-0 text-danger"
                    onClick={() => removeFromCart(item.id)}
                    style={{fontSize: '14px'}}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Total:</h6>
                <h5 className="mb-0 fw-bold">₹{getCartTotal().toLocaleString()}</h5>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  Proceed to Checkout
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
