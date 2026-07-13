import { useEffect, useRef, useState } from 'react';
import {
  PAYMENT_METHODS,
  loadPayPalScript,
  processSolanaPayment,
  checkPhantomWallet,
} from '../services/paymentService';
import { activateCampaign } from '../services/campaignService';

// Payment modal shown when a creator publishes a saved campaign. Charges the
// campaign's own budget (PayPal dynamic amount or Solana) and marks the
// campaign active in Firestore once payment succeeds.
const CampaignPaymentModal = ({ userId, campaign, onClose, onActivated }) => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYPAL);
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const paypalContainerRef = useRef(null);
  const paypalButtonsRef = useRef(null);

  useEffect(() => {
    if (paymentMethod !== PAYMENT_METHODS.PAYPAL) return;
    let cancelled = false;
    setError('');
    loadPayPalScript()
      .then(() => { if (!cancelled) setPaypalReady(true); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load PayPal.'); });
    return () => { cancelled = true; };
  }, [paymentMethod]);

  useEffect(() => {
    if (paymentMethod !== PAYMENT_METHODS.PAYPAL || !paypalReady || !window.paypal) return;
    if (!paypalContainerRef.current) return;

    if (paypalButtonsRef.current && paypalButtonsRef.current.close) {
      paypalButtonsRef.current.close().catch(() => {});
    }
    paypalContainerRef.current.innerHTML = '';

    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          amount: { value: campaign.budget.toFixed(2), currency_code: 'USD' },
          description: `IllySocial Campaign — ${campaign.name}`
        }]
      }),
      onApprove: async (data, actions) => {
        setProcessing(true);
        setError('');
        try {
          const order = await actions.order.capture();
          await activateCampaign(userId, campaign.id, {
            paymentMethod: 'PayPal',
            orderId: order.id,
            paymentDetails: order,
          });
          onActivated();
        } catch (err) {
          setError(err.message || 'Payment succeeded but activation failed. Please contact support.');
        } finally {
          setProcessing(false);
        }
      },
      onError: (err) => {
        setError((err && err.message) || 'PayPal payment failed. Please try again.');
      }
    });

    buttons.render(paypalContainerRef.current);
    paypalButtonsRef.current = buttons;
  }, [paymentMethod, paypalReady, campaign, userId]);

  const handleSolanaPay = async () => {
    setError('');
    if (!checkPhantomWallet()) {
      setError('Phantom wallet not found. Please install the Phantom wallet extension.');
      return;
    }
    setProcessing(true);
    try {
      const result = await processSolanaPayment({
        service: `Campaign: ${campaign.name}`,
        quantity: 1,
        unit: 'campaign',
        price: campaign.budget.toFixed(2),
      });
      if (result.success) {
        await activateCampaign(userId, campaign.id, {
          paymentMethod: 'Solana',
          orderId: result.transactionId,
          paymentDetails: result,
        });
        onActivated();
      } else {
        setError(result.error || 'Solana payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Solana payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="campaign-modal-overlay" onClick={onClose}>
      <div className="campaign-modal" onClick={(e) => e.stopPropagation()}>
        <button className="campaign-modal-close" onClick={onClose} disabled={processing}>×</button>

        <h2>Publish Campaign</h2>
        <p className="campaign-modal-sub">
          Pay to activate <strong>{campaign.name}</strong> — this campaign will start running immediately
          after payment.
        </p>

        <div className="campaign-pay-amount">
          <span>Campaign Budget</span>
          <strong>${campaign.budget.toFixed(2)}</strong>
        </div>

        <div className="payment-methods">
          <button
            type="button"
            className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.PAYPAL ? 'active' : ''}`}
            onClick={() => { setPaymentMethod(PAYMENT_METHODS.PAYPAL); setError(''); }}
            disabled={processing}
          >
            PayPal
          </button>
          <button
            type="button"
            className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.SOLANA ? 'active' : ''}`}
            onClick={() => { setPaymentMethod(PAYMENT_METHODS.SOLANA); setError(''); }}
            disabled={processing}
          >
            Solana (SOL)
          </button>
        </div>

        {error && <p className="payment-error">{error}</p>}

        {paymentMethod === PAYMENT_METHODS.PAYPAL ? (
          <>
            {!paypalReady && !error && <p className="payment-hint">Loading PayPal…</p>}
            <div ref={paypalContainerRef} className="paypal-order-container" />
          </>
        ) : (
          <button
            type="button"
            className="btn-complete"
            onClick={handleSolanaPay}
            disabled={processing}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {processing ? 'Processing…' : `Pay $${campaign.budget.toFixed(2)} with Solana`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignPaymentModal;
