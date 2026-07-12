import { useState } from 'react';
import { addPaymentLink, PAYMENT_TYPES, PAYMENT_LABELS, getPaymentLinkUrl } from '../services/paymentLinkService';
import './PaymentLinksManager.css';

const PaymentLinksManager = ({ userId, paymentLinks = [], onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(PAYMENT_TYPES.CASHAPP);
  const [identifier, setIdentifier] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    const result = await addPaymentLink(userId, selectedType, identifier, customLabel);
    if (result.success) {
      setIdentifier('');
      setCustomLabel('');
      setSelectedType(PAYMENT_TYPES.CASHAPP);
      setShowForm(false);
      if (onUpdate) onUpdate();
    } else {
      alert('Failed to add payment link: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="payment-links-manager">
      <h3 className="section-title">Payment Links for Fans</h3>
      <p className="section-description">Add your payment accounts so fans can support you on your Creators Corner</p>

      {paymentLinks && paymentLinks.length > 0 && (
        <div className="payment-links-list">
          {paymentLinks.map((link, idx) => (
            <div key={idx} className="payment-link-item">
              <a
                href={getPaymentLinkUrl(link.type, link.identifier)}
                target="_blank"
                rel="noopener noreferrer"
                className="payment-link-button"
                title={`Send ${link.label} to ${link.identifier}`}
              >
                {link.label}
              </a>
              <span className="payment-link-handle">{link.identifier}</span>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button className="add-link-btn" onClick={() => setShowForm(true)}>
          + Add Payment Link
        </button>
      ) : (
        <form className="payment-form" onSubmit={handleAddLink}>
          <div className="form-group">
            <label>Payment Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={loading}
            >
              {Object.entries(PAYMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              {selectedType === PAYMENT_TYPES.CASHAPP && 'Cash App Handle (without $)'}
              {selectedType === PAYMENT_TYPES.VENMO && 'Venmo Username'}
              {selectedType === PAYMENT_TYPES.PAYPAL && 'PayPal.me Username'}
              {selectedType === PAYMENT_TYPES.STRIPE && 'Stripe Link URL'}
              {selectedType === PAYMENT_TYPES.CUSTOM && 'Label'}
              {[PAYMENT_TYPES.BTC, PAYMENT_TYPES.ETH, PAYMENT_TYPES.SOLANA].includes(selectedType) &&
                `${PAYMENT_LABELS[selectedType]} Address`}
            </label>
            <input
              type="text"
              placeholder={
                selectedType === PAYMENT_TYPES.CASHAPP
                  ? 'your_cashapp_handle'
                  : selectedType === PAYMENT_TYPES.VENMO
                    ? 'your_venmo_username'
                    : selectedType === PAYMENT_TYPES.PAYPAL
                      ? 'yourname'
                      : 'Enter identifier'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              maxLength="100"
            />
          </div>

          {selectedType === PAYMENT_TYPES.CUSTOM && (
            <div className="form-group">
              <label>Full URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {selectedType === PAYMENT_TYPES.CUSTOM && !customLabel && (
            <div className="form-group">
              <label>Display Label (optional)</label>
              <input
                type="text"
                placeholder="e.g., Buy Me a Coffee"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                disabled={loading}
                maxLength="50"
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setIdentifier('');
                setCustomLabel('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={!identifier.trim() || loading}>
              {loading ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentLinksManager;
