import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    closeCart 
  } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Format quantity for display (e.g., 20000 -> 20k)
  const formatQuantity = (quantity) => {
    if (quantity >= 1000) {
      return (quantity / 1000).toFixed(0) + 'k';
    }
    return quantity.toString();
  };

  // Cart bounce animation when items are added
  useEffect(() => {
    if (totalItems > 0) {
      const cartButton = document.querySelector('.cart-button');
      const cartBadge = document.querySelector('.cart-badge');
      
      if (cartButton) {
        cartButton.classList.add('bounce');
        setTimeout(() => cartButton.classList.remove('bounce'), 600);
      }
      
      if (cartBadge) {
        cartBadge.classList.add('pulse');
        setTimeout(() => cartBadge.classList.remove('pulse'), 1000);
      }
    }
  }, [totalItems]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep(1);
  };

  const handlePayment = () => {
    if (!customerInfo.name || !customerInfo.email || !paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Process payment (in real app, this would integrate with payment gateway)
    alert(`Order placed successfully!\n\nTotal: $${(totalPrice * 1.1).toFixed(2)}\nItems: ${totalItems}\nPayment Method: ${paymentMethod}\n\nThank you for your order!`);
    
    clearCart();
    setCheckoutStep(0);
    closeCart();
    setCustomerInfo({ name: '', email: '', phone: '' });
    setPaymentMethod('');
  };

  const handleBack = () => {
    setCheckoutStep(0);
  };

  const showSuccessNotification = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <>
      {showSuccess && (
        <div className="add-to-cart-success">
          Item added to cart!
        </div>
      )}
      
      <div className="cart-overlay">
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Shopping Cart ({totalItems})</h2>
            <button className="close-cart" onClick={closeCart}>×</button>
          </div>

          {checkoutStep === 0 && (
            <>
              <div className="cart-items">
                {items.length === 0 ? (
                  <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                      Add some services to get started!
                    </p>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="cart-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-platform">{item.platform}</p>
                        <p className="item-details">
                          {formatQuantity(item.quantity)} {item.unit} • ${item.price.toFixed(2)}
                        </p>
                        <p className="item-url">{item.url}</p>
                        <p className="item-delivery">{item.deliveryTime}</p>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1000))}
                            disabled={item.quantity <= 1000}
                          >
                            -
                          </button>
                          <span>{formatQuantity(item.quantity)}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1000)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (10%):</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${(totalPrice * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="cart-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear Cart
                    </button>
                    <button className="checkout-btn" onClick={handleCheckout}>
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === 1 && (
            <div className="checkout-form">
              <h3>Checkout Information</h3>
              
              <div className="form-section">
                <h4>👤 Contact Information</h4>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>

              <div className="form-section">
                <h4>💳 Payment Method</h4>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🔵 PayPal</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="solana"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🪙 Solana</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Credit Card</span>
                  </label>
                </div>
              </div>

              <div className="order-summary">
                <h4>📋 Order Summary</h4>
                <div className="summary-items">
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span>{item.name} × {formatQuantity(item.quantity)}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button className="back-btn" onClick={handleBack}>
                  ← Back to Cart
                </button>
                <button className="payment-btn" onClick={handlePayment}>
                  Complete Purchase ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
