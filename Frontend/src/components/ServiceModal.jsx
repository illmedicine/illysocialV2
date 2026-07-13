import { useState, useEffect, useRef } from 'react';
import {
  PAYMENT_METHODS,
  loadPayPalScript,
  processSolanaPayment,
  checkPhantomWallet
} from '../services/paymentService';

const ServiceModal = ({ service, onClose, onOrder }) => {
  if (!service) return null;

  const [quantity, setQuantity] = useState('');
  const [url, setUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYPAL);
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const paypalContainerRef = useRef(null);
  const paypalButtonsRef = useRef(null);

  const calculatePrice = () => {
    const qty = parseInt(quantity) || 0;
    const price = (qty / 10000) * service.pricePer10k;
    return price.toFixed(2);
  };

  const orderIsValid = () => {
    const price = parseFloat(calculatePrice());
    return Boolean(quantity) && Boolean(url) && price > 0;
  };

  const buildOrderData = (extra = {}) => ({
    service: service.name,
    quantity,
    url,
    price: calculatePrice(),
    paymentMethod,
    ...extra
  });

  // Load the PayPal SDK once, on demand, when the PayPal method is selected.
  useEffect(() => {
    if (paymentMethod !== PAYMENT_METHODS.PAYPAL) return;
    let cancelled = false;
    setPaymentError('');
    loadPayPalScript()
      .then(() => { if (!cancelled) setPaypalReady(true); })
      .catch((err) => { if (!cancelled) setPaymentError(err.message || 'Failed to load PayPal.'); });
    return () => { cancelled = true; };
  }, [paymentMethod]);

  // (Re)render the PayPal Buttons whenever the order becomes valid or the
  // price changes, so createOrder always captures the current amount.
  useEffect(() => {
    if (paymentMethod !== PAYMENT_METHODS.PAYPAL || !paypalReady || !window.paypal) return;
    if (!paypalContainerRef.current) return;

    // Tear down any previously rendered buttons before re-rendering.
    if (paypalButtonsRef.current && paypalButtonsRef.current.close) {
      paypalButtonsRef.current.close().catch(() => {});
    }
    paypalContainerRef.current.innerHTML = '';

    if (!orderIsValid()) return;

    const price = calculatePrice();
    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          amount: { value: price, currency_code: 'USD' },
          description: `${service.name} - ${quantity} ${service.unit}`
        }]
      }),
      onApprove: async (data, actions) => {
        setProcessing(true);
        setPaymentError('');
        try {
          const order = await actions.order.capture();
          onOrder(buildOrderData({
            success: true,
            orderId: order.id,
            paymentDetails: order
          }));
          onClose();
        } catch (err) {
          setPaymentError(err.message || 'PayPal payment failed. Please try again.');
        } finally {
          setProcessing(false);
        }
      },
      onError: (err) => {
        setPaymentError((err && err.message) || 'PayPal payment failed. Please try again.');
      }
    });

    buttons.render(paypalContainerRef.current);
    paypalButtonsRef.current = buttons;
  }, [paymentMethod, paypalReady, quantity, url]);

  const handleSolanaPay = async () => {
    if (!orderIsValid()) return;
    setPaymentError('');
    if (!checkPhantomWallet()) {
      setPaymentError('Phantom wallet not found. Please install the Phantom wallet extension.');
      return;
    }
    setProcessing(true);
    try {
      const result = await processSolanaPayment({
        service: service.name,
        quantity,
        url,
        price: calculatePrice(),
        unit: service.unit
      });
      if (result.success) {
        onOrder(buildOrderData({
          success: true,
          orderId: result.transactionId,
          paymentDetails: result
        }));
        onClose();
      } else {
        setPaymentError(result.error || 'Solana payment failed. Please try again.');
      }
    } catch (err) {
      setPaymentError(err.message || 'Solana payment failed. Please try again.');
    } finally {
      setProcessing(false);
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

          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="url">{service.urlLabel}</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setPaymentError(''); }}
                placeholder={service.urlPlaceholder}
                disabled={processing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity Needed</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setPaymentError(''); }}
                placeholder={`Enter number of ${service.unit}`}
                min="100"
                disabled={processing}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.PAYPAL ? 'active' : ''}`}
                  onClick={() => { setPaymentMethod(PAYMENT_METHODS.PAYPAL); setPaymentError(''); }}
                  disabled={processing}
                >
                  <svg className="payment-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .757-.64h6.953c2.297 0 3.997.595 5.052 1.77.964 1.07 1.345 2.63 1.098 4.64-.015.12-.04.242-.066.367a7.312 7.312 0 0 1-2.76 4.622c-1.26.95-2.887 1.425-4.877 1.425h-1.67c-.5 0-.924.363-1.003.857l-.874 5.533a.641.641 0 0 1-.633.583h-2.43a.641.641 0 0 1-.633-.74l.77-4.864a.641.641 0 0 1 .633-.583h1.55c.5 0 .924-.363 1.003-.857l.874-5.533a.641.641 0 0 1 .633-.583h2.43c.5 0 .924-.363 1.003-.857l-.874 5.533a.641.641 0 0 1-.633.583h-2.43a.641.641 0 0 1-.633-.74l.77-4.864z"></path>
                  </svg>
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.SOLANA ? 'active' : ''}`}
                  onClick={() => { setPaymentMethod(PAYMENT_METHODS.SOLANA); setPaymentError(''); }}
                  disabled={processing}
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

            {paymentError && <p className="payment-error">{paymentError}</p>}

            {paymentMethod === PAYMENT_METHODS.PAYPAL ? (
              <>
                {!orderIsValid() && (
                  <p className="payment-hint">Enter a URL and quantity to reveal the PayPal button.</p>
                )}
                {orderIsValid() && !paypalReady && !paymentError && (
                  <p className="payment-hint">Loading PayPal…</p>
                )}
                <div ref={paypalContainerRef} className="paypal-order-container" />
              </>
            ) : (
              <button
                type="button"
                className="order-btn"
                onClick={handleSolanaPay}
                disabled={!orderIsValid() || processing}
              >
                {processing ? 'Processing…' : 'Pay with Solana'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
