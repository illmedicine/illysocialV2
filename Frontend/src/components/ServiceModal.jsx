import { useState } from 'react';
import { PAYMENT_METHODS } from '../services/paymentService';

const ServiceModal = ({ service, onClose, onOrder }) => {
  if (!service) return null;

  const [quantity, setQuantity] = useState('');
  const [url, setUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYPAL);

  const calculatePrice = () => {
    const qty = parseInt(quantity) || 0;
    const price = (qty / 10000) * service.pricePer10k;
    return price.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity && url) {
      onOrder({
        service: service.name,
        quantity,
        url,
        price: calculatePrice(),
        paymentMethod
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">{service.icon}</div>
          <h2 className="modal-title">{service.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">{service.description}</p>
          
          <div className="modal-info">
            <div className="info-item">
              <span className="info-label">Price:</span>
              <span className="info-value">${service.pricePer10k} per 10k</span>
            </div>
            <div className="info-item">
              <span className="info-label">Delivery Time:</span>
              <span className="info-value">{service.deliveryTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quality:</span>
              <span className="info-value">{service.quality}</span>
            </div>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="url">{service.urlLabel}</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={service.urlPlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity Needed</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Enter number of ${service.unit}`}
                min="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.PAYPAL ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.PAYPAL)}
                >
                  <svg className="payment-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .757-.64h6.953c2.297 0 3.997.595 5.052 1.77.964 1.07 1.345 2.63 1.098 4.64-.015.12-.04.242-.066.367a7.312 7.312 0 0 1-2.76 4.622c-1.26.95-2.887 1.425-4.877 1.425h-1.67c-.5 0-.924.363-1.003.857l-.874 5.533a.641.641 0 0 1-.633.583h-2.43a.641.641 0 0 1-.633-.74l.77-4.864a.641.641 0 0 1 .633-.583h1.55c.5 0 .924-.363 1.003-.857l.874-5.533a.641.641 0 0 1 .633-.583h2.43c.5 0 .924-.363 1.003-.857l-.874 5.533a.641.641 0 0 1-.633.583h-2.43a.641.641 0 0 1-.633-.74l.77-4.864z"></path>
                  </svg>
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.SOLANA ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.SOLANA)}
                >
                  <svg className="payment-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 3.5a3.5 3.5 0 0 0-3.5 3.5v11a3.5 3.5 0 0 0 3.5 3.5h1a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 0 0-3.5-3.5h-1zM5.5 3.5a3.5 3.5 0 0 0-3.5 3.5v11a3.5 3.5 0 0 0 3.5 3.5h1a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 0 0-3.5-3.5h-1z"></path>
                  </svg>
                  <span>Solana (SOL)</span>
                </button>
              </div>
            </div>

            {quantity && (
              <div className="price-display">
                <span className="price-label">Estimated Price:</span>
                <span className="price-value">${calculatePrice()}</span>
              </div>
            )}

            <button type="submit" className="order-btn">Place Order</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
